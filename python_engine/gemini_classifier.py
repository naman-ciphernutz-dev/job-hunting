"""
Google Gemini 4 Argon Powered Classifier for Job Hunt Autopilot.
Uses Google AI Studio / Gemini API with Structured Outputs (JSON schema).
Model ID: gemini-4-argon (Frontier) with fallback to gemini-2.5-flash.
"""

import os
import json
from typing import Dict, Any, List, Optional
from datetime import date
from .classifier import classify_email as rule_based_classify
from .followup import DEFAULT_REFERENCE_DATE

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-4-argon")

STRUCTURED_OUTPUT_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "category": {
            "type": "STRING",
            "enum": ["applied", "interview", "rejected", "offer", "scam"]
        },
        "is_scam": {"type": "BOOLEAN"},
        "scam_confidence": {"type": "NUMBER"},
        "scam_reasons": {
            "type": "ARRAY",
            "items": {"type": "STRING"}
        },
        "scam_signals": {
            "type": "ARRAY",
            "items": {"type": "STRING"}
        },
        "company": {"type": "STRING"},
        "needs_followup": {"type": "BOOLEAN"},
        "days_silent": {"type": "INTEGER"},
        "followup_draft": {"type": "STRING"}
    },
    "required": ["category", "is_scam", "scam_reasons", "scam_signals", "company", "needs_followup", "days_silent"]
}


def classify_with_gemini(email_item: Dict[str, Any], api_key: Optional[str] = None, ref_date: Optional[date] = None) -> Dict[str, Any]:
    """
    Classify email using Google Gemini 4 Argon with Structured Output.
    If no API key is provided, gracefully falls back to the high-precision local heuristics engine.
    """
    api_key = api_key or os.environ.get("GEMINI_API_KEY")

    if not api_key:
        # Fallback to local rule engine
        return rule_based_classify(email_item, ref_date)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are the Job Hunt Autopilot classifier built with Google Gemini for post-layoff job seekers.
Analyze the following incoming email.
Current Reference Date: {(ref_date or DEFAULT_REFERENCE_DATE).strftime('%Y-%m-%d')}

EMAIL:
From: {email_item.get('from')}
Date: {email_item.get('date')}
Subject: {email_item.get('subject')}
Body:
{email_item.get('body')}

INSTRUCTIONS:
1. Classify the email into exactly ONE of:
   - 'scam': Fake offers, advance fee fraud ('training fee', 'security deposit', 'laptop courier charges', 'Rs 4,999'), sensitive KYC phishing (Aadhaar/PAN), free webmail corporate impersonation (@gmail.com claiming to be Infosys/TCS/Wipro), Telegram/WhatsApp redirects, Hinglish recruitment scams.
   - 'offer': Genuine formal employment offers with package details from verified corporate domains without asking fees.
   - 'interview': Technical rounds, code pairs, hiring manager chats, scheduling links (Calendly).
   - 'rejected': Polite rejections or closed positions.
   - 'applied': Application received or confirmation.
2. If days between email date and reference date >= 7 and stage is 'applied' or 'interview', set needs_followup = true and write a polite follow-up draft.
"""

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=STRUCTURED_OUTPUT_SCHEMA,
                temperature=0.1
            )
        )

        parsed = json.loads(response.text)
        return {
            "id": email_item.get("id"),
            "date": email_item.get("date"),
            "from": email_item.get("from"),
            "subject": email_item.get("subject"),
            "body": email_item.get("body"),
            "category": parsed.get("category", "applied"),
            "scam_analysis": {
                "is_scam": parsed.get("is_scam", False),
                "score": int(parsed.get("scam_confidence", 0.9) * 100) if parsed.get("is_scam") else 0,
                "confidence": parsed.get("scam_confidence", 0.95),
                "signals": parsed.get("scam_signals", []),
                "reasons": parsed.get("scam_reasons", [])
            },
            "followup": {
                "needs_followup": parsed.get("needs_followup", False),
                "days_silent": parsed.get("days_silent", 0),
                "company": parsed.get("company", "Hiring Team"),
                "urgency": "HIGH" if parsed.get("days_silent", 0) >= 12 else "MEDIUM",
                "followup_draft": parsed.get("followup_draft")
            },
            "powered_by": f"Google {GEMINI_MODEL}"
        }

    except Exception:
        # Fallback to local rule engine if offline or library missing
        res = rule_based_classify(email_item, ref_date)
        res["powered_by"] = "Rule Engine (Gemini Compatible)"
        return res
