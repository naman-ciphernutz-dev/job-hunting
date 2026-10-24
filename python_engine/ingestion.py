"""
Ingestion module for Job Hunt Autopilot.
Parses inboxes from JSON files, raw JSON strings, or .mbox mailbox archives.
"""

import json
import mailbox
import os
from typing import List, Dict, Any
from datetime import datetime


def parse_json_inbox(filepath_or_data) -> List[Dict[str, Any]]:
    """Load email messages from a JSON file path or string."""
    if isinstance(filepath_or_data, str):
        if os.path.exists(filepath_or_data):
            with open(filepath_or_data, "r", encoding="utf-8") as f:
                data = json.load(f)
        else:
            data = json.loads(filepath_or_data)
    elif isinstance(filepath_or_data, list):
        data = filepath_or_data
    else:
        raise ValueError("Unsupported input format for JSON inbox.")

    normalized = []
    for idx, item in enumerate(data, start=1):
        normalized.append({
            "id": item.get("id", idx),
            "date": item.get("date", datetime.now().strftime("%Y-%m-%d")),
            "from": item.get("from", ""),
            "subject": item.get("subject", ""),
            "body": item.get("body", "")
        })
    return normalized


def parse_mbox_inbox(filepath: str) -> List[Dict[str, Any]]:
    """Load email messages from a standard .mbox file."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Mbox file not found: {filepath}")

    mbox = mailbox.mbox(filepath)
    normalized = []
    try:
        for idx, msg in enumerate(mbox, start=1):
            sender = msg.get("From", "")
            subject = msg.get("Subject", "")
            raw_date = msg.get("Date", "")

            # Extract plain body
            body = ""
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    if content_type == "text/plain":
                        payload = part.get_payload(decode=True)
                        if payload:
                            body = payload.decode(errors="replace")
                            break
            else:
                payload = msg.get_payload(decode=True)
                if payload:
                    body = payload.decode(errors="replace")
                else:
                    body = str(msg.get_payload())

            # Normalize date
            try:
                from email.utils import parsedate_to_datetime
                dt = parsedate_to_datetime(raw_date)
                date_str = dt.strftime("%Y-%m-%d")
            except Exception:
                date_str = datetime.now().strftime("%Y-%m-%d")

            normalized.append({
                "id": idx,
                "date": date_str,
                "from": sender,
                "subject": subject,
                "body": body.strip()
            })
    finally:
        mbox.close()

    return normalized


def load_inbox(source_path: str) -> List[Dict[str, Any]]:
    """Auto-detect format (JSON or MBOX) and load emails."""
    if source_path.endswith(".mbox"):
        return parse_mbox_inbox(source_path)
    return parse_json_inbox(source_path)
