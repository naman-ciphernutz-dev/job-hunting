/**
 * Job Hunt Autopilot — Modern SaaS Cockpit Engine
 * GDG Hackathon: Layoff Recovery & Scam Defense Workspace
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
    "subject": "Interview Invitation: Senior Backend Engineer - Razorpay Architecture Round",
    "body": "Hi Rahul, Following review of your profile, we would like to invite you for the Architecture & System Design round for Senior Backend Engineer at Razorpay. Please choose a slot for next Tuesday."
  },
  {
    "id": 10,
    "date": "2026-10-16",
    "from": "careers@postman.com",
    "subject": "Postman Engineering - Invitation to Pair Programming Round",
    "body": "Hi Rahul, Hope you are well. We would love to move forward with a 60-minute pair programming interview on distributed caching. Please provide your availability for this week."
  },
  {
    "id": 11,
    "date": "2026-10-13",
    "from": "recruiting@atlassian.com",
    "subject": "Application Received: Senior Software Engineer - Jira Core",
    "body": "Hi Rahul, Thanks for applying to Atlassian! We have received your application for Senior Software Engineer - Jira Core. We are currently evaluating candidates."
  },
  {
    "id": 12,
    "date": "2026-10-22",
    "from": "recruiting@atlassian.com",
    "subject": "Status of your application at Atlassian",
    "body": "Hi Rahul, Thank you for taking the time to interview with our team. We were very impressed with your technical depth, but have chosen another candidate who aligns more closely with our Jira Core requirements. We will keep your resume on file."
  },
  {
    "id": 13,
    "date": "2026-10-17",
    "from": "talent@cred.club",
    "subject": "Interview Scheduled: CRED Platform Architecture",
    "body": "Hi Rahul, Your system architecture interview with our VP of Engineering is confirmed for October 24 at 3 PM IST. Here is the Google Meet link: https://meet.google.com/cred-eng-interview"
  },
  {
    "id": 14,
    "date": "2026-10-08",
    "from": "careers@swiggy.in",
    "subject": "Application Received: Backend Engineer (Logistics)",
    "body": "Hello Rahul, Your application for Backend Engineer (Logistics Team) at Swiggy has been received. Our engineering hiring team will review your background and reach out."
  },
  {
    "id": 15,
    "date": "2026-10-19",
    "from": "hr@google-careers-hr.com",
    "subject": "Selected for Google Remote Cloud Architect - Interview on Telegram",
    "body": "Congratulations Rahul! You are chosen for Google Remote Cloud Architect position. Salary: $12,000 USD/month. No formal test required due to your strong LinkedIn presence. Contact our Lead Recruiter Dr. Robert on Telegram @GoogleCloudRecruit to receive appointment letter."
  },
  {
    "id": 16,
    "date": "2026-10-20",
    "from": "quick-hire-delhi@gmail.com",
    "subject": "Direct Selection Amazon Data Entry / Developer - Refundable Laptop Security Deposit",
    "body": "Urgent Requirement: Amazon Vendor Partner Direct Selection. Salary Rs 75,000/month. Selected candidates get Dell Core i7 laptop upon payment of Rs 2,500 security deposit. Amount refundable in first salary slip. Scan Aadhaar and PAN and transfer UPI to partner@okhdfc."
  },
  {
    "id": 17,
    "date": "2026-10-17",
    "from": "talent@hasura.io",
    "subject": "Application Acknowledged: Senior GraphQL Backend Specialist",
    "body": "Hi Rahul, We have received your application for the Senior GraphQL Specialist role at Hasura. Our engineering leads will review your GitHub and open-source contributions."
  },
  {
    "id": 18,
    "date": "2026-10-23",
    "from": "talent@hasura.io",
    "subject": "Offer of Employment: Senior GraphQL Backend Specialist at Hasura",
    "body": "Dear Rahul, Congratulations! We are thrilled to offer you the position of Senior GraphQL Backend Specialist at Hasura. Your compensation package details and equity grants are attached in the formal offer document. Please review and sign by October 30."
  },
  {
    "id": 19,
    "date": "2026-10-09",
    "from": "hiring@phonepe.com",
    "subject": "Your application for PhonePe Core Payments Platform",
    "body": "Dear Rahul, Thank you for interviewing with PhonePe Payments Platform. At this time, we have chosen to proceed with another applicant with deeper fintech ledger experience. We wish you the best in your career search."
  },
  {
    "id": 20,
    "date": "2026-10-24",
    "from": "talent@cred.club",
    "subject": "Formal Offer of Employment: Backend Platform Engineer at CRED",
    "body": "Hi Rahul, We were thoroughly impressed with your problem solving and architecture discussions across all interview rounds. We are delighted to extend a formal offer of employment for the Backend Platform Engineer position at CRED. Please review the attached offer package detailing base pay, CRED ESOPs, and benefits."
  }
];

// App State
const state = {
  activeView: 'apps', // 'apps', 'kanban', 'scams', 'followups', 'raw'
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

  const isScam = score >= 50;
  let category = "applied";

  if (isScam) {
    category = "scam";
  } else if (/formal offer|offer of employment|we are pleased to offer|pleased to extend/i.test(text)) {
    category = "offer";
  } else if (/interview|calendly|pair programming|system design|round 1|round 2|technical screening|google meet/i.test(text)) {
    category = "interview";
  } else if (/unfortunately|move forward with another|another candidate|not moving forward|wish you success|decided to proceed/i.test(text)) {
    category = "rejected";
  } else if (/application received|application acknowledged|successfully received|thank you for applying/i.test(text)) {
    category = "applied";
  }

  // Calculate follow-up requirement
  const emailDate = new Date(item.date + 'T00:00:00');
  const daysSilent = Math.max(0, Math.floor((state.referenceDate - emailDate) / (1000 * 60 * 60 * 24)));
  const isActive = (category === "applied" || category === "interview");
  const needsFollowup = isActive && (daysSilent >= 7);

  const company = extractCompany(item);

  return {
    ...item,
    company,
    role: extractRole(item),
    category,
    scam_analysis: {
      is_scam: isScam,
      score,
      reasons,
      signals
    },
    followup: {
      days_silent: daysSilent,
      needs_followup: needsFollowup,
      followup_draft: needsFollowup ? generateOutreachDraft(company, item.subject, daysSilent, category) : null
    }
  };
}

function extractCompany(item) {
  const from = (item.from || '').toLowerCase();
  const subject = item.subject || '';
  if (from.includes("razorpay")) return "Razorpay";
  if (from.includes("atlassian")) return "Atlassian";
  if (from.includes("hasura")) return "Hasura";
  if (from.includes("cred")) return "CRED";
  if (from.includes("swiggy")) return "Swiggy";
  if (from.includes("groww")) return "Groww";
  if (from.includes("zerodha")) return "Zerodha";
  if (from.includes("postman")) return "Postman";
  if (from.includes("stripe")) return "Stripe";
  if (from.includes("phonepe")) return "PhonePe";
  if (from.includes("zentech")) return "Zentech";
  if (from.includes("finly")) return "Finly";

  const domain = from.split('@')[1] || '';
  const domainPrefix = domain.split('.')[0];
  if (domainPrefix && !FREE_MAIL.some(m => domain.includes(m))) {
    return domainPrefix.charAt(0).toUpperCase() + domainPrefix.slice(1);
  }

  const brands = ["infosys", "wipro", "amazon", "google"];
  for (const b of brands) {
    if (subject.toLowerCase().includes(b)) return b.charAt(0).toUpperCase() + b.slice(1);
  }
  return "Company";
}

function extractRole(item) {
  const s = item.subject || '';
  const match = s.match(/(?:for|as|role:?|position:?)\s+([^-,–]+)/i);
  if (match) return match[1].trim();
  if (s.toLowerCase().includes("backend")) return "Backend Engineer";
  if (s.toLowerCase().includes("software")) return "Software Engineer";
  return "Software Engineer";
}

function generateOutreachDraft(company, subject, days, stage) {
  return `Hi ${company} Recruiting Team,\n\nI hope you're having a great week.\n\nI am writing to follow up on my candidacy for the role (${subject}), as it has been ${days} days since our last update. I remain very enthusiastic about the work you are doing at ${company} and would love to know if there are any next steps or additional context I can provide.\n\nBest regards,\nRahul Sharma`;
}

// Group emails into unified Application Records
function groupEmailsIntoApplications(emails) {
  const buckets = {};
  const scams = [];

  emails.forEach(email => {
    if (email.category === 'scam' || email.scam_analysis.is_scam) {
      scams.push(email);
      return;
    }

    const key = `${email.company.toLowerCase()}__${email.role.toLowerCase()}`;
    if (!buckets[key]) {
      buckets[key] = {
        app_id: `APP-${Object.keys(buckets).length + 101}`,
        company: email.company,
        role: email.role,
        emails: []
      };
    }
    buckets[key].emails.push(email);
  });

  const appsList = Object.values(buckets).map(app => {
    app.emails.sort((a, b) => new Date(a.date) - new Date(b.date));
    app.created_date = app.emails[0].date;
    app.last_event_date = app.emails[app.emails.length - 1].date;

    const latestEmail = app.emails[app.emails.length - 1];
    app.current_stage = latestEmail.category;

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
// Rendering & View Switching Logic
// ==========================================

function renderAll() {
  renderMetrics();
  renderActiveView();
}

function renderMetrics() {
  document.getElementById('val-total').innerText = state.summary.totalApps;
  document.getElementById('val-applied').innerText = state.summary.applied;
  document.getElementById('val-interview').innerText = state.summary.interview;
  document.getElementById('val-offer').innerText = state.summary.offer;
  document.getElementById('val-scam').innerText = state.summary.scam;
  document.getElementById('val-followup').innerText = state.summary.followup;

  document.getElementById('cnt-apps-total').innerText = state.summary.totalApps;
  document.getElementById('cnt-kanban-total').innerText = state.summary.totalApps;
  document.getElementById('cnt-emails-total').innerText = state.summary.totalEmails;
  document.getElementById('cnt-scam').innerText = state.summary.scam;
  document.getElementById('cnt-followup').innerText = state.summary.followup;

  const isRaw = (state.activeView === 'raw');
  document.getElementById('cnt-all').innerText = isRaw ? state.summary.totalEmails : state.summary.totalApps;
  document.getElementById('cnt-applied').innerText = state.summary.applied;
  document.getElementById('cnt-interview').innerText = state.summary.interview;
  document.getElementById('cnt-offer').innerText = state.summary.offer;
  document.getElementById('cnt-rejected').innerText = state.summary.rejected;
  document.getElementById('cnt-scam-pill').innerText = state.summary.scam;
  document.getElementById('cnt-followup-pill').innerText = state.summary.followup;
}

function switchView(viewName) {
  state.activeView = viewName;
  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  // Hide all view panels
  ['view-apps-panel', 'view-kanban-panel', 'view-scams-panel', 'view-followups-panel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const titleEl = document.getElementById('workspace-title');
  const countEl = document.getElementById('workspace-count');

  if (viewName === 'apps') {
    document.getElementById('view-apps-panel').style.display = 'block';
    titleEl.innerText = "Application Records (13)";
    countEl.innerText = `${state.applications.length} applications`;
    renderTable();
  } else if (viewName === 'kanban') {
    document.getElementById('view-kanban-panel').style.display = 'block';
    titleEl.innerText = "Kanban Pipeline Board";
    countEl.innerText = "4 Stage Columns";
    renderKanban();
  } else if (viewName === 'scams') {
    document.getElementById('view-scams-panel').style.display = 'block';
    titleEl.innerText = "Scam Defense Quarantine";
    countEl.innerText = `${state.scams.length} isolated threats`;
    renderScamStudio();
  } else if (viewName === 'followups') {
    document.getElementById('view-followups-panel').style.display = 'block';
    titleEl.innerText = "Follow-Up Copilot (≥7d Silent)";
    countEl.innerText = `${state.summary.followup} drafts ready`;
    renderFollowupCopilot();
  } else if (viewName === 'raw') {
    document.getElementById('view-apps-panel').style.display = 'block';
    titleEl.innerText = "Raw Inbox Stream (20)";
    countEl.innerText = `${state.items.length} incoming emails`;
    renderTable();
  }
}

function renderActiveView() {
  switchView(state.activeView);
}

// 1. Data Grid Table Renderer
function renderTable() {
  const tbody = document.getElementById('table-body');
  const thead = document.querySelector('#applications-table thead tr');

  if (state.activeView === 'raw') {
    // Raw email stream view
    thead.innerHTML = `
      <th style="width: 50px;">#</th>
      <th style="width: 100px;">Date</th>
      <th style="width: 140px;">Stage</th>
      <th style="width: 180px;">Sender / From</th>
      <th>Subject & Body Overview</th>
      <th style="width: 120px; text-align: center;">Action</th>
    `;

    let filtered = state.items;
    if (state.activeFilter === 'followup') {
      filtered = filtered.filter(i => i.followup.needs_followup);
    } else if (state.activeFilter !== 'all') {
      filtered = filtered.filter(i => i.category === state.activeFilter);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(i => (i.subject || '').toLowerCase().includes(q) || (i.from || '').toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state"><div class="empty-wrap"><div class="empty-icon">🔍</div><h4>No emails match filter</h4></div></td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => `
      <tr onclick="openEmailDrawer(${item.id})">
        <td><strong style="color: var(--primary); font-family: var(--font-mono);">${item.id}</strong></td>
        <td style="font-family: var(--font-mono); font-size: 0.75rem;">${item.date}</td>
        <td>${getStageBadge(item.category)}</td>
        <td><strong style="color: var(--text-primary);">${escapeHtml(item.from.split('<')[0])}</strong></td>
        <td>${escapeHtml(item.subject)}</td>
        <td style="text-align: center;">
          <button class="btn btn-xs btn-secondary" onclick="event.stopPropagation(); openEmailDrawer(${item.id})">
            Inspect
          </button>
        </td>
      </tr>
    `).join('');

  } else {
    // 🏢 Grouped Application Records View
    thead.innerHTML = `
      <th style="width: 80px;">App ID</th>
      <th style="width: 190px;">Company</th>
      <th style="width: 160px;">Stage</th>
      <th style="width: 190px;">Role</th>
      <th>Communication Timeline</th>
      <th style="width: 120px; text-align: center;">Action</th>
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
      const stageBadge = getStageBadge(app.current_stage);
      const followupTag = isOverdue ? `<span class="followup-indicator">🔔 ${app.days_silent}d silent</span>` : '';
      const avatarLetters = app.company.slice(0, 2).toUpperCase();

      const timelinePills = app.emails.map(e => `
        <span class="timeline-pill" title="${e.date}: ${escapeHtml(e.subject)}">
          ${e.category.toUpperCase().slice(0,3)} (${e.date.slice(5)})
        </span>
      `).join('→ ');

      return `
        <tr onclick="openAppDrawer('${app.app_id}')">
          <td><strong style="color: var(--primary); font-family: var(--font-mono);">${app.app_id}</strong></td>
          <td>
            <div class="company-cell">
              <div class="company-avatar">${avatarLetters}</div>
              <span class="company-name">${escapeHtml(app.company)}</span>
            </div>
          </td>
          <td>${stageBadge} ${followupTag}</td>
          <td style="color: var(--text-secondary);">${escapeHtml(app.role)}</td>
          <td>${timelinePills} <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 4px;">(${app.emails.length})</span></td>
          <td style="text-align: center;">
            <button class="btn btn-xs btn-secondary" onclick="event.stopPropagation(); openAppDrawer('${app.app_id}')">
              Timeline
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

// 2. Kanban Board Renderer
function renderKanban() {
  const colApplied = document.getElementById('kanban-col-applied');
  const colInterview = document.getElementById('kanban-col-interview');
  const colOffer = document.getElementById('kanban-col-offer');
  const colRejected = document.getElementById('kanban-col-rejected');

  const apps = state.applications;
  const appliedList = apps.filter(a => a.current_stage === 'applied');
  const interviewList = apps.filter(a => a.current_stage === 'interview');
  const offerList = apps.filter(a => a.current_stage === 'offer');
  const rejectedList = apps.filter(a => a.current_stage === 'rejected');

  document.getElementById('kanban-cnt-applied').innerText = appliedList.length;
  document.getElementById('kanban-cnt-interview').innerText = interviewList.length;
  document.getElementById('kanban-cnt-offer').innerText = offerList.length;
  document.getElementById('kanban-cnt-rejected').innerText = rejectedList.length;

  const renderCard = (app) => `
    <div class="kanban-card" onclick="openAppDrawer('${app.app_id}')">
      <div class="kanban-card-top">
        <span class="kanban-card-company">${escapeHtml(app.company)}</span>
        <span class="timeline-pill">${app.app_id}</span>
      </div>
      <div class="kanban-card-role">${escapeHtml(app.role)}</div>
      <div class="kanban-card-footer">
        <span>${app.last_event_date}</span>
        ${app.needs_followup ? `<span class="followup-indicator">🔔 ${app.days_silent}d silent</span>` : `<span>${app.emails.length} events</span>`}
      </div>
    </div>
  `;

  colApplied.innerHTML = appliedList.map(renderCard).join('') || '<div style="font-size: 0.75rem; color: var(--text-muted); padding: 0.5rem;">None</div>';
  colInterview.innerHTML = interviewList.map(renderCard).join('') || '<div style="font-size: 0.75rem; color: var(--text-muted); padding: 0.5rem;">None</div>';
  colOffer.innerHTML = offerList.map(renderCard).join('') || '<div style="font-size: 0.75rem; color: var(--text-muted); padding: 0.5rem;">None</div>';
  colRejected.innerHTML = rejectedList.map(renderCard).join('') || '<div style="font-size: 0.75rem; color: var(--text-muted); padding: 0.5rem;">None</div>';
}

// 3. Scam Studio Renderer
function renderScamStudio() {
  const container = document.getElementById('scam-cards-list');
  if (state.scams.length === 0) {
    container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted);">No scam offers detected.</div>';
    return;
  }

  container.innerHTML = state.scams.map(item => `
    <div class="scam-studio-card" onclick="openEmailDrawer(${item.id})">
      <div>
        <div class="scam-card-meta">
          <span class="scam-card-id">EMAIL #${item.id}</span>
          <span class="scam-card-sender">${escapeHtml(item.from)}</span>
        </div>
        <div class="scam-card-subject">${escapeHtml(item.subject)}</div>
        <ul class="evidence-bullet-list">
          ${item.scam_analysis.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
        <button class="btn btn-xs btn-secondary" onclick="event.stopPropagation(); openEmailDrawer(${item.id})">
          Inspect Evidence
        </button>
        <button class="btn btn-xs btn-voice" onclick="event.stopPropagation(); speakScamWarningById(${item.id})">
          🔊 Spoken Warning
        </button>
      </div>
    </div>
  `).join('');
}

// 4. Follow-Up Copilot Renderer
function renderFollowupCopilot() {
  const container = document.getElementById('followup-cards-list');
  const overdueApps = state.applications.filter(a => a.needs_followup);

  if (overdueApps.length === 0) {
    container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted);">No applications currently overdue for follow-up!</div>';
    return;
  }

  container.innerHTML = overdueApps.map(app => `
    <div class="followup-copilot-card">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="followup-card-company">${escapeHtml(app.company)}</span>
          <span class="days-silent-meter">🔔 ${app.days_silent} Days Silent</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          Role: <strong>${escapeHtml(app.role)}</strong> (${app.app_id})
        </div>
        <div class="draft-box">${escapeHtml(app.followup_draft)}</div>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
        <button class="btn btn-xs btn-primary" onclick="copyAppFollowupDraft('${app.app_id}')">
          📋 Copy Outreach Draft
        </button>
        <button class="btn btn-xs btn-secondary" onclick="openAppDrawer('${app.app_id}')">
          View Timeline
        </button>
      </div>
    </div>
  `).join('');
}

// Helper: Stage Badges
function getStageBadge(category) {
  const map = {
    applied: '<span class="stage-pill stage-applied">⏳ Applied</span>',
    interview: '<span class="stage-pill stage-interview">📅 Interview</span>',
    offer: '<span class="stage-pill stage-offer">🎉 Genuine Offer</span>',
    rejected: '<span class="stage-pill stage-rejected">❌ Rejected</span>',
    scam: '<span class="stage-pill stage-scam">🚨 Fake Offer</span>'
  };
  return map[category] || `<span class="stage-pill">${category}</span>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================
// Slide-Over Detail Drawer Logic
// ==========================================

function openAppDrawer(appId) {
  const app = state.applications.find(a => a.app_id === appId);
  if (!app) return;

  const drawer = document.getElementById('detail-drawer');
  document.getElementById('drawer-title').innerText = `${app.company}`;
  document.getElementById('drawer-sub').innerText = `${app.role} (${app.app_id})`;
  document.getElementById('drawer-meta-range').innerText = `${app.created_date} to ${app.last_event_date}`;
  document.getElementById('drawer-meta-events').innerText = `${app.emails.length} communications`;

  const stagePill = document.getElementById('drawer-stage-pill');
  stagePill.className = `stage-pill stage-${app.current_stage}`;
  stagePill.innerText = app.current_stage.toUpperCase();

  document.getElementById('drawer-scam-box').style.display = 'none';

  const followupBox = document.getElementById('drawer-followup-box');
  if (app.needs_followup) {
    followupBox.style.display = 'block';
    document.getElementById('drawer-days-silent').innerText = app.days_silent;
    document.getElementById('drawer-followup-draft').innerText = app.followup_draft;
    document.getElementById('drawer-btn-copy-draft').onclick = () => copyAppFollowupDraft(app.app_id);
  } else {
    followupBox.style.display = 'none';
  }

  const timelineContent = document.getElementById('drawer-timeline-content');
  timelineContent.innerHTML = app.emails.map(email => `
    <div class="timeline-node">
      <div class="timeline-node-header">
        <span style="font-weight: 700; color: var(--text-primary);">${escapeHtml(email.date)}</span>
        <span class="stage-pill stage-${email.category}" style="font-size: 0.68rem;">${email.category.toUpperCase()}</span>
      </div>
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
        ${escapeHtml(email.subject)}
      </div>
      <div class="timeline-node-body">
        ${escapeHtml(email.body)}
      </div>
    </div>
  `).join('');

  drawer.classList.add('open');
}

function openEmailDrawer(emailId) {
  const item = state.items.find(i => i.id === emailId);
  if (!item) return;

  const drawer = document.getElementById('detail-drawer');
  document.getElementById('drawer-title').innerText = item.subject;
  document.getElementById('drawer-sub').innerText = `From: ${item.from}`;
  document.getElementById('drawer-meta-range').innerText = item.date;
  document.getElementById('drawer-meta-events').innerText = `Email #${item.id}`;

  const stagePill = document.getElementById('drawer-stage-pill');
  stagePill.className = `stage-pill stage-${item.category}`;
  stagePill.innerText = item.category.toUpperCase();

  const scamBox = document.getElementById('drawer-scam-box');
  if (item.scam_analysis.is_scam) {
    scamBox.style.display = 'block';
    const ul = document.getElementById('drawer-scam-reasons');
    ul.innerHTML = item.scam_analysis.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('');
    document.getElementById('drawer-btn-voice-warning').onclick = () => speakScamWarning(item);
  } else {
    scamBox.style.display = 'none';
  }

  document.getElementById('drawer-followup-box').style.display = 'none';

  const timelineContent = document.getElementById('drawer-timeline-content');
  timelineContent.innerHTML = `
    <div class="timeline-node">
      <div class="timeline-node-header">
        <span style="font-weight: 700; color: var(--text-primary);">${item.date}</span>
      </div>
      <div class="timeline-node-body" style="font-size: 0.8rem; line-height: 1.5; white-space: pre-wrap;">
        ${escapeHtml(item.body)}
      </div>
    </div>
  `;

  drawer.classList.add('open');
}

function closeDrawer() {
  const drawer = document.getElementById('detail-drawer');
  if (drawer) drawer.classList.remove('open');
}

// Voice warning synthesis
function speakScamWarning(item) {
  if (!('speechSynthesis' in window)) {
    alert("Speech synthesis is not supported on this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const warningText = `Security warning. The email regarding ${item.subject} has been quarantined as a fraudulent offer. Reasons include: ${item.scam_analysis.reasons.join(". ")}. Do not pay any training fees or submit identity cards.`;
  const utterance = new SpeechSynthesisUtterance(warningText);
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
  showToast("🔊 Playing Spoken Scam Warning...", "danger");
}

function speakScamWarningById(id) {
  const item = state.scams.find(s => s.id === id);
  if (item) speakScamWarning(item);
}

// Copy Follow-Up drafts
function copyAppFollowupDraft(appId) {
  const app = state.applications.find(a => a.app_id === appId);
  if (app && app.followup_draft) {
    navigator.clipboard.writeText(app.followup_draft).then(() => {
      showToast(`✓ Outreach draft for ${app.company} copied to clipboard!`, "success");
    });
  }
}

// Toast notification
function showToast(message, type = "normal") {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// ==========================================
// Initialization & Event Binding
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeBtn.innerText = '🌙 Dark';
        showToast('Switched to Modern Light Theme');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeBtn.innerText = '☀️ Light';
        showToast('Switched to Dark Theme');
      }
    });
  }

  // Sidebar Dock Navigation
  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
    });
  });

  // KPI Ribbon Clicks (Direct Quick Filter & Switch)
  document.querySelectorAll('.kpi-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter || 'all';
      if (filter === 'scam') {
        switchView('scams');
      } else if (filter === 'followup') {
        switchView('followups');
      } else {
        switchView('apps');
        state.activeFilter = filter;
        document.querySelectorAll('.filter-pill').forEach(b => {
          b.classList.toggle('active', b.dataset.filter === filter);
        });
        renderTable();
      }
    });
  });

  // Filter Pills inside toolbar
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      if (state.activeFilter === 'scam') {
        switchView('scams');
      } else if (state.activeFilter === 'followup') {
        switchView('followups');
      } else {
        if (state.activeView !== 'apps' && state.activeView !== 'raw') {
          switchView('apps');
        } else {
          renderTable();
        }
      }
    });
  });

  // Search Input
  document.getElementById('search-input').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTable();
  });

  // Model Selector
  document.getElementById('model-selector').addEventListener('change', (e) => {
    showToast(`Active Classifier: ${e.target.value}`);
  });

  // Load Demo Inbox Button
  document.getElementById('btn-load-sample').addEventListener('click', () => {
    fetch('/api/sample')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          processEmailList(data.items);
          showToast(`Ingested ${data.items.length} demo communications!`, 'success');
        } else {
          processEmailList(EMBEDDED_SAMPLE_DATA);
          showToast(`Ingested 20 demo communications!`, 'success');
        }
      })
      .catch(() => {
        processEmailList(EMBEDDED_SAMPLE_DATA);
        showToast(`Ingested 20 demo communications!`, 'success');
      });
  });

  // File Upload
  document.getElementById('file-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        processEmailList(parsed);
        showToast(`Ingested ${parsed.length} communications from ${file.name}!`, 'success');
      } catch (err) {
        alert("Invalid file: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // Export JSON
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
    showToast("✓ Tracker Exported to JSON!", "success");
  });

  // Drawer Close Handlers
  document.getElementById('btn-close-drawer').addEventListener('click', closeDrawer);
  document.getElementById('btn-drawer-dismiss').addEventListener('click', closeDrawer);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Initial self-update on load
  processEmailList(EMBEDDED_SAMPLE_DATA);
});
