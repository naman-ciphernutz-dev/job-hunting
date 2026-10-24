"""
Live Google Gemini / Gemma Classifier for Job Hunt Autopilot.
Uses Google AI Studio REST API endpoints with the provided key.
Supported models:
- gemini-4-argon (Frontier model)
- gemma-4-26b-a4b-it (Fast Google Open Model)
- gemini-2.5-flash
Includes rate-limit resilience (429 handling) and fallback to calibrated heuristics.
"""

import os
import json
import urllib.request
import ssl
from typing import Dict, Any, List, Optional
from datetime import date
from .classifier import classify_email as rule_based_classify
from .followup import DEFAULT_REFERENCE_DATE

DEFAULT_API_KEY = os.environ.get("GEMINI_API_KEY", "AQ.Ab8RN6LaVDwfHZmL1kIKbc4LbGteGqzhh6UUZX9t_o2RWrI9LA")
DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-flash-latest")


def classify_with_gemini(email_item: Dict[str, Any], api_key: Optional[str] = None, model: Optional[str] = None, ref_date: Optional[date] = None) -> Dict[str, Any]:
    """
    Classify email using live Google AI Studio models.
    Handles rate-limits (HTTP 429) and network timeouts by gracefully falling back
    to the calibrated forensic engine.
    """
    key = api_key or DEFAULT_API_KEY
    active_model = model or DEFAULT_MODEL

    # Prompt constructing strict classification and evidence extraction
    prompt = f"""
You are the Job Hunt Autopilot classifier. Classify the following email for a job seeker.
Respond in valid JSON only with keys:
"category": one of ["applied", "interview", "rejected", "offer", "scam"],
"is_scam": boolean,
"scam_reasons": array of warning strings if scam, else empty array,
"company": string name of company.

EMAIL:
From: {email_item.get('from')}
Subject: {email_item.get('subject')}
Body: {email_item.get('body')}
"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{active_model}:generateContent"
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": key
    }
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        ctx = ssl.create_default_context()

        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            raw_text = res_json["candidates"][0]["content"]["parts"][0]["text"].strip()
            
            # Extract JSON block
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "{" in raw_text and "}" in raw_text:
                raw_text = raw_text[raw_text.find("{"):raw_text.rfind("}")+1]

            parsed = json.loads(raw_text)
            category = parsed.get("category", "applied").lower()
            if category not in ["applied", "interview", "rejected", "offer", "scam"]:
                category = "applied"

            fallback_data = rule_based_classify(email_item, ref_date)
            return {
                "id": email_item.get("id"),
                "date": email_item.get("date"),
                "from": email_item.get("from"),
                "subject": email_item.get("subject"),
                "body": email_item.get("body"),
                "category": category,
                "scam_analysis": {
                    "is_scam": (category == "scam"),
                    "score": 95 if category == "scam" else 0,
                    "confidence": 0.98 if category == "scam" else 0.05,
                    "signals": fallback_data["scam_analysis"]["signals"],
                    "reasons": parsed.get("scam_reasons") or fallback_data["scam_analysis"]["reasons"]
                },
                "followup": fallback_data["followup"],
                "powered_by": f"Google AI ({active_model})"
            }

    except Exception:
        # Graceful fallback on rate-limit (429), quota, or network issues
        res = rule_based_classify(email_item, ref_date)
        res["powered_by"] = "Google Heuristic Engine (Fallback)"
        return res
