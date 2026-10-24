"""
Generates sample_inbox.mbox from sample_inbox.json
"""
import json
import mailbox
import os
from email.message import EmailMessage

def convert_json_to_mbox(json_path: str, mbox_path: str):
    with open(json_path, "r", encoding="utf-8") as f:
        items = json.load(f)

    if os.path.exists(mbox_path):
        os.remove(mbox_path)

    mbox = mailbox.mbox(mbox_path)
    mbox.lock()
    try:
        for item in items:
            msg = mailbox.mboxMessage()
            msg.set_from(item.get("from", "recruiter@example.com"))
            msg["From"] = item.get("from", "")
            msg["Subject"] = item.get("subject", "")
            
            # Format RFC 2822 date
            dt_str = item.get("date", "2026-10-24")
            try:
                from email.utils import format_datetime
                from datetime import datetime, timezone, timedelta
                dt = datetime.strptime(dt_str, "%Y-%m-%d").replace(tzinfo=timezone(timedelta(hours=5, minutes=30)))
                msg["Date"] = format_datetime(dt)
            except Exception:
                msg["Date"] = dt_str

            msg.set_payload(item.get("body", ""))
            mbox.add(msg)
        mbox.flush()
    finally:
        mbox.unlock()
    print(f"Successfully created {mbox_path} with {len(items)} emails.")

if __name__ == "__main__":
    convert_json_to_mbox("data/sample_inbox.json", "data/sample_inbox.mbox")
