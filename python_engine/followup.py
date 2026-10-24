"""
Follow-up reminder engine for Job Hunt Autopilot.
Identifies stalled applications (>= 7 days of no reply) and generates customized outreach drafts.
"""

from datetime import datetime, date
from typing import Dict, Any, Optional

DEFAULT_REFERENCE_DATE = date(2026, 10, 24)


def parse_date_safely(date_val: Any) -> date:
    """Parse a date string YYYY-MM-DD or return fallback."""
    if isinstance(date_val, date):
        return date_val
    if isinstance(date_val, str):
        try:
            return datetime.strptime(date_val[:10], "%Y-%m-%d").date()
        except Exception:
            pass
    return DEFAULT_REFERENCE_DATE


def extract_company_name(email_sender: str, subject: str) -> str:
    """Heuristic extraction of company name from email sender domain or subject."""
    # Check common company patterns in subject
    for keyword in ["at ", "to ", ": "]:
        if keyword in subject:
            parts = subject.split(keyword)
            candidate = parts[-1].split("-")[0].split("(")[0].strip()
            if len(candidate) > 2 and len(candidate) < 25:
                return candidate

    # Fallback to domain
    if "@" in email_sender:
        domain = email_sender.split("@")[-1].lower()
        parts = domain.split(".")
        if len(parts) >= 2:
            return parts[0].capitalize()

    return "the Hiring Team"


def generate_followup_draft(company: str, subject: str, days_silent: int, stage: str) -> str:
    """Generate a high-converting, professional follow-up email draft."""
    if stage == "interview":
        return (
            f"Subject: Following up on our recent interview - {company}\n\n"
            f"Dear {company} Team,\n\n"
            f"I hope you are having a productive week. It was a pleasure discussing the opportunity "
            f"with your engineering team recently.\n\n"
            f"Since it has been {days_silent} days, I am writing to check in on the status of my candidacy "
            f"and see if there are any additional details or code samples I can provide to assist in your decision.\n\n"
            f"I remain very interested in the role and look forward to hearing about the next steps.\n\n"
            f"Best regards,\nRahul Verma"
        )
    else:  # applied
        return (
            f"Subject: Following up on application: {subject.replace('Application received:', '').replace('Application Confirmation:', '').strip()}\n\n"
            f"Dear {company} Recruiting Team,\n\n"
            f"I recently submitted my application for this role {days_silent} days ago and wanted to follow up. "
            f"With my background in scalable backend systems and high-throughput microservices, I am very enthusiastic "
            f"about the opportunity to contribute to {company}'s tech stack.\n\n"
            f"Please let me know if you need any additional portfolio links, references, or details from my end.\n\n"
            f"Thank you for your time and consideration,\nRahul Verma"
        )


def evaluate_followup(item: Dict[str, Any], stage: str, ref_date: Optional[date] = None) -> Dict[str, Any]:
    """Check if an application needs a follow-up after 7 days of no reply."""
    if ref_date is None:
        ref_date = DEFAULT_REFERENCE_DATE

    email_date = parse_date_safely(item.get("date"))
    days_silent = max(0, (ref_date - email_date).days)

    company = extract_company_name(item.get("from", ""), item.get("subject", ""))

    # Follow up only applies to ongoing active pipelines: applied or interview
    is_eligible_stage = stage in ["applied", "interview"]
    needs_followup = is_eligible_stage and (days_silent >= 7)

    draft = None
    if needs_followup:
        draft = generate_followup_draft(company, item.get("subject", ""), days_silent, stage)

    return {
        "needs_followup": needs_followup,
        "days_silent": days_silent,
        "company": company,
        "urgency": "HIGH" if days_silent >= 12 else ("MEDIUM" if days_silent >= 7 else "LOW"),
        "followup_draft": draft
    }
