"""
Core Classification & Scam Forensics Engine for Job Hunt Autopilot.
Classifies each job communication into one of five states:
- applied
- interview
- rejected
- offer
- scam (flagged in red with detailed forensic reasons)

Incorporates heuristics and signals derived from:
- Kaggle 'Real or Fake Job Posting' dataset patterns
- Hugging Face 'Hinglish & English Scam Text' dataset patterns
"""

import re
from typing import Dict, Any, List, Optional
from datetime import date
from .followup import evaluate_followup, DEFAULT_REFERENCE_DATE

# Known enterprise brands frequently impersonated in Indian tech recruitment scams
KNOWN_ENTERPRISE_BRANDS = [
    "infosys", "tcs", "wipro", "tata consultancy", "amazon", "google", 
    "microsoft", "cognizant", "accenture", "hcl", "tech mahindra", "deloitte"
]

# Free or unverified webmail providers
FREE_MAIL_PROVIDERS = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "yopmail.com"
]

# Advance Fee Fraud Regex Patterns
FEE_PATTERNS = [
    r"(?:training|registration|processing|security|courier|dispatch|verification|laptop|asset|onboarding)\s*(?:fee|fees|charge|charges|deposit|amount|cost)",
    r"(?:refundable\s*(?:fee|deposit|charges|amount))",
    r"(?:pay|transfer|deposit|upi)\s*(?:rs\.?|inr)\s*[\d,]+",
    r"(?:rs\.?|inr)\s*[\d,]+\s*(?:fee|deposit|charge|charges|refundable|via\s*upi)",
    r"(?:pay\s*(?:via|through)?\s*upi)"
]

# Document Phishing Patterns
PHISHING_PATTERNS = [
    r"\b(?:aadhaar|aadhar|pan\s*card|voter\s*id|passport\s*copy|bank\s*details|cancelled\s*cheque)\b",
    r"(?:send|submit|share|email)\s*(?:your)?\s*(?:aadhaar|pan|bank)"
]

# Suspicious Urgency / No-Interview Offer Patterns
UNREALISTIC_OFFER_PATTERNS = [
    r"\b(?:direct\s*selection|direct\s*joining|no\s*interview\s*needed|interview\s*(?:waived|round\s*waived))\b",
    r"\b(?:selected\s*directly|turant\s*joining|instant\s*offer)\b",
    r"\b(?:earn\s*(?:rs\.?|inr)\s*[\d,]+(?:\s*to\s*[\d,]+)?\s*daily)\b",
    r"\b(?:daily\s*(?:payout|income|earning))\b"
]

# Off-platform communication
OFFPLATFORM_PATTERNS = [
    r"(?:telegram\s*(?:channel|link|@|group))",
    r"(?:whatsapp\s*(?:hr|number|at|\+91))",
    r"(?:contact\s*on\s*(?:telegram|whatsapp))"
]

# Hinglish Scam Nuance Patterns
HINGLISH_SCAM_PATTERNS = [
    r"(?:selection\s*ho\s*gaya\s*hai)",
    r"(?:charges\s*upi\s*karein)",
    r"(?:pehli|first)\s*salary\s*me(?:\s*100%)?\s*refund",
    r"(?:gharbaithe|ghar\s*baithe)",
    r"(?:turant\s*joining)"
]

# Genuine Stage Regex Patterns
STAGE_PATTERNS = {
    "rejected": [
        r"(?:regret\s*to\s*inform)",
        r"(?:not\s*moving\s*forward)",
        r"(?:decided\s*to\s*(?:pursue|move\s*forward\s*with)\s*other\s*candidates)",
        r"(?:decided\s*not\s*to\s*(?:proceed|advance))",
        r"(?:chosen\s*not\s*to\s*proceed)",
        r"(?:role\s*has\s*been\s*placed\s*on\s*hold)",
        r"(?:position\s*(?:has\s*been)?\s*closed)",
        r"(?:wish\s*you\s*(?:the\s*best|success)\s*in\s*your\s*job\s*search)",
        r"(?:not\s*advancing\s*your\s*candidacy)",
        r"(?:will\s*keep\s*your\s*resume\s*on\s*file)"
    ],
    "interview": [
        r"(?:interview\s*invite)",
        r"(?:invitation\s*to\s*(?:interview|code\s*pair))",
        r"(?:round\s*[1-5])",
        r"(?:technical\s*(?:round|screening|discussion|interview))",
        r"(?:system\s*architecture\s*discussion)",
        r"(?:calendly\.com/)",
        r"(?:schedule\s*a\s*(?:call|meeting|slot|round))",
        r"(?:pick\s*a\s*(?:time|slot))",
        r"(?:live\s*coding\s*round)",
        r"(?:pair-programming)"
    ],
    "offer": [
        r"(?:formal\s*offer\s*of\s*employment)",
        r"(?:official\s*offer\s*letter)",
        r"(?:offer\s*letter\s*attached)",
        r"(?:offer\s*package)",
        r"(?:thrilled\s*to\s*(?:formally\s*)?offer)",
        r"(?:delighted\s*to\s*extend\s*a\s*formal\s*offer)",
        r"(?:pleased\s*to\s*offer\s*you\s*the\s*position)"
    ],
    "applied": [
        r"(?:application\s*(?:received|acknowledged|confirmation))",
        r"(?:thanks\s*for\s*applying)",
        r"(?:thank\s*you\s*for\s*applying)",
        r"(?:received\s*your\s*application)",
        r"(?:submitting\s*your\s*application)",
        r"(?:successfully\s*received\s*your\s*application)"
    ]
}


def analyze_scam_signals(email_sender: str, subject: str, body: str) -> Dict[str, Any]:
    """Perform forensic analysis for job scam & fake offer indicators."""
    text = f"{subject}\n{body}".lower()
    sender_lower = email_sender.lower()

    reasons: List[str] = []
    signals: List[str] = []
    score = 0

    # 1. Impersonation Check: Enterprise brand claimed, but sender uses free webmail provider
    sender_domain = sender_lower.split("@")[-1] if "@" in sender_lower else ""
    is_free_mail = any(free in sender_domain for free in FREE_MAIL_PROVIDERS)
    
    brand_matched = None
    for brand in KNOWN_ENTERPRISE_BRANDS:
        if brand in text or brand in sender_lower:
            brand_matched = brand.capitalize()
            break

    if is_free_mail and brand_matched:
        score += 45
        signals.append("IMPERSONATION_FREE_WEBMAIL")
        reasons.append(
            f"Corporate Impersonation: Claims affiliation with {brand_matched}, but originates from free webmail provider (@{sender_domain})."
        )
    elif is_free_mail and ("offer" in subject.lower() or "selection" in subject.lower()):
        score += 30
        signals.append("SUSPICIOUS_FREE_MAIL_OFFER")
        reasons.append(
            f"Suspicious Sender: Job offer sent from free unverified webmail (@{sender_domain}) instead of verified corporate domain."
        )

    # 2. Advance Fee Fraud Check (Mandatory training fee, laptop courier, deposit)
    for pat in FEE_PATTERNS:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            score += 55
            signals.append("ADVANCE_FEE_DEMAND")
            matched_phrase = match.group(0).strip()
            reasons.append(
                f"Advance Fee Fraud: Demands upfront monetary payment/deposit ('{matched_phrase}'). Legitimate employers NEVER charge applicants."
            )
            break

    # 3. Document / Identity Theft Phishing Check (Aadhaar, PAN, Bank Details before legitimate hiring)
    for pat in PHISHING_PATTERNS:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            score += 35
            signals.append("KYC_IDENTITY_PHISHING")
            reasons.append(
                f"Sensitive Document Phishing: Requests confidential government identity proofs (Aadhaar/PAN) prematurely."
            )
            break

    # 4. Unrealistic Offer / Direct Joining Bypass
    for pat in UNREALISTIC_OFFER_PATTERNS:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            score += 35
            signals.append("UNREALISTIC_OFFER_SHORTCUT")
            reasons.append(
                f"Unrealistic Selection Bypass: Claims direct appointment or waived interviews ('{match.group(0)}')."
            )
            break

    # 5. Off-platform contact redirection
    for pat in OFFPLATFORM_PATTERNS:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            score += 25
            signals.append("OFF_PLATFORM_REDIRECT")
            reasons.append(
                f"Off-platform Redirection: Directs applicant to non-traceable channels (Telegram/WhatsApp)."
            )
            break

    # 6. Hinglish Recruitment Scam Phrases
    for pat in HINGLISH_SCAM_PATTERNS:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            score += 30
            signals.append("HINGLISH_SCAM_LINGO")
            reasons.append(
                f"High-risk Scam Phrasing: Matches common regional recruitment fraud vernacular ('{match.group(0)}')."
            )
            break

    is_scam = score >= 50

    return {
        "is_scam": is_scam,
        "score": score,
        "confidence": min(0.99, round(score / 100.0, 2)) if is_scam else 0.05,
        "reasons": reasons,
        "signals": signals
    }


def classify_email(email_item: Dict[str, Any], ref_date: Optional[date] = None) -> Dict[str, Any]:
    """
    Classify a single email once into: applied, interview, rejected, offer, or scam.
    Also calculates follow-up status after 7 days of silence.
    """
    sender = email_item.get("from", "")
    subject = email_item.get("subject", "")
    body = email_item.get("body", "")
    content = f"{subject}\n{body}"

    # First evaluate scam signals
    scam_meta = analyze_scam_signals(sender, subject, body)

    category = "applied"  # default fallback

    if scam_meta["is_scam"]:
        category = "scam"
    else:
        # Check standard stages in order of specificity: Offer -> Rejected -> Interview -> Applied
        stage_scores = {"offer": 0, "rejected": 0, "interview": 0, "applied": 0}
        
        for stage, patterns in STAGE_PATTERNS.items():
            for pat in patterns:
                if re.search(pat, content, re.IGNORECASE):
                    stage_scores[stage] += 1

        # Determine winner
        best_stage = max(stage_scores, key=stage_scores.get)
        if stage_scores[best_stage] > 0:
            category = best_stage
        else:
            # Fallback heuristics
            lower_subj = subject.lower()
            if "interview" in lower_subj or "round" in lower_subj:
                category = "interview"
            elif "reject" in lower_subj or "status" in lower_subj or "update" in lower_subj:
                category = "rejected"
            elif "offer" in lower_subj:
                category = "offer"
            else:
                category = "applied"

    # Evaluate follow-up reminder (7 days without reply for applied/interview)
    followup_meta = evaluate_followup(email_item, category, ref_date)

    return {
        "id": email_item.get("id"),
        "date": email_item.get("date"),
        "from": sender,
        "subject": subject,
        "body": body,
        "category": category,
        "scam_analysis": {
            "is_scam": scam_meta["is_scam"],
            "score": scam_meta["score"],
            "confidence": scam_meta["confidence"],
            "signals": scam_meta["signals"],
            "reasons": scam_meta["reasons"]
        },
        "followup": followup_meta
    }


def process_inbox(emails: List[Dict[str, Any]], ref_date: Optional[date] = None) -> Dict[str, Any]:
    """
    Run pipeline over entire inbox.
    Produces self-updating tracker, fake offers flagged in red, and 7-day follow-up reminders.
    """
    classified_items = [classify_email(e, ref_date) for e in emails]

    summary = {
        "total_emails": len(classified_items),
        "stages": {
            "applied": 0,
            "interview": 0,
            "rejected": 0,
            "offer": 0,
            "scam": 0
        },
        "scams_detected": 0,
        "followups_pending": 0,
        "reference_date": (ref_date or DEFAULT_REFERENCE_DATE).strftime("%Y-%m-%d")
    }

    stage_buckets = {
        "applied": [],
        "interview": [],
        "rejected": [],
        "offer": [],
        "scam": []
    }

    followup_list = []
    scam_alerts = []

    for item in classified_items:
        cat = item["category"]
        summary["stages"][cat] += 1
        stage_buckets[cat].append(item)

        if cat == "scam":
            summary["scams_detected"] += 1
            scam_alerts.append(item)

        if item["followup"]["needs_followup"]:
            summary["followups_pending"] += 1
            followup_list.append(item)

    return {
        "summary": summary,
        "items": classified_items,
        "stage_buckets": stage_buckets,
        "scam_alerts": scam_alerts,
        "followup_reminders": followup_list
    }
