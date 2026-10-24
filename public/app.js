/**
 * Job Hunt Autopilot - Interactive Web Application Logic
 * GDG Hackathon: Layoff Recovery & Fake Offer Forensic Tracker
 * Supports:
 * - Gap A: Grouping emails into persistent Application Records with complete timelines.
 * - Gap B: Explainable risk evidence for scam quarantine without false legal claims.
 * - Gap C: Deterministic follow-up rules computed from employer silence since last contact.
 * - Gap D: Self-updating batch import pipeline.
 */

// Embedded default 20-email layoff recovery dataset with multi-stage timelines
const EMBEDDED_SAMPLE_DATA = [
  {
    "id": 1,
    "date": "2026-10-10",
    "from": "careers@zentech.in",
    "subject": "Application received: Backend Engineer",
    "body": "Hi Rahul, thank you for applying for the Backend Engineer position at Zentech. We have received your application and resume. Our engineering team is currently reviewing submissions and we will get back to you if your profile matches our requirements."
  },
  {
    "id": 2,
    "date": "2026-10-14",
    "from": "hr.infosys.jobs@gmail.com",
    "subject": "Offer letter - pay Rs 4,999 training fee",
    "body": "Dear Candidate, Congratulations! You are selected for Senior Software Engineer role at Infosys Bangalore. Your package is 18 LPA. To confirm your joining, kindly transfer Rs 4,999 as mandatory refundable training fee via UPI to infosys-hr@upi. Also send scans of your Aadhaar and PAN card to this email to receive your appointment letter."
  },
  {
    "id": 3,
    "date": "2026-10-18",
    "from": "talent@finly.co",
    "subject": "Interview invite: Round 1 on 27 Oct",
    "body": "Hi Rahul, thank you for your patience. The engineering team was impressed with your experience in distributed systems. We would love to invite you for Round 1 technical interview. Please pick a convenient 45-minute slot using our Calendly link: https://calendly.com/finly-talent/round-1"
  },
  {
    "id": 4,
    "date": "2026-10-11",
    "from": "no-reply@stripe.com",
    "subject": "Update regarding your application for Backend Engineer at Stripe",
    "body": "Hi Rahul, Thank you for taking the time to speak with our team about the Backend Engineer role. While we were impressed with your background, we have decided to move forward with another candidate whose experience more closely aligns with our immediate infrastructure roadmap. We wish you success in your job search."
  },
  {
    "id": 5,
    "date": "2026-10-11",
    "from": "jobs@groww.in",
    "subject": "Application Confirmation: Senior Backend Engineer",
    "body": "Hello Rahul, Thanks for applying to Groww! We have successfully received your application for Senior Backend Engineer (Transactions Team). We will review your profile and update you on the next steps within a week."
  },
  {
    "id": 6,
    "date": "2026-10-12",
    "from": "wipro.careers.desk@yahoo.com",
    "subject": "Wipro Direct Selection - Dispatch charges for work laptop",
    "body": "Dear Applicant, You have been shortlisted for Wipro Work-From-Home Developer program. Salary Rs 95,000 per month. A brand new MacBook Pro is allocated to you. You must deposit Rs 3,500 courier and insurance charges to courier account before delivery. Amount is 100% refundable upon first paycheck. WhatsApp HR at +91-9876543210."
  },
  {
    "id": 7,
    "date": "2026-10-15",
    "from": "talent@zerodha.com",
    "subject": "Zerodha Tech - Application Acknowledged",
    "body": "Hi Rahul, We have received your application for the Core Systems team at Zerodha. Our engineers review all code repositories and applications directly. We will reach out if there is a mutual fit."
  },
  {
    "id": 8,
    "date": "2026-10-14",
    "from": "recruiting@razorpay.com",
    "subject": "Application received: Senior Backend Engineer at Razorpay",
    "body": "Hi Rahul, We received your application for Senior Backend Engineer at Razorpay. Our recruitment team has begun reviewing your credentials and will reach out with technical assessment details."
  },
  {
    "id": 9,
    "date": "2026-10-21",
    "from": "recruiting@razorpay.com",
    "subject": "Razorpay Tech Round 2: System Architecture Discussion",
    "body": "Hi Rahul, Great job on the live coding round! We are excited to advance you to Round 2 with our Principal Architect. The session will focus on distributed caching and concurrency. Please confirm if 26th October at 3:00 PM IST works for you."
  },
  {
    "id": 10,
    "date": "2026-10-09",
    "from": "careers@atlassian.com",
    "subject": "Thanks for applying to Atlassian (Senior Fullstack / Backend Engineer)",
    "body": "Hi Rahul, Thank you for your application to Atlassian. Our engineering talent team is reviewing your profile."
  },
  {
    "id": 11,
    "date": "2026-10-17",
    "from": "careers@atlassian.com",
    "subject": "Update on your application to Atlassian",
    "body": "Dear Rahul, Thank you for taking the time to interview with Atlassian for the Senior Fullstack / Backend Engineer vacancy. After careful evaluation, we have chosen not to proceed with your candidacy at this time. We will keep your profile in our talent pool for future opportunities."
  },
  {
    "id": 12,
    "date": "2026-10-16",
    "from": "amazon.global.work@gmail.com",
    "subject": "Urgent Part-time / Remote Software Job - Rs 5000 Daily",
    "body": "Greetings! Selected directly for Amazon Global Partner Remote Operations. Earn Rs 3,000 to Rs 8,000 daily from home. No interview needed. Join our Telegram channel @AmazonRecruitIndia and pay Rs 1,499 one-time registration and verification fee. Limited slots available."
  },
  {
    "id": 13,
    "date": "2026-10-22",
    "from": "hiring@zepto.in",
    "subject": "Thanks for applying to Zepto (Quick Commerce Backend)",
    "body": "Hi Rahul, Thanks for applying for Senior Backend Engineer at Zepto. Our recruitment team has received your details and GitHub profile. We will reach out shortly regarding next steps."
  },
  {
    "id": 14,
    "date": "2026-10-12",
    "from": "hr@hasura.io",
    "subject": "Hasura: Technical screening completed",
    "body": "Hi Rahul, Thanks for completing the system architecture interview with our Engine team. The feedback was very positive. We are preparing offer documents."
  },
  {
    "id": 15,
    "date": "2026-10-22",
    "from": "hr@hasura.io",
    "subject": "Official Offer Letter: Senior Software Engineer at Hasura",
    "body": "Dear Rahul, On behalf of Hasura Inc., we are thrilled to formally offer you the position of Senior Software Engineer on our Engine Team. Attached is your comprehensive offer letter outlining your compensation (INR 28,00,000 base + stock options), health benefits, and proposed joining date of 16th November 2026. Please sign and return the letter within 5 business days."
  },
  {
    "id": 16,
    "date": "2026-10-20",
    "from": "talent@flipkart.com",
    "subject": "Status update on your application at Flipkart",
    "body": "Hello Rahul, Thank you for your interest in joining Flipkart. Due to internal restructuring and headcount allocation adjustments, this specific role has been placed on hold. We will retain your resume for future openings."
  },
  {
    "id": 17,
    "date": "2026-10-23",
    "from": "talent@postman.com",
    "subject": "Invitation to Interview: Postman Platform Team",
    "body": "Hi Rahul, We reviewed your background and would love to schedule a 30-minute technical screening call with our Engineering Manager. Please click the link below to select a time that suits your schedule: https://postman.hire.com/interview/rahul-verma"
  },
  {
    "id": 18,
    "date": "2026-10-19",
    "from": "tcs.immediate.selection@outlook.com",
    "subject": "Urgent: Direct Selection in Tata Consultancy Services (TCS)",
    "body": "Dear candidate, Aapka direct selection ho gaya hai TCS Bangalore me software engineer post ke liye. Package 8.5 LPA. Technical interview round waived off. Joining process confirm karne ke liye Rs 2,999 verification charges UPI karein. Send Aadhaar card, PAN card and photo on WhatsApp +91-9123456789. Yeh fee pehli salary me 100% refund hogi."
  },
  {
    "id": 19,
    "date": "2026-10-08",
    "from": "careers@swiggy.in",
    "subject": "Application Acknowledgment - SDE 2 (Delivery Platform)",
    "body": "Hi Rahul, Thank you for applying to Swiggy. We have received your application for SDE 2 - Delivery Platform. We appreciate your interest and our team is evaluating all profiles against our open requirements."
  },
  {
    "id": 20,
    "date": "2026-10-24",
    "from": "people@cred.club",
    "subject": "Formal Offer of Employment: Backend Platform Engineer at CRED",
    "body": "Hi Rahul, We were thoroughly impressed with your problem solving and architecture discussions across all interview rounds. We are delighted to extend a formal offer of employment for the Backend Platform Engineer position at CRED. Please review the attached offer package detailing base pay, CRED ESOPs, and benefits."
  }
];

// App State
const state = {
  viewMode: 'apps', // 'apps' (Application Records) or 'emails' (Raw Email Stream)
  activeFilter: 'all',
  searchQuery: '',
  items: [],
  applications: [],
  scams: [],
  summary: {
    totalEmails: 0,
    totalApps: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
    scam: 0,
    followup: 0
  },
  referenceDate: new Date('2026-10-24T00:00:00')
};

// ==========================================
// Client-side Classification Rules & Engine
// ==========================================
const KNOWN_BRANDS = ["infosys", "tcs", "wipro", "amazon", "google", "microsoft", "cognizant", "accenture"];
const FREE_MAIL = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com"];

function clientClassifyEmail(item) {
  const text = `${item.subject} ${item.body}`.toLowerCase();
  const sender = (item.from || '').toLowerCase();
  const senderDomain = sender.split('@')[1] || '';
  const isFreeMail = FREE_MAIL.some(m => senderDomain.includes(m));

  const reasons = [];
  const signals = [];
  let score = 0;

  // 1. Brand Impersonation
  const brandMatched = KNOWN_BRANDS.find(b => text.includes(b) || sender.includes(b));
  if (isFreeMail && brandMatched) {
    score += 45;
    signals.push("IMPERSONATION_FREE_WEBMAIL");
    reasons.push(`Corporate Impersonation Warning: Claims affiliation with ${brandMatched.toUpperCase()}, but sends from free webmail provider (@${senderDomain}).`);
  } else if (isFreeMail && (text.includes("offer") || text.includes("selection"))) {
    score += 30;
    signals.push("SUSPICIOUS_FREE_MAIL_OFFER");
    reasons.push(`Suspicious Sender: Offer sent from free webmail (@${senderDomain}) instead of verified corporate domain.`);
  }

  // 2. Advance Fee Fraud
  const feeRegex = /(?:training|registration|processing|security|courier|dispatch|verification|laptop)\s*(?:fee|fees|charge|charges|deposit)|refundable\s*(?:fee|deposit)|(?:pay|transfer|deposit|upi)\s*(?:rs\.?|inr)\s*[\d,]+|(?:rs\.?|inr)\s*[\d,]+.*(?:fee|deposit|refundable)/i;
  const feeMatch = text.match(feeRegex);
  if (feeMatch) {
    score += 55;
    signals.push("ADVANCE_FEE_DEMAND");
    reasons.push(`Advance Fee Fraud Sign: Demands upfront monetary payment/deposit ('${feeMatch[0]}'). Legitimate employers NEVER charge applicants.`);
  }

  // 3. Sensitive ID Phishing
  const kycRegex = /\b(?:aadhaar|aadhar|pan\s*card|voter\s*id|passport\s*copy|bank\s*details|cancelled\s*cheque)\b/i;
  if (kycRegex.test(text)) {
    score += 35;
    signals.push("KYC_IDENTITY_PHISHING");
    reasons.push(`Sensitive Document Phishing Sign: Demands confidential government identity scans (Aadhaar/PAN) prematurely.`);
  }

  // 4. Bypass / No Interview Shortcut
  const shortcutRegex = /\b(?:direct\s*selection|direct\s*joining|no\s*interview\s*needed|round\s*waived|waived\s*off)\b/i;
  const shortcutMatch = text.match(shortcutRegex);
  if (shortcutMatch) {
    score += 35;
    signals.push("UNREALISTIC_OFFER_SHORTCUT");
    reasons.push(`Unrealistic Selection Shortcut: Claims direct appointment or waived interviews ('${shortcutMatch[0]}').`);
  }

  // 5. Off-platform redirect
  const offplatformRegex = /(?:telegram\s*(?:channel|link|@)|whatsapp\s*(?:hr|number|\+91))/i;
  if (offplatformRegex.test(text)) {
    score += 25;
    signals.push("OFF_PLATFORM_REDIRECT");
    reasons.push(`Off-platform Redirection: Directs applicant to untraceable channels (Telegram/WhatsApp).`);
  }

  // 6. Hinglish Fraud Lingo
  const hinglishRegex = /(?:selection\s*ho\s*gaya\s*hai|charges\s*upi\s*karein|pehli\s*salary\s*me\s*refund|turant\s*joining)/i;
  if (hinglishRegex.test(text)) {
    score += 30;
    signals.push("HINGLISH_SCAM_LINGO");
    reasons.push(`High-risk Regional Phrasing: Matches known regional recruitment fraud patterns.`);
  }

  const isScam = score >= 50;
  let category = "applied";

  if (isScam) {
    category = "scam";
  } else {
    if (/(?:formal\s*offer\s*of\s*employment|official\s*offer\s*letter|thrilled\s*to\s*formally\s*offer)/i.test(text)) {
      category = "offer";
    } else if (/(?:regret\s*to\s*inform|not\s*moving\s*forward|decided\s*to\s*move\s*forward\s*with\s*another|chosen\s*not\s*to\s*proceed|role\s*has\s*been\s*placed\s*on\s*hold)/i.test(text)) {
      category = "rejected";
    } else if (/(?:interview\s*invite|invitation\s*to|round\s*[1-5]|technical\s*round|calendly\.com|live\s*coding|code\s*pair)/i.test(text)) {
      category = "interview";
    } else {
      category = "applied";
    }
  }

  // Extract clean company name
  let company = "Company";
  if (!isFreeMail && senderDomain.includes('.')) {
    const token = senderDomain.split('.')[0];
    company = token === 'cred' ? 'CRED' : (token.charAt(0).toUpperCase() + token.slice(1));
  } else {
    for (const kw of ["at ", "to ", "in "]) {
      if (item.subject.toLowerCase().includes(kw)) {
        const idx = item.subject.toLowerCase().indexOf(kw) + kw.length;
        company = item.subject.substring(idx).split('-')[0].split('(')[0].split(':')[0].trim();
        break;
      }
    }
  }

  // Role extraction
  let role = "Software Engineer";
  const roleMatch = item.subject.match(/(Senior\s+Backend\s+Engineer|Backend\s+Engineer|Senior\s+Software\s+Engineer|SDE\s*2|Backend\s+Platform\s+Engineer)/i);
  if (roleMatch) role = roleMatch[0].trim();

  // Followup status per email
  const emailDate = new Date(item.date + 'T00:00:00');
  const daysSilent = Math.max(0, Math.floor((state.referenceDate - emailDate) / (1000 * 60 * 60 * 24)));
  const isEligible = (category === "applied" || category === "interview");
  const needsFollowup = isEligible && (daysSilent >= 7);

  return {
    ...item,
    company,
    role,
    category,
    scam_analysis: {
      is_scam: isScam,
      score,
      reasons,
      signals
    },
    followup: {
      needs_followup: needsFollowup,
      days_silent: daysSilent,
      company,
      followup_draft: needsFollowup ? generateOutreachDraft(company, item.subject, daysSilent, category) : null
    }
  };
}

function generateOutreachDraft(company, subject, daysSilent, stage) {
  if (stage === "interview") {
    return `Subject: Following up on our recent interview - ${company}\n\nDear ${company} Team,\n\nI hope you are having a productive week. It was a pleasure discussing the opportunity with your engineering team recently.\n\nSince it has been ${daysSilent} days, I am writing to check in on the status of my candidacy and see if there are any additional details or code samples I can provide to assist in your decision.\n\nI remain very enthusiastic about the role and look forward to hearing about next steps.\n\nBest regards,\nRahul Verma`;
  }
  return `Subject: Following up on application: ${subject.replace(/Application received:|Application Confirmation:/i, '').trim()}\n\nDear ${company} Recruiting Team,\n\nI recently submitted my application for this position ${daysSilent} days ago and wanted to follow up. With my background in scalable backend systems and high-throughput microservices, I am eager to contribute to ${company}'s infrastructure.\n\nPlease let me know if you need any additional portfolio links, references, or details from my end.\n\nThank you for your time and consideration,\nRahul Verma`;
}

// Group emails into unified Application Records (Gap A & Gap C)
function groupEmailsIntoApplications(emails) {
  const buckets = {};
  const scams = [];

  emails.forEach(email => {
    if (email.category === 'scam') {
      scams.push(email);
      return;
    }

    const key = email.company.toLowerCase();
    if (!buckets[key]) {
      buckets[key] = {
        app_id: `APP-${String(Object.keys(buckets).length + 1).padStart(3, '0')}`,
        company: email.company,
        role: email.role,
        current_stage: email.category,
        emails: [],
        created_date: email.date,
        last_event_date: email.date,
        days_silent: 0,
        needs_followup: false,
        followup_draft: null
      };
    }

    const app = buckets[key];
    if (email.role !== "Software Engineer" && app.role === "Software Engineer") {
      app.role = email.role;
    }
    app.emails.push(email);
  });

  const appsList = Object.values(buckets).map(app => {
    // Sort emails chronologically
    app.emails.sort((a, b) => new Date(a.date) - new Date(b.date));
    app.created_date = app.emails[0].date;
    app.last_event_date = app.emails[app.emails.length - 1].date;

    // Current stage from latest chronological email
    const latestEmail = app.emails[app.emails.length - 1];
    app.current_stage = latestEmail.category;

    // Deterministic 7-day silence from the LAST employer email
    const lastDate = new Date(app.last_event_date + 'T00:00:00');
    const daysSilent = Math.max(0, Math.floor((state.referenceDate - lastDate) / (1000 * 60 * 60 * 24)));
    app.days_silent = daysSilent;

    const isActive = (app.current_stage === 'applied' || app.current_stage === 'interview');
    app.needs_followup = isActive && (daysSilent >= 7);

    if (app.needs_followup) {
      app.followup_draft = generateOutreachDraft(app.company, latestEmail.subject, daysSilent, app.current_stage);
    }

    return app;
  });

  // Sort by last activity descending
  appsList.sort((a, b) => new Date(b.last_event_date) - new Date(a.last_event_date));

  return { applications: appsList, scams };
}

// Process email feed
function processEmailList(rawList) {
  const processedEmails = rawList.map(clientClassifyEmail);
  state.items = processedEmails;

  const grouped = groupEmailsIntoApplications(processedEmails);
  state.applications = grouped.applications;
  state.scams = grouped.scams;

  // Counts based on grouped applications + quarantined scams
  const counts = {
    totalEmails: processedEmails.length,
    totalApps: grouped.applications.length,
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
    scam: grouped.scams.length,
    followup: 0
  };

  grouped.applications.forEach(app => {
    counts[app.current_stage] = (counts[app.current_stage] || 0) + 1;
    if (app.needs_followup) {
      counts.followup += 1;
    }
  });

  state.summary = counts;
  renderAll();
}

// ==========================================
// Rendering Logic
// ==========================================

function renderAll() {
  renderMetrics();
  renderScamAlerts();
  renderFollowups();
  renderTable();
}

function renderMetrics() {
  document.getElementById('val-total').innerText = state.summary.totalApps;
  document.getElementById('val-applied').innerText = state.summary.applied;
  document.getElementById('val-interview').innerText = state.summary.interview;
  document.getElementById('val-offer').innerText = state.summary.offer;
  document.getElementById('val-scam').innerText = state.summary.scam;
  document.getElementById('val-followup').innerText = state.summary.followup;

  // Update switcher counts
  document.getElementById('cnt-apps-total').innerText = state.summary.totalApps;
  document.getElementById('cnt-emails-total').innerText = state.summary.totalEmails;

  // Filter button counts (relative to active viewMode)
  const isApps = (state.viewMode === 'apps');
  document.getElementById('cnt-all').innerText = isApps ? state.summary.totalApps : state.summary.totalEmails;
  document.getElementById('cnt-scam').innerText = state.summary.scam;
  document.getElementById('cnt-followup').innerText = state.summary.followup;
  document.getElementById('cnt-offer').innerText = state.summary.offer;
  document.getElementById('cnt-interview').innerText = state.summary.interview;
  document.getElementById('cnt-applied').innerText = state.summary.applied;
  document.getElementById('cnt-rejected').innerText = state.summary.rejected;
}

function renderScamAlerts() {
  const section = document.getElementById('scam-alerts-section');
  const container = document.getElementById('scam-cards-list');

  if (state.scams.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  document.getElementById('scam-count-pill').innerText = `${state.scams.length} Suspicious Offers Quarantined`;

  container.innerHTML = state.scams.map(item => `
    <div class="scam-card">
      <div>
        <div class="scam-card-top">
          <span class="scam-id-tag">EMAIL #${item.id}</span>
          <span class="scam-date-tag">${item.date}</span>
        </div>
        <div class="scam-card-sender">${escapeHtml(item.from)}</div>
        <div class="scam-card-subject">${escapeHtml(item.subject)}</div>
        <ul class="scam-reasons-list">
          ${item.scam_analysis.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn-sm btn-secondary" onclick="openEmailModal(${item.id})">
          Inspect Email & Evidence
        </button>
        <button class="btn btn-sm btn-voice" onclick="speakScamWarningById(${item.id})">
          🔊 Spoken Warning
        </button>
      </div>
    </div>
  `).join('');
}

function renderFollowups() {
  const section = document.getElementById('followup-section');
  const container = document.getElementById('followup-cards-list');
  const overdueApps = state.applications.filter(a => a.needs_followup);

  if (overdueApps.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = overdueApps.map(app => `
    <div class="followup-card">
      <div>
        <div class="followup-card-header">
          <span class="days-silent-pill">⏳ ${app.days_silent} Days Inactive</span>
          <span class="scam-date-tag">Last Activity: ${app.last_event_date}</span>
        </div>
        <div class="followup-company-title">${escapeHtml(app.company)}</div>
        <div class="followup-role-subject">${escapeHtml(app.role)}</div>
        <div class="draft-preview-box">
          ${escapeHtml(app.followup_draft.split('\n').slice(0, 4).join('\n'))}
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-sm btn-primary" onclick="copyAppFollowupDraft('${app.app_id}')">
          📋 Copy Outreach Draft
        </button>
        <button class="btn btn-sm btn-outline" onclick="openAppModal('${app.app_id}')">
          View Timeline
        </button>
      </div>
    </div>
  `).join('');
}

function renderTable() {
  const tbody = document.getElementById('table-body');
  const thead = document.querySelector('#applications-table thead tr');

  if (state.viewMode === 'apps') {
    // 🏢 APPLICATION VIEW (Grouped by Company/Role - Gap A)
    thead.innerHTML = `
      <th style="width: 90px;">App ID</th>
      <th style="width: 170px;">Company</th>
      <th style="width: 170px;">Current Stage</th>
      <th style="width: 210px;">Role Applied</th>
      <th>Communication Timeline</th>
      <th style="width: 130px; text-align: center;">Action</th>
    `;

    let filtered = state.applications;
    if (state.activeFilter === 'followup') {
      filtered = filtered.filter(a => a.needs_followup);
    } else if (state.activeFilter !== 'all') {
      filtered = filtered.filter(a => a.current_stage === state.activeFilter);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(a => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state"><div class="empty-wrap"><div class="empty-icon">🔍</div><h4>No applications match filter</h4></div></td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(app => {
      const isOverdue = app.needs_followup;
      const rowClass = isOverdue ? 'row-followup' : '';
      const stageBadge = getStageBadge(app.current_stage);
      const followupTag = isOverdue ? `<span class="followup-indicator">🔔 ${app.days_silent}d silent</span>` : '';

      // Build timeline pills
      const timelinePills = app.emails.map(e => `
        <span class="timeline-pill" title="${e.date}: ${escapeHtml(e.subject)}">
          ${e.category.toUpperCase().slice(0,3)} (${e.date.slice(5)})
        </span>
      `).join('→ ');

      return `
        <tr class="${rowClass}">
          <td><strong style="color: var(--accent-primary); font-family: var(--font-mono);">${app.app_id}</strong></td>
          <td><strong style="font-size: 0.95rem; color: var(--text-primary);">${escapeHtml(app.company)}</strong></td>
          <td>${stageBadge} ${followupTag}</td>
          <td style="color: var(--text-secondary);">${escapeHtml(app.role)}</td>
          <td>${timelinePills} <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">(${app.emails.length} email${app.emails.length > 1 ? 's' : ''})</span></td>
          <td style="text-align: center;">
            <button class="btn btn-sm btn-secondary" onclick="openAppModal('${app.app_id}')">
              View Timeline
            </button>
          </td>
        </tr>
      `;
    }).join('');

  } else {
    // 📨 RAW EMAIL STREAM VIEW
    thead.innerHTML = `
      <th style="width: 50px;">ID</th>
      <th style="width: 110px;">Date</th>
      <th style="width: 170px;">Classification</th>
      <th style="width: 220px;">Company / Sender</th>
      <th>Subject & Overview</th>
      <th style="width: 130px; text-align: center;">Action</th>
    `;

    let filtered = state.items;
    if (state.activeFilter === 'followup') {
      filtered = filtered.filter(i => i.followup.needs_followup);
    } else if (state.activeFilter !== 'all') {
      filtered = filtered.filter(i => i.category === state.activeFilter);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(i => i.subject.toLowerCase().includes(q) || i.from.toLowerCase().includes(q) || i.body.toLowerCase().includes(q));
    }

    tbody.innerHTML = filtered.map(item => {
      const isScam = item.category === 'scam';
      const isFollowup = item.followup.needs_followup;
      const rowClass = isScam ? 'row-scam' : (isFollowup ? 'row-followup' : '');
      const stageBadge = getStageBadge(item.category);
      const followupTag = isFollowup ? `<span class="followup-indicator">🔔 ${item.followup.days_silent}d silent</span>` : '';

      return `
        <tr class="${rowClass}">
          <td><strong>#${item.id}</strong></td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${item.date}</td>
          <td>${stageBadge} ${followupTag}</td>
          <td class="sender-text">${escapeHtml(item.from)}</td>
          <td class="subject-cell">
            <strong>${escapeHtml(item.subject)}</strong>
            <span class="subject-snippet">${escapeHtml(item.body)}</span>
          </td>
          <td style="text-align: center;">
            <button class="btn btn-sm btn-secondary" onclick="openEmailModal(${item.id})">
              Review
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function getStageBadge(cat) {
  if (cat === 'scam') return `<span class="stage-pill stage-scam">🚨 Fake Offer</span>`;
  if (cat === 'offer') return `<span class="stage-pill stage-offer">🎉 Genuine Offer</span>`;
  if (cat === 'interview') return `<span class="stage-pill stage-interview">📅 Interview</span>`;
  if (cat === 'rejected') return `<span class="stage-pill stage-rejected">❌ Rejected</span>`;
  return `<span class="stage-pill stage-applied">⏳ Applied</span>`;
}

// ==========================================
// Modal Handlers (Applications & Emails)
// ==========================================

window.openAppModal = function(appId) {
  const app = state.applications.find(a => a.app_id === appId);
  if (!app) return;

  const modal = document.getElementById('email-modal');
  document.getElementById('modal-subject').innerText = `${app.company} — ${app.role} (${app.app_id})`;
  document.getElementById('modal-from').innerText = `Current Stage: ${app.current_stage.toUpperCase()}`;
  document.getElementById('modal-date').innerText = `Timeline: ${app.created_date} to ${app.last_event_date} (${app.emails.length} events)`;

  const stagePill = document.getElementById('modal-stage-pill');
  stagePill.className = `modal-stage-pill stage-pill stage-${app.current_stage}`;
  stagePill.innerText = app.current_stage.toUpperCase();

  document.getElementById('modal-scam-box').style.display = 'none';

  // Followup section
  const followupBox = document.getElementById('modal-followup-box');
  if (app.needs_followup) {
    followupBox.style.display = 'block';
    document.getElementById('modal-days-silent').innerText = app.days_silent;
    document.getElementById('modal-followup-draft').innerText = app.followup_draft;
    document.getElementById('modal-btn-copy-draft').onclick = () => copyAppFollowupDraft(app.app_id);
  } else {
    followupBox.style.display = 'none';
  }

  // Render complete chronological timeline in body box
  const contentBox = document.getElementById('modal-body-content');
  contentBox.innerHTML = `
    <h4 style="margin-bottom: 0.75rem; color: #c7d2fe;">Communication History & Events:</h4>
    ${app.emails.map((e, idx) => `
      <div style="border-left: 3px solid var(--accent-primary); padding-left: 0.85rem; margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">
          <span><strong>Event #${idx + 1}: ${e.category.toUpperCase()}</strong> | From: ${escapeHtml(e.from)}</span>
          <span>${e.date}</span>
        </div>
        <div style="font-weight: 700; color: #fff; margin-bottom: 0.35rem;">${escapeHtml(e.subject)}</div>
        <div style="font-size: 0.825rem; color: #cbd5e1; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(e.body)}</div>
      </div>
    `).join('')}
  `;

  modal.style.display = 'flex';
};

window.openEmailModal = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('email-modal');
  const stagePill = document.getElementById('modal-stage-pill');
  const scamBox = document.getElementById('modal-scam-box');
  const followupBox = document.getElementById('modal-followup-box');

  document.getElementById('modal-subject').innerText = item.subject;
  document.getElementById('modal-from').innerText = item.from;
  document.getElementById('modal-date').innerText = item.date;
  document.getElementById('modal-body-content').innerText = item.body;

  stagePill.className = `modal-stage-pill stage-pill stage-${item.category}`;
  stagePill.innerText = item.category.toUpperCase();

  if (item.category === 'scam') {
    scamBox.style.display = 'block';
    const ul = document.getElementById('modal-scam-reasons');
    ul.innerHTML = item.scam_analysis.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('');
    document.getElementById('modal-btn-voice-warning').onclick = () => speakScamWarning(item);
  } else {
    scamBox.style.display = 'none';
  }

  if (item.followup.needs_followup) {
    followupBox.style.display = 'block';
    document.getElementById('modal-days-silent').innerText = item.followup.days_silent;
    document.getElementById('modal-followup-draft').innerText = item.followup.followup_draft;
    document.getElementById('modal-btn-copy-draft').onclick = () => copyEmailFollowupDraft(item.id);
  } else {
    followupBox.style.display = 'none';
  }

  modal.style.display = 'flex';
};

window.speakScamWarningById = function(id) {
  const item = state.scams.find(s => s.id === id);
  if (item) speakScamWarning(item);
};

window.speakScamWarning = function(item) {
  if (!('speechSynthesis' in window)) {
    showToast("Speech synthesis not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();

  const mainReason = item.scam_analysis.reasons[0] || "Suspicious fraudulent offer detected.";
  const textToSpeak = `Security Warning! An incoming email claiming to be from ${item.from} shows high risk signals. Warning evidence: ${mainReason}. Legitimate companies never charge candidates. Do not send training fees or confidential identity documents.`;

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.rate = 1.0;
  utterance.lang = 'en-IN';
  window.speechSynthesis.speak(utterance);
  showToast("🔊 Playing Gemini Spoken Scam Warning...", "normal");
};

window.copyAppFollowupDraft = function(appId) {
  const app = state.applications.find(a => a.app_id === appId);
  if (!app || !app.followup_draft) return;
  navigator.clipboard.writeText(app.followup_draft).then(() => {
    showToast(`✓ Outreach draft for ${app.company} copied to clipboard!`, 'success');
  });
};

window.copyEmailFollowupDraft = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item || !item.followup.followup_draft) return;
  navigator.clipboard.writeText(item.followup.followup_draft).then(() => {
    showToast(`✓ Outreach draft for ${item.followup.company} copied!`, 'success');
  });
};

function showToast(message, type = 'normal') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ==========================================
// Event Listeners Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Switcher (Default Light Theme with Dark Mode option)
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeBtn.innerText = '🌙 Dark Mode';
        showToast('Switched to Clean Light Theme', 'normal');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeBtn.innerText = '☀️ Light Mode';
        showToast('Switched to Dark Mode', 'normal');
      }
    });
  }

  // 1. View Mode Switcher (Applications vs Email Stream)
  document.getElementById('btn-view-apps').addEventListener('click', () => {
    state.viewMode = 'apps';
    document.getElementById('btn-view-apps').classList.add('active');
    document.getElementById('btn-view-emails').classList.remove('active');
    renderMetrics();
    renderTable();
  });

  document.getElementById('btn-view-emails').addEventListener('click', () => {
    state.viewMode = 'emails';
    document.getElementById('btn-view-emails').classList.add('active');
    document.getElementById('btn-view-apps').classList.remove('active');
    renderMetrics();
    renderTable();
  });

  // 2. Load Sample Button (Gap D: Self-updating pipeline on re-import)
  document.getElementById('btn-load-sample').addEventListener('click', () => {
    fetch('/api/sample')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          processEmailList(data.items);
          showToast(`Ingested & updated tracker with ${data.items.length} emails!`, 'success');
        } else {
          processEmailList(EMBEDDED_SAMPLE_DATA);
          showToast(`Ingested & updated tracker with 20 demo emails!`, 'success');
        }
      })
      .catch(() => {
        processEmailList(EMBEDDED_SAMPLE_DATA);
        showToast(`Ingested & updated tracker with 20 demo emails!`, 'success');
      });
  });

  // 3. Filter Pills
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      // sync metric cards active state
      document.querySelectorAll('.metric-card').forEach(c => {
        c.classList.toggle('active-filter', c.dataset.filter === btn.dataset.filter);
      });
      renderTable();
    });
  });

  // 3b. Interactive Metric Cards (Click to filter table)
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.dataset.filter || 'all';
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === filter);
      });
      document.querySelectorAll('.metric-card').forEach(c => c.classList.remove('active-filter'));
      card.classList.add('active-filter');
      state.activeFilter = filter;
      renderTable();
      showToast(`Showing: ${filter.toUpperCase()}`, 'normal');
    });
  });

  // 3c. Collapsible Section Toggles
  const btnToggleScams = document.getElementById('btn-toggle-scams');
  if (btnToggleScams) {
    btnToggleScams.addEventListener('click', () => {
      const list = document.getElementById('scam-cards-list');
      if (list.style.display === 'none') {
        list.style.display = 'grid';
        btnToggleScams.innerText = 'Hide Details';
      } else {
        list.style.display = 'none';
        btnToggleScams.innerText = 'Show Details';
      }
    });
  }

  const btnToggleFollowups = document.getElementById('btn-toggle-followups');
  if (btnToggleFollowups) {
    btnToggleFollowups.addEventListener('click', () => {
      const list = document.getElementById('followup-cards-list');
      if (list.style.display === 'none') {
        list.style.display = 'grid';
        btnToggleFollowups.innerText = 'Hide Details';
      } else {
        list.style.display = 'none';
        btnToggleFollowups.innerText = 'Show Details';
      }
    });
  }

  // 4. Search Box
  document.getElementById('search-input').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTable();
  });

  // 5. Configurable Model Selector
  document.getElementById('model-selector').addEventListener('change', (e) => {
    showToast(`Active Classifier Model set to: ${e.target.value}`, 'normal');
  });

  // 6. File Upload
  document.getElementById('file-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const content = evt.target.result;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          processEmailList(parsed);
          showToast(`Classified & grouped ${parsed.length} emails into applications!`, 'success');
        } catch (err) {
          alert("Invalid JSON file: " + err.message);
        }
      }
    };
    reader.readAsText(file);
  });

  // 7. Export Tracker
  document.getElementById('btn-export-json').addEventListener('click', () => {
    const exportPayload = {
      summary: state.summary,
      applications: state.applications,
      scams_quarantine: state.scams,
      raw_emails: state.items
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `job_hunt_tracker_${new Date().toISOString().slice(0,10)}.json`);
    dl.click();
    showToast("✓ Application Tracker exported to JSON!", "success");
  });

  // 8. Modal close handlers
  document.getElementById('btn-close-modal').addEventListener('click', () => {
    document.getElementById('email-modal').style.display = 'none';
  });
  document.getElementById('btn-modal-close-footer').addEventListener('click', () => {
    document.getElementById('email-modal').style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('email-modal');
    if (e.target === modal) modal.style.display = 'none';
  });

  // Initial self-update on load
  processEmailList(EMBEDDED_SAMPLE_DATA);
});
