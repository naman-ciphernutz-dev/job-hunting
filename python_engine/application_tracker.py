"""
Application Tracker & Lifecycle Aggregator for Job Hunt Autopilot.
Resolves Gap A & Gap C:
- Groups incoming emails into persistent, unified Application Records by company & role.
- Advances application lifecycle state based on chronological timeline (Applied -> Interview -> Offer / Rejected).
- Computes deterministic 7-day follow-up rules based on employer inactivity since last meaningful communication.
- Isolates fraudulent scam emails into a dedicated risk quarantine.
"""

from datetime import datetime, date
from typing import List, Dict, Any, Optional
import re
from .followup import parse_date_safely, generate_followup_draft, DEFAULT_REFERENCE_DATE


def normalize_company_name(raw_name: str, sender_email: str) -> str:
    """Standardize company name for accurate grouping."""
    raw = raw_name.strip()
    # If company is too generic or looks like an email subject fragment, extract from sender domain
    generic_terms = ["hiring team", "recruiting team", "careers", "talent", "the hiring team", "application", "update"]
    if not raw or any(g == raw.lower() for g in generic_terms):
        if "@" in sender_email:
            domain = sender_email.split("@")[-1].lower()
            parts = domain.split(".")
            if len(parts) >= 2:
                return parts[0].capitalize()

    # Clean punctuation
    cleaned = re.sub(r"^(application\s*(received|for|confirmation)?\s*:?\s*)", "", raw, flags=re.I).strip()
    return cleaned.capitalize() if cleaned else "Company"


def extract_role_title(subject: str, body: str) -> str:
    """Extract role title from email subject or body."""
    # Common patterns: 'Backend Engineer', 'Senior Software Engineer', 'SDE 2'
    role_patterns = [
        r"(?:for\s+|:\s*)(Senior\s+Backend\s+Engineer|Backend\s+Engineer|Senior\s+Software\s+Engineer|Software\s+Engineer|SDE\s*2|Senior\s+Systems\s+Engineer|Backend\s+Platform\s+Engineer)",
        r"(Senior\s+Backend\s+Engineer|Backend\s+Engineer|Senior\s+Software\s+Engineer|Software\s+Engineer|SDE\s*2|Backend\s+Platform\s+Engineer)"
    ]
    for pat in role_patterns:
        match = re.search(pat, subject, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return "Software Engineer"


def group_emails_into_applications(classified_emails: List[Dict[str, Any]], ref_date: Optional[date] = None) -> Dict[str, Any]:
    """
    Group classified emails by Company into unified Application Records.
    Maintains full chronological communication timeline, handles out-of-order emails,
    and deduplicates re-imported emails.
    """
    if ref_date is None:
        ref_date = DEFAULT_REFERENCE_DATE

    scam_records = []
    seen_scam_ids = set()
    app_buckets: Dict[str, Dict[str, Any]] = {}
    seen_app_email_keys = set()

    for email in classified_emails:
        email_id = email.get("id")
        
        # 1. Quarantine Scams (part of single pipeline, filtered view)
        if email.get("category") == "scam":
            if email_id not in seen_scam_ids:
                seen_scam_ids.add(email_id)
                scam_records.append(email)
            continue

        # 2. Legitimate Applications grouping
        company_raw = email["followup"].get("company", "")
        company = normalize_company_name(company_raw, email.get("from", ""))
        role = extract_role_title(email.get("subject", ""), email.get("body", ""))
        app_key = company.lower()

        # Deduplication check: prevent duplicate emails within application
        email_unique_key = f"{app_key}:{email_id}:{email.get('date')}:{email.get('subject')}"
        if email_unique_key in seen_app_email_keys:
            continue
        seen_app_email_keys.add(email_unique_key)

        if app_key not in app_buckets:
            app_buckets[app_key] = {
                "app_id": f"APP-{len(app_buckets) + 1:03d}",
                "company": company,
                "role": role,
                "current_stage": "applied",
                "emails": [],
                "created_date": email.get("date"),
                "last_event_date": email.get("date"),
                "days_silent": 0,
                "needs_followup": False,
                "followup_draft": None
            }

        app = app_buckets[app_key]
        if role != "Software Engineer" and app["role"] == "Software Engineer":
            app["role"] = role
        app["emails"].append(email)

    # Sort each application's emails chronologically and determine current lifecycle stage
    applications_list = []

    for app_key, app in app_buckets.items():
        # Sort emails chronologically by date
        app["emails"].sort(key=lambda x: parse_date_safely(x.get("date")))
        
        # Timeline bounds
        first_date = parse_date_safely(app["emails"][0].get("date"))
        last_date = parse_date_safely(app["emails"][-1].get("date"))
        app["created_date"] = first_date.strftime("%Y-%m-%d")
        app["last_event_date"] = last_date.strftime("%Y-%m-%d")

        # Determine current stage based on chronological progression
        # Terminal state protection: if an application is formally rejected, an older acknowledgment email cannot revert it
        stages_in_thread = [e.get("category", "applied") for e in app["emails"]]
        latest_email = app["emails"][-1]
        
        if "offer" in stages_in_thread:
            app["current_stage"] = "offer"
        elif "rejected" in stages_in_thread:
            app["current_stage"] = "rejected"
        else:
            app["current_stage"] = latest_email.get("category", "applied")

        # Deterministic 7-day follow-up calculation:
        # Strictly applies ONLY to active stages (applied or interview).
        # Overdue if days since the LAST employer email >= 7
        days_silent = max(0, (ref_date - last_date).days)
        app["days_silent"] = days_silent

        is_active_stage = app["current_stage"] in ["applied", "interview"]
        app["needs_followup"] = is_active_stage and (days_silent >= 7)

        if app["needs_followup"]:
            app["followup_draft"] = generate_followup_draft(
                app["company"],
                latest_email.get("subject", app["role"]),
                days_silent,
                app["current_stage"]
            )
        else:
            app["followup_draft"] = None

        applications_list.append(app)

    # Sort applications by last event date descending
    applications_list.sort(key=lambda x: parse_date_safely(x["last_event_date"]), reverse=True)

    # Aggregated application stage metrics
    stage_counts = {"applied": 0, "interview": 0, "rejected": 0, "offer": 0}
    followups_due = 0

    for app in applications_list:
        stage = app["current_stage"]
        stage_counts[stage] = stage_counts.get(stage, 0) + 1
        if app["needs_followup"]:
            followups_due += 1

    return {
        "total_applications": len(applications_list),
        "stage_counts": stage_counts,
        "followups_due": followups_due,
        "applications": applications_list,
        "scam_quarantine": scam_records,
        "total_scams_blocked": len(scam_records)
    }
