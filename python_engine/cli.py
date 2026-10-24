"""
Interactive CLI for Job Hunt Autopilot.
Run:
    py python_engine/cli.py --input data/sample_inbox.json
    py python_engine/cli.py --input data/sample_inbox.mbox
    py python_engine/cli.py --export output.json
"""

import argparse
import json
import sys
import os

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Reconfigure stdout for UTF-8 on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from datetime import datetime
from python_engine.ingestion import load_inbox
from python_engine.classifier import process_inbox, DEFAULT_REFERENCE_DATE

# ANSI Terminal Colors
RESET = "\033[0m"
BOLD = "\033[1m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
CYAN = "\033[96m"
WHITE = "\033[97m"
BG_RED = "\033[41m"
BG_YELLOW = "\033[43m"
BG_GREEN = "\033[42m"
BG_BLUE = "\033[44m"


def print_banner():
    banner = f"""{CYAN}{BOLD}
╔══════════════════════════════════════════════════════════════════════════════╗
║                          JOB HUNT AUTOPILOT                                  ║
║            Track every application. Catch every fake offer.                 ║
║                   GDG Hackathon - Layoff Recovery Edition                    ║
╚══════════════════════════════════════════════════════════════════════════════╝{RESET}
"""
    print(banner)


def format_category(cat: str) -> str:
    if cat == "scam":
        return f"{RED}{BOLD}🚨 FAKE OFFER / SCAM{RESET}"
    elif cat == "offer":
        return f"{GREEN}{BOLD}🎉 GENUINE OFFER{RESET}"
    elif cat == "interview":
        return f"{BLUE}{BOLD}📅 INTERVIEW{RESET}"
    elif cat == "rejected":
        return f"{MAGENTA}❌ REJECTED{RESET}"
    else:
        return f"{YELLOW}⏳ APPLIED{RESET}"


def run_cli():
    parser = argparse.ArgumentParser(
        description="Job Hunt Autopilot: Classify inbox, detect scam offers, and trigger 7-day follow-ups."
    )
    parser.add_argument(
        "--input", "-i",
        default="data/sample_inbox.json",
        help="Path to JSON or .mbox inbox file (default: data/sample_inbox.json)"
    )
    parser.add_argument(
        "--export", "-e",
        help="Optional path to export classified tracker results as JSON"
    )
    parser.add_argument(
        "--ref-date", "-d",
        default="2026-10-24",
        help="Reference date for calculating 7-day follow-up silence (YYYY-MM-DD)"
    )
    parser.add_argument(
        "--filter", "-f",
        choices=["all", "scam", "offer", "interview", "rejected", "applied", "followup"],
        default="all",
        help="Filter visible output"
    )

    args = parser.parse_args()

    print_banner()

    if not os.path.exists(args.input):
        print(f"{RED}Error: Input file '{args.input}' not found.{RESET}")
        sys.exit(1)

    print(f"{WHITE}📂 Ingesting inbox from: {BOLD}{args.input}{RESET}")
    emails = load_inbox(args.input)
    print(f"📥 Loaded {BOLD}{len(emails)}{RESET} incoming communications.\n")

    try:
        ref_dt = datetime.strptime(args.ref_date, "%Y-%m-%d").date()
    except Exception:
        ref_dt = DEFAULT_REFERENCE_DATE

    results = process_inbox(emails, ref_dt)
    summary = results["summary"]

    # 1. Pipeline Summary Cards
    print(f"{BOLD}━━━━━━━━━━━━━━━━━━━ PIPELINE DASHBOARD SUMMARY ━━━━━━━━━━━━━━━━━━━{RESET}")
    print(
        f"  Total Processed: {BOLD}{summary['total_emails']}{RESET} | "
        f"Applied: {YELLOW}{summary['stages']['applied']}{RESET} | "
        f"Interview: {BLUE}{summary['stages']['interview']}{RESET} | "
        f"Rejected: {MAGENTA}{summary['stages']['rejected']}{RESET} | "
        f"Offer: {GREEN}{summary['stages']['offer']}{RESET} | "
        f"Scams: {RED}{BOLD}{summary['stages']['scam']}{RESET}"
    )
    print(
        f"  Pending Follow-ups (≥7 days silence): {YELLOW}{BOLD}{summary['followups_pending']}{RESET} | "
        f"Reference Anchor Date: {CYAN}{summary['reference_date']}{RESET}\n"
    )

    # 2. Fake Offers Alert Section (Highlighted in Red as required)
    if results["scam_alerts"] and args.filter in ["all", "scam"]:
        print(f"{BG_RED}{WHITE}{BOLD} ⚠️  HIGH PRIORITY: DETECTED FAKE OFFERS & FRAUDULENT SCHEMES ({len(results['scam_alerts'])}) {RESET}")
        for item in results["scam_alerts"]:
            print(f"\n{RED}┌─────────────────────────────────────────────────────────────────────────────┐{RESET}")
            print(f"{RED}│{RESET} {BOLD}ID #{item['id']} | Date: {item['date']} | From: {item['from']}{RESET}")
            print(f"{RED}│{RESET} Subject: {item['subject']}")
            print(f"{RED}│{RESET} {BOLD}Flagged Reasons:{RESET}")
            for r in item["scam_analysis"]["reasons"]:
                print(f"{RED}│{RESET}   {RED}• {r}{RESET}")
            print(f"{RED}│{RESET} Signals: {', '.join(item['scam_analysis']['signals'])}")
            print(f"{RED}└─────────────────────────────────────────────────────────────────────────────┘{RESET}")
        print()

    # 3. 7-Day Follow-up Reminders Section
    if results["followup_reminders"] and args.filter in ["all", "followup"]:
        print(f"{BG_YELLOW}{WHITE}{BOLD} 🔔 ACTION REQUIRED: 7+ DAYS NO REPLY - FOLLOW-UP QUEUE ({len(results['followup_reminders'])}) {RESET}")
        for item in results["followup_reminders"]:
            fo = item["followup"]
            print(f"\n  • {BOLD}ID #{item['id']} - {fo['company']}{RESET} (Applied: {item['date']} → {YELLOW}{BOLD}{fo['days_silent']} days silent{RESET})")
            print(f"    Subject: {item['subject']}")
            print(f"    {CYAN}⚡ Auto-Generated Outreach Draft:{RESET}")
            for line in fo["followup_draft"].split("\n")[:4]:
                print(f"      {line}")
            print(f"      {WHITE}... [Full draft available in export/dashboard]{RESET}")
        print()

    # 4. Aggregated Application Records Table (Gap A: Grouping emails into persistent applications)
    app_tracker = results.get("application_tracker", {})
    apps = app_tracker.get("applications", [])
    if apps and args.filter in ["all", "applied", "interview", "rejected", "offer"]:
        print(f"{BOLD}━━━━━━━━━━━━━━━━━━━ UNIFIED APPLICATION RECORDS (GROUPED) ━━━━━━━━━━━━━━━━━━━{RESET}")
        print(f"{'App ID':<8} | {'Company':<16} | {'Current Stage':<25} | {'Role':<26} | {'Timeline Events'}")
        print("─" * 105)
        for app in apps:
            if args.filter != "all" and app["current_stage"] != args.filter:
                continue
            stage_disp = format_category(app["current_stage"])
            events_summary = f"{len(app['emails'])} emails (" + " → ".join([e['category'][:3].upper() for e in app['emails']]) + f", last {app['last_event_date']})"
            if app["needs_followup"]:
                events_summary += f" {YELLOW}{BOLD}⚠️ {app['days_silent']}d silent{RESET}"
            print(f"{app['app_id']:<8} | {app['company']:<16} | {stage_disp:<34} | {app['role'][:25]:<26} | {events_summary}")
        print()

    # 5. Raw Email Stream Tracker Table
    if args.filter in ["all", "applied", "interview", "rejected", "offer"]:
        print(f"{BOLD}━━━━━━━━━━━━━━━━━━━━━━━━ RAW EMAIL INGESTION STREAM ━━━━━━━━━━━━━━━━━━━━━━━━{RESET}")
        print(f"{'ID':<4} | {'Date':<10} | {'Status':<25} | {'Company / Sender':<28} | {'Subject'}")
        print("─" * 105)
        for item in results["items"]:
            if args.filter != "all" and item["category"] != args.filter:
                continue
            cat_display = format_category(item["category"])
            sender_disp = (item["from"][:26] + "..") if len(item["from"]) > 28 else item["from"]
            subj_disp = (item["subject"][:35] + "..") if len(item["subject"]) > 37 else item["subject"]
            print(f"{item['id']:<4} | {item['date']:<10} | {cat_display:<34} | {sender_disp:<28} | {subj_disp}")
        print()

    # Export if requested
    if args.export:
        with open(args.export, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
        print(f"{GREEN}✓ Tracker successfully exported to: {args.export}{RESET}")


if __name__ == "__main__":
    run_cli()
