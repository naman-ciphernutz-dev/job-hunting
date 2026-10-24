# GDG Hackathon Submission: Job Hunt Autopilot

### 1. Project Title & Tagline
- **Project Title:** Job Hunt Autopilot
- **Tagline:** *Track every application. Catch every fake offer.*
- **Track:** Layoff Recovery & Career Automation

---

### 2. Problem Statement
Following sudden tech layoffs, candidates submit over 100 job applications in compressed timeframes. Job seekers quickly face two critical bottlenecks:
1. **Application Tracking Chaos:** Critical interview invites, confirmations, and rejections get buried in the inbox, leading to lost opportunities and forgotten follow-ups.
2. **Predatory Advance Fee & Document Fraud:** Malicious actors exploit the vulnerability of laid-off engineers by issuing fake offers demanding "refundable training fees" (e.g., Rs 4,999) or phishing sensitive KYC documents (Aadhaar, PAN cards) using corporate impersonation on free webmail domains (`hr.infosys.jobs@gmail.com`).

---

### 3. Solution Overview
Job Hunt Autopilot provides a single unified intelligence pipeline that takes a raw candidate email inbox dump (.json or .mbox) and delivers:
1. **Self-Updating Application Tracker:** Accurately labels communications as `applied`, `interview`, `rejected`, `offer`, or `scam`.
2. **Red-Flagged Scam Quarantine:** Fake offers are visually flagged in bold red with exact forensic reasons (advance fee demand, free webmail impersonation, KYC phishing, off-platform redirects).
3. **Audible Scam Warning:** A spoken security alert powered by Google Gemini Speech generation to warn users.
4. **7-Day Follow-Up Queue:** Identifies stalled applications after 7 days of silence and auto-generates personalized, high-converting outreach drafts.

---

### 4. Google Technologies Utilized (Strict Compliance)
- **Google Gemini 4 Argon (`gemini-4-argon`):** Google's newest frontier model with Structured Output JSON schemas for multi-signal classification.
- **Google Antigravity:** Developed inside Google Antigravity with a dedicated Skill (`.agents/skills/job-hunt-autopilot/SKILL.md`).
- **Firebase:** Production-ready `firebase.json` for one-click deployment to Firebase Hosting.
- **Gemini Speech / Voice API:** Spoken alert synthesis for audible scam warnings.

---

### 5. Datasets & Heuristic Grounding
- Kaggle *Real or Fake Job Posting Prediction* dataset (~18,000 postings).
- Hugging Face *Hinglish & English Scam Text Dataset* for regional recruitment fraud patterns.

---

### 6. Verification & Test Coverage
- Ingestion supports both JSON and `.mbox` mailbox formats without external credentials.
- 7 comprehensive automated unit tests covering stage classification, scam detection precision, and follow-up generation.
- Zero-dependency local server and modern glassmorphism web dashboard.
