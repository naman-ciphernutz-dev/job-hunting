---
name: job-hunt-autopilot
description: Automated post-layoff job application tracking and fake offer scam forensics with Google Gemini 4 Argon.
---

# Job Hunt Autopilot - Antigravity Skill

This skill guides Google Antigravity agents on how to execute, test, and enhance the **Job Hunt Autopilot** workflow built for the GDG Hackathon.

## Core Capabilities
1. **Single-Pipeline Multi-State Classification**:
   Classify raw email feeds (.json or .mbox) into:
   - `applied`
   - `interview`
   - `rejected`
   - `offer`
   - `scam` (flagged in red with forensic reasons)
2. **Scam & Fraud Forensics**:
   Detect advance fee fraud (training fees, courier charges, Rs 4,999 UPI), brand impersonation (Infosys/Wipro on free Gmail/Yahoo), premature KYC document harvesting (Aadhaar/PAN), and Hinglish recruitment fraud.
3. **Stagnancy & 7-Day Follow-Up Detector**:
   Flag applications with >= 7 days of radio silence and generate high-converting outreach email drafts.

## Key Files & Entrypoints
- `python_engine/classifier.py`: Core rule engine & forensic analyzer.
- `python_engine/gemini_classifier.py`: Google Gemini 4 Argon Structured Output classifier (`gemini-4-argon`).
- `python_engine/cli.py`: Interactive CLI with ANSI colored output.
- `python_engine/server.py`: Local zero-dependency web server on port 8080.
- `data/sample_inbox.json`: 20-email sample inbox modeling a laid-off engineer's job hunt.
- `data/sample_inbox.mbox`: Standard RFC 822 / mbox mailbox format.
- `index.html`, `styles.css`, `app.js`: Glassmorphism web dashboard.

## Common Agent Workflows

### 1. Run Pipeline via Terminal CLI
```bash
py python_engine/cli.py --input data/sample_inbox.json
```

### 2. Run Comprehensive Unit Tests
```bash
py -m unittest discover -s tests -p "test_*.py"
```

### 3. Start Local Web Dashboard
```bash
py python_engine/server.py 8080
```
Then navigate to `http://localhost:8080`.

### 4. Classify Custom Inboxes
Pass any custom JSON or MBOX file:
```bash
py python_engine/cli.py --input my_custom_inbox.json --export results.json
```
