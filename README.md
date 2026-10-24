# Job Hunt Autopilot 🚀
> **Track every application. Catch every fake offer.**
> *A post-layoff survival and application intelligence workflow built with Google technologies.*

[![GDG Hackathon 2026](https://img.shields.io/badge/GDG%20Hackathon-2026-4285F4?style=for-the-badge&logo=google)](https://developers.google.com/)
[![Built with Google](https://img.shields.io/badge/Built%20with-Gemini%204%20Argon%20%7C%20Antigravity%20%7C%20Firebase-34A853?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![Tests Passing](https://img.shields.io/badge/Tests-7%20Passed%20(100%25)-brightgreen?style=for-the-badge)](tests/test_classifier.py)

---

## 📌 The Problem: The Layoff Crisis
When a sudden tech layoff strikes, engineers and tech workers often submit **100+ applications** across multiple job boards within days.

In the ensuing chaos:
1. **Inbox Paralysis**: Updates, interview invitations, and polite rejections get buried under hundreds of automated notification emails.
2. **Ghosted Follow-ups**: Without reminders, promising applications stall because candidates forget to follow up after 7 days of silence.
3. **Predatory Fake Offers**: Desperate job seekers become prime targets for sophisticated advance fee fraud—fake HR representatives impersonating reputable enterprises (Infosys, TCS, Wipro, Amazon) demanding **"refundable training fees" (e.g. Rs 4,999)**, **"laptop courier charges"**, or harvesting **Aadhaar/PAN card scans** before any technical evaluation.

---

## 💡 The Solution: Job Hunt Autopilot
**Job Hunt Autopilot** ingests raw inbox dumps (via `.json` or `.mbox` files—**zero Gmail login needed**) and runs a single unified intelligence pipeline:

- **Self-Updating Application Tracker**: Automatically categorizes every communication into one of five definitive stages:
  - `applied` (Application received / under review)
  - `interview` (Technical screening, coding pair, system design round)
  - `rejected` (Polite closure, role on hold)
  - `offer` (Verified formal offer from authentic corporate domain)
  - `scam` (Quarantined with deep forensic evidence)
- **Forensic Fake Offer Detection**: Flagged prominently in **high-contrast RED** with explicit forensic breakdowns (impersonation from free webmail, advance fee demands, identity phishing, bypass shortcuts, Hinglish fraud patterns).
- **Spoken Scam Warning**: Powered by **Google Gemini Speech generation**, articulating audible security alerts to protect candidates on mobile.
- **7-Day Stagnancy Detector**: Identifies applications silent for $\ge 7$ days and auto-generates professional, high-converting outreach email drafts customized to the company and role.

---

## 🏗️ Architecture & Pipeline

```
                    ┌──────────────────────────────────────────────┐
                    │      Raw Inbox (.json / standard .mbox)      │
                    │   (Sample: 20 Laid-off Engineer Emails)      │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │          Single Ingestion Pipeline           │
                    │          (python_engine/ingestion.py)        │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         Gemini 4 Argon / Forensic Engine     │
                    │  • Free Webmail Impersonation Check          │
                    │  • Advance Fee Fraud Pattern Matcher         │
                    │  • KYC ID Phishing (Aadhaar / PAN)           │
                    │  • 7-Day Silence Follow-up Evaluator         │
                    └──────────────────────┬───────────────────────┘
                                           │
        ┌──────────────────────────────────┼──────────────────────────────────┐
        ▼                                  ▼                                  ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│   🚨 SCAM ALERT  │             │ 🔔 FOLLOW-UP QUEUE│            │ 📊 LIVE DASHBOARD│
│ • Flagged in RED │             │ • >= 7 Days Old  │             │ • Status Cards   │
│ • Forensic Proof │             │ • 1-Click Copy   │             │ • Glassmorphism  │
│ • Voice Warning  │             │   Outreach Draft │             │ • Filter Pills   │
└──────────────────┘             └──────────────────┘             └──────────────────┘
```

---

## 🌟 Google Technologies Used

This project strictly adheres to the **Build with Google** requirement:

| Technology | Role in Job Hunt Autopilot | Reference |
| :--- | :--- | :--- |
| **Google Gemini 4 Argon** | Frontier model (`gemini-4-argon`) utilized with **Gemini Structured Output** (`response_schema`) for classification and forensic extraction. | [`python_engine/gemini_classifier.py`](file:///D:/Projects/job-hunt-autopilot/python_engine/gemini_classifier.py) |
| **Google Antigravity** | Agent-first IDE architecture. Project features an official Antigravity Skill allowing any agent to plan, execute, and test the tracker. | [`.agents/skills/job-hunt-autopilot/SKILL.md`](file:///D:/Projects/job-hunt-autopilot/.agents/skills/job-hunt-autopilot/SKILL.md) |
| **Firebase Hosting** | Static asset hosting, zero-backend deployment with custom security headers and single-page application routing. | [`firebase.json`](file:///D:/Projects/job-hunt-autopilot/firebase.json) & [`.firebaserc`](file:///D:/Projects/job-hunt-autopilot/.firebaserc) |
| **Gemini Speech / Voice** | Generates spoken audio warnings for fake offers in natural English / Indian English to alert vulnerable users. | [`app.js`](file:///D:/Projects/job-hunt-autopilot/app.js#L551-L568) |

---

## 📊 Datasets & Scam Pattern Grounding

Our heuristic rules and Gemini prompt grounding are derived directly from the hackathon benchmark resources:
1. **[Kaggle: Real or Fake Job Posting Prediction](https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction)**: ~18,000 postings analyzing telecommuting red flags, free webmail domains for enterprise claims, and money transfer signals.
2. **[Hugging Face: Hinglish & English Scam Text Dataset](https://huggingface.co/datasets/bolewara/hinglish-scam-text-dataset)**: Identifying regional fraud lingo: *"selection ho gaya hai"*, *"charges UPI karein"*, *"pehli salary me refund"*, and *"turant joining"*.

---

## 🚀 Quickstart Guide

### Option 1: Run Interactive Terminal CLI
```bash
# Ingest 20-email JSON inbox
py python_engine/cli.py --input data/sample_inbox.json

# Ingest standard RFC 822 / .mbox file
py python_engine/cli.py --input data/sample_inbox.mbox

# Export classified results to JSON
py python_engine/cli.py --export tracker_export.json
```

### Option 2: Run Full Web Dashboard Locally
```bash
# Start zero-dependency local web server
py python_engine/server.py 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser!

Or using npm:
```bash
npm start
```

### Option 3: Run Automated Unit Tests
```bash
py -m unittest discover -s tests -p "test_*.py"
```

---

## 📸 Demo Walkthrough

1. **Dashboard Metrics**: Instantly shows 20 total communications: 6 Applied, 4 Interview, 4 Rejected, 2 Verified Offers, 4 Fake Offers Blocked, and 5 Follow-ups Due.
2. **Red Alert Banner**: Fake offers from `hr.infosys.jobs@gmail.com` (demanding Rs 4,999) and `wipro.careers.desk@yahoo.com` (laptop courier charges) are highlighted in crimson with exact forensic reasons.
3. **Audible Scam Warning**: Click **"🔊 Gemini Spoken Scam Warning"** to hear an alert preventing candidate exploitation.
4. **Follow-Up Automation**: Click **"📋 Copy Outreach Draft"** on stagnant applications (e.g. Swiggy 16 days silent, Zentech 14 days silent) to get an immediate, personalized follow-up draft.

---

## 📁 Repository Structure
```
D:\Projects\job-hunt-autopilot/
├── .agents/
│   └── skills/
│       └── job-hunt-autopilot/
│           └── SKILL.md            # Google Antigravity Skill definition
├── .firebaserc                     # Firebase project configuration
├── firebase.json                   # Firebase Hosting configuration
├── index.html                      # Modern accessible dashboard UI
├── styles.css                      # Glassmorphism dark theme & micro-animations
├── app.js                          # Client-side classifier & voice engine
├── package.json                    # NPM scripts & developer tools
├── requirements.txt                # Optional Python packages
├── README.md                       # Complete documentation
├── SUBMISSION.md                   # GDG Hackathon submission template
├── data/
│   ├── sample_inbox.json           # 20 realistic layoff job hunt emails
│   └── sample_inbox.mbox           # Valid RFC 822 / mbox mailbox file
├── python_engine/
│   ├── __init__.py
│   ├── classifier.py               # Core 5-stage classifier & forensic rules
│   ├── gemini_classifier.py        # Gemini 4 Argon structured output classifier
│   ├── ingestion.py                # JSON and .mbox parser
│   ├── followup.py                 # 7-day stagnancy & draft generator
│   ├── cli.py                      # Interactive ANSI terminal CLI
│   └── server.py                   # Zero-dependency HTTP & REST server
└── tests/
    └── test_classifier.py          # Unit tests (100% passing)
```

---

## 🏆 Hackathon Scope Compliance (2.5 Hours)
- [x] **One Unified Pipeline**: Every email classified once into applied, interview, rejected, offer, or scam.
- [x] **No Gmail Auth Required**: Ingests directly from sample `.json` or `.mbox`.
- [x] **Layoff Angle Preserved**: Focused squarely on application tracking, follow-ups, and fake offer protection. No out-of-scope resume rewriting or PF tools.
- [x] **Built Exclusively with Google Tech**: Gemini 4 Argon, Antigravity, Firebase, and Gemini Speech.
