"""
Job Hunt Autopilot
Track every application. Catch every fake offer.
"""

from .classifier import classify_email, process_inbox
from .ingestion import load_inbox
from .followup import evaluate_followup

__all__ = ["classify_email", "process_inbox", "load_inbox", "evaluate_followup"]
