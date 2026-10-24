/**
 * Job Hunt Autopilot - Interactive Web Application Logic
 * GDG Hackathon: Layoff Recovery & Fake Offer Forensic Tracker
 */

// Embedded default 20-email layoff recovery dataset (for zero-latency or offline file:// execution)
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
    "date": "2026-10-21",
    "from": "recruiting@razorpay.com",
    "subject": "Razorpay Tech Round 2: System Architecture Discussion",
    "body": "Hi Rahul, Great job on the live coding round! We are excited to advance you to Round 2 with our Principal Architect. The session will focus on distributed caching and concurrency. Please confirm if 26th October at 3:00 PM IST works for you."
  },
  {
    "id": 9,
    "date": "2026-10-17",
    "from": "careers@atlassian.com",
    "subject": "Your application to Atlassian",
    "body": "Dear Rahul, Thank you for taking the time to interview with Atlassian for the Senior Fullstack / Backend Engineer vacancy. After careful evaluation, we have chosen not to proceed with your candidacy at this time. We will keep your profile in our talent pool for future opportunities."
  },
  {
    "id": 10,
    "date": "2026-10-16",
    "from": "amazon.global.work@gmail.com",
    "subject": "Urgent Part-time / Remote Software Job - Rs 5000 Daily",
    "body": "Greetings! Selected directly for Amazon Global Partner Remote Operations. Earn Rs 3,000 to Rs 8,000 daily from home. No interview needed. Join our Telegram channel @AmazonRecruitIndia and pay Rs 1,499 one-time registration and verification fee. Limited slots available."
  },
  {
    "id": 11,
    "date": "2026-10-22",
    "from": "hiring@zepto.in",
    "subject": "Thanks for applying to Zepto (Quick Commerce Backend)",
    "body": "Hi Rahul, Thanks for applying for Senior Backend Engineer at Zepto. Our recruitment team has received your details and GitHub profile. We will reach out shortly regarding next steps."
  },
  {
    "id": 12,
    "date": "2026-10-22",
    "from": "hr@hasura.io",
    "subject": "Official Offer Letter: Senior Software Engineer at Hasura",
    "body": "Dear Rahul, On behalf of Hasura Inc., we are thrilled to formally offer you the position of Senior Software Engineer on our Engine Team. Attached is your comprehensive offer letter outlining your compensation (INR 28,00,000 base + stock options), health benefits, and proposed joining date of 16th November 2026. Please sign and return the letter within 5 business days."
  },
  {
    "id": 13,
    "date": "2026-10-20",
    "from": "talent@flipkart.com",
    "subject": "Status update on your application at Flipkart",
    "body": "Hello Rahul, Thank you for your interest in joining Flipkart. Due to internal restructuring and headcount allocation adjustments, this specific role has been placed on hold. We will retain your resume for future openings."
  },
  {
    "id": 14,
    "date": "2026-10-23",
    "from": "talent@postman.com",
    "subject": "Invitation to Interview: Postman Platform Team",
    "body": "Hi Rahul, We reviewed your background and would love to schedule a 30-minute technical screening call with our Engineering Manager. Please click the link below to select a time that suits your schedule: https://postman.hire.com/interview/rahul-verma"
  },
  {
    "id": 15,
    "date": "2026-10-19",
    "from": "tcs.immediate.selection@outlook.com",
    "subject": "Urgent: Direct Selection in Tata Consultancy Services (TCS)",
    "body": "Dear candidate, Aapka direct selection ho gaya hai TCS Bangalore me software engineer post ke liye. Package 8.5 LPA. Technical interview round waived off. Joining process confirm karne ke liye Rs 2,999 verification charges UPI karein. Send Aadhaar card, PAN card and photo on WhatsApp +91-9123456789. Yeh fee pehli salary me 100% refund hogi."
  },
  {
    "id": 16,
    "date": "2026-10-08",
    "from": "careers@swiggy.in",
    "subject": "Application Acknowledgment - SDE 2 (Delivery Platform)",
    "body": "Hi Rahul, Thank you for applying to Swiggy. We have received your application for SDE 2 - Delivery Platform. We appreciate your interest and our team is evaluating all profiles against our open requirements."
  },
  {
    "id": 17,
    "date": "2026-10-13",
    "from": "people@browserstack.com",
    "subject": "BrowserStack Application Received",
    "body": "Hi Rahul, Thank you for submitting your application for the Senior Systems Engineer position at BrowserStack. We will review your qualifications and contact you if there is a match."
  },
  {
    "id": 18,
    "date": "2026-10-24",
    "from": "people@cred.club",
    "subject": "Formal Offer of Employment: Backend Platform Engineer at CRED",
    "body": "Hi Rahul, We were thoroughly impressed with your problem solving and architecture discussions across all interview rounds. We are delighted to extend a formal offer of employment for the Backend Platform Engineer position at CRED. Please review the attached offer package detailing base pay, CRED ESOPs, and benefits."
  },
  {
    "id": 19,
    "date": "2026-10-16",
    "from": "no-reply@uber.com",
    "subject": "Your application to Uber",
    "body": "Thank you for your interest in Uber and for taking the time to submit your application. At this time, we have decided not to advance your candidacy for this role. We encourage you to check our careers page for other suitable positions in the future."
  },
  {
    "id": 20,
    "date": "2026-10-24",
    "from": "recruiting@urbancompany.com",
    "subject": "Invitation to Code Pair: Urban Company",
    "body": "Hi Rahul, We would like to invite you to a 60-minute virtual pair-programming round with our core infrastructure team. Please choose your availability for early next week using the link enclosed."
  }
];

// App State
const state = {
  activeFilter: 'all',
  searchQuery: '',
  items: [],
  summary: {
    total: 0,
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
    reasons.push(`Corporate Impersonation: Claims affiliation with ${brandMatched.toUpperCase()}, but sends from free webmail provider (@${senderDomain}).`);
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
    reasons.push(`Advance Fee Fraud: Demands upfront monetary payment/deposit ('${feeMatch[0]}'). Legitimate employers NEVER charge applicants.`);
  }

  // 3. Sensitive ID Phishing
  const kycRegex = /\b(?:aadhaar|aadhar|pan\s*card|voter\s*id|passport\s*copy|bank\s*details|cancelled\s*cheque)\b/i;
  if (kycRegex.test(text)) {
    score += 35;
    signals.push("KYC_IDENTITY_PHISHING");
    reasons.push(`Sensitive Document Phishing: Demands confidential government identity scans (Aadhaar/PAN) prematurely.`);
  }

  // 4. Bypass / No Interview Shortcut
  const shortcutRegex = /\b(?:direct\s*selection|direct\s*joining|no\s*interview\s*needed|round\s*waived|waived\s*off)\b/i;
  const shortcutMatch = text.match(shortcutRegex);
  if (shortcutMatch) {
    score += 35;
    signals.push("UNREALISTIC_OFFER_SHORTCUT");
    reasons.push(`Unrealistic Selection Bypass: Claims direct appointment or waived interviews ('${shortcutMatch[0]}').`);
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
    reasons.push(`High-risk Scam Phrasing: Matches known regional recruitment fraud vernacular.`);
  }

  const isScam = score >= 50;
  let category = "applied";

  if (isScam) {
    category = "scam";
  } else {
    // Normal classification
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

  // Calculate follow-up status
  const emailDate = new Date(item.date + 'T00:00:00');
  const diffTime = Math.max(0, state.referenceDate - emailDate);
  const daysSilent = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const isEligible = (category === "applied" || category === "interview");
  const needsFollowup = isEligible && (daysSilent >= 7);

  // Extract company name
  let company = "the Hiring Team";
  if (item.subject.includes("at ")) company = item.subject.split("at ")[1].split("-")[0].trim();
  else if (item.subject.includes(": ")) company = item.subject.split(":")[0].trim();
  else if (senderDomain.includes(".")) company = senderDomain.split(".")[0].toUpperCase();

  // Generate outreach draft
  let followupDraft = null;
  if (needsFollowup) {
    if (category === "interview") {
      followupDraft = `Subject: Following up on our recent interview - ${company}\n\nDear ${company} Team,\n\nI hope you are having a productive week. It was a pleasure discussing the opportunity with your engineering team recently.\n\nSince it has been ${daysSilent} days, I am writing to check in on the status of my candidacy and see if there are any additional details or code samples I can provide to assist in your decision.\n\nI remain very enthusiastic about the role and look forward to hearing about next steps.\n\nBest regards,\nRahul Verma`;
    } else {
      followupDraft = `Subject: Following up on application: ${item.subject.replace(/Application received:|Application Confirmation:/i, '').trim()}\n\nDear ${company} Recruiting Team,\n\nI recently submitted my application for this position ${daysSilent} days ago and wanted to follow up. With my background in high-throughput backend services and distributed systems, I am eager to contribute to ${company}'s infrastructure.\n\nPlease let me know if you need any additional portfolio links, references, or details from my end.\n\nThank you for your time and consideration,\nRahul Verma`;
    }
  }

  return {
    ...item,
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
      followup_draft: followupDraft
    }
  };
}

// Process a list of emails
function processEmailList(rawList) {
  const processed = rawList.map(clientClassifyEmail);
  state.items = processed;

  // Recalculate summary metrics
  const counts = {
    total: processed.length,
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
    scam: 0,
    followup: 0
  };

  processed.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    if (item.followup.needs_followup) {
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
  document.getElementById('val-total').innerText = state.summary.total;
  document.getElementById('val-applied').innerText = state.summary.applied;
  document.getElementById('val-interview').innerText = state.summary.interview;
  document.getElementById('val-offer').innerText = state.summary.offer;
  document.getElementById('val-scam').innerText = state.summary.scam;
  document.getElementById('val-followup').innerText = state.summary.followup;

  // Update filter pill counts
  document.getElementById('cnt-all').innerText = state.summary.total;
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
  const scamItems = state.items.filter(i => i.category === 'scam');

  if (scamItems.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  document.getElementById('scam-count-pill').innerText = `${scamItems.length} Fake Offers Blocked`;

  container.innerHTML = scamItems.map(item => `
    <div class="scam-card">
      <div>
        <div class="scam-card-top">
          <span class="scam-id-tag">ID #${item.id}</span>
          <span class="scam-date-tag">${item.date}</span>
        </div>
        <div class="scam-card-sender">${escapeHtml(item.from)}</div>
        <div class="scam-card-subject">${escapeHtml(item.subject)}</div>
        <ul class="scam-reasons-list">
          ${item.scam_analysis.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ul>
      </div>
      <div>
        <button class="btn btn-sm btn-secondary" onclick="openModal(${item.id})">
          Inspect Email & Evidence
        </button>
      </div>
    </div>
  `).join('');
}

function renderFollowups() {
  const section = document.getElementById('followup-section');
  const container = document.getElementById('followup-cards-list');
  const followupItems = state.items.filter(i => i.followup.needs_followup);

  if (followupItems.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = followupItems.map(item => `
    <div class="followup-card">
      <div>
        <div class="followup-card-header">
          <span class="days-silent-pill">⏳ ${item.followup.days_silent} Days Silent</span>
          <span class="scam-date-tag">Applied: ${item.date}</span>
        </div>
        <div class="followup-company-title">${escapeHtml(item.followup.company)}</div>
        <div class="followup-role-subject">${escapeHtml(item.subject)}</div>
        <div class="draft-preview-box">
          ${escapeHtml(item.followup.followup_draft.split('\n').slice(0, 4).join('\n'))}
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-sm btn-primary" onclick="copyFollowupDraft(${item.id})">
          📋 Copy Outreach Draft
        </button>
        <button class="btn btn-sm btn-outline" onclick="openModal(${item.id})">
          View
        </button>
      </div>
    </div>
  `).join('');
}

function renderTable() {
  const tbody = document.getElementById('table-body');

  let filtered = state.items;

  // Filter stage
  if (state.activeFilter === 'followup') {
    filtered = filtered.filter(i => i.followup.needs_followup);
  } else if (state.activeFilter !== 'all') {
    filtered = filtered.filter(i => i.category === state.activeFilter);
  }

  // Search filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(i => 
      i.subject.toLowerCase().includes(q) ||
      i.from.toLowerCase().includes(q) ||
      i.body.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-wrap">
            <div class="empty-icon">🔍</div>
            <h4>No applications match your filter</h4>
            <p>Try switching filter tabs or clearing your search term.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const isScam = item.category === 'scam';
    const isFollowup = item.followup.needs_followup;
    const rowClass = isScam ? 'row-scam' : (isFollowup ? 'row-followup' : '');

    let stageBadge = '';
    if (isScam) {
      stageBadge = `<span class="stage-pill stage-scam">🚨 Fake Offer / Scam</span>`;
    } else if (item.category === 'offer') {
      stageBadge = `<span class="stage-pill stage-offer">🎉 Genuine Offer</span>`;
    } else if (item.category === 'interview') {
      stageBadge = `<span class="stage-pill stage-interview">📅 Interview</span>`;
    } else if (item.category === 'rejected') {
      stageBadge = `<span class="stage-pill stage-rejected">❌ Rejected</span>`;
    } else {
      stageBadge = `<span class="stage-pill stage-applied">⏳ Applied</span>`;
    }

    const followupTag = isFollowup 
      ? `<span class="followup-indicator">🔔 ${item.followup.days_silent}d silent</span>` 
      : '';

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
          <button class="btn btn-sm btn-secondary" onclick="openModal(${item.id})">
            Review
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// Modal & Interactions
// ==========================================

window.openModal = function(id) {
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

  // Stage pill in modal
  stagePill.className = `modal-stage-pill stage-pill stage-${item.category}`;
  stagePill.innerText = item.category.toUpperCase();

  // Scam section in modal
  if (item.category === 'scam') {
    scamBox.style.display = 'block';
    const ul = document.getElementById('modal-scam-reasons');
    ul.innerHTML = item.scam_analysis.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('');
    
    // Voice Warning button
    document.getElementById('modal-btn-voice-warning').onclick = () => {
      speakScamWarning(item);
    };
  } else {
    scamBox.style.display = 'none';
  }

  // Follow-up section in modal
  if (item.followup.needs_followup) {
    followupBox.style.display = 'block';
    document.getElementById('modal-days-silent').innerText = item.followup.days_silent;
    document.getElementById('modal-followup-draft').innerText = item.followup.followup_draft;
    document.getElementById('modal-btn-copy-draft').onclick = () => copyFollowupDraft(item.id);
  } else {
    followupBox.style.display = 'none';
  }

  modal.style.display = 'flex';
};

window.speakScamWarning = function(item) {
  if (!('speechSynthesis' in window)) {
    showToast("Speech synthesis not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel(); // Stop any previous utterance

  const mainReason = item.scam_analysis.reasons[0] || "Suspicious fraudulent offer detected.";
  const textToSpeak = `Security Alert! This email claiming to be from ${item.from} has been flagged as a fraudulent fake offer. Key danger: ${mainReason}. Do not transfer any training fees or dispatch charges, and never share your Aadhaar or PAN card.`;

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = 'en-IN'; // Indian English voice preference

  window.speechSynthesis.speak(utterance);
  showToast("🔊 Playing Gemini Spoken Scam Warning...", "normal");
};

window.copyFollowupDraft = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item || !item.followup.followup_draft) return;

  navigator.clipboard.writeText(item.followup.followup_draft).then(() => {
    showToast(`✓ Outreach draft for ${item.followup.company} copied to clipboard!`, 'success');
  }).catch(() => {
    showToast(`Copied draft!`, 'success');
  });
};

function showToast(message, type = 'normal') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// ==========================================
// Event Listeners Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load Sample Button
  document.getElementById('btn-load-sample').addEventListener('click', () => {
    // Attempt fetch from /api/sample or fallback to embedded
    fetch('/api/sample')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          state.items = data.items;
          state.summary = {
            total: data.summary.total_emails,
            applied: data.summary.stages.applied,
            interview: data.summary.stages.interview,
            rejected: data.summary.stages.rejected,
            offer: data.summary.stages.offer,
            scam: data.summary.stages.scam,
            followup: data.summary.followups_pending
          };
          renderAll();
          showToast(`Loaded ${data.items.length} emails from API!`, 'success');
        } else {
          processEmailList(EMBEDDED_SAMPLE_DATA);
          showToast(`Loaded 20 demo emails into tracker!`, 'success');
        }
      })
      .catch(() => {
        processEmailList(EMBEDDED_SAMPLE_DATA);
        showToast(`Loaded 20 demo emails into tracker!`, 'success');
      });
  });

  // 2. Filter Pills
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderTable();
    });
  });

  // 3. Search Box
  document.getElementById('search-input').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderTable();
  });

  // 4. File Upload (JSON or .mbox)
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
          showToast(`Uploaded & classified ${parsed.length} emails from JSON!`, 'success');
        } catch (err) {
          alert("Invalid JSON file format: " + err.message);
        }
      } else if (file.name.endsWith('.mbox')) {
        // Parse simple mbox client side
        const messages = [];
        const rawSplits = content.split(/\nFrom /);
        rawSplits.forEach((block, idx) => {
          if (!block.trim()) return;
          const lines = block.split('\n');
          let from = '';
          let subject = '';
          let bodyLines = [];
          let inHeaders = true;

          for (const line of lines) {
            if (inHeaders) {
              if (line.toLowerCase().startsWith('from:')) from = line.substring(5).trim();
              else if (line.toLowerCase().startsWith('subject:')) subject = line.substring(8).trim();
              else if (line.trim() === '') inHeaders = false;
            } else {
              bodyLines.push(line);
            }
          }
          messages.push({
            id: idx + 1,
            date: '2026-10-24',
            from: from || 'recruiter@unknown.com',
            subject: subject || 'No Subject',
            body: bodyLines.join('\n').trim()
          });
        });
        processEmailList(messages);
        showToast(`Parsed & classified ${messages.length} emails from MBOX!`, 'success');
      }
    };
    reader.readAsText(file);
  });

  // 5. Export Tracker
  document.getElementById('btn-export-json').addEventListener('click', () => {
    if (state.items.length === 0) {
      showToast("No emails to export. Load sample data first!");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.items, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `job_hunt_tracker_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchorElem.click();
    showToast("✓ Tracker exported to JSON file!", "success");
  });

  // 6. Modal close handlers
  document.getElementById('btn-close-modal').addEventListener('click', () => {
    document.getElementById('email-modal').style.display = 'none';
  });
  document.getElementById('btn-modal-close-footer').addEventListener('click', () => {
    document.getElementById('email-modal').style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('email-modal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Automatically load the demo sample on first visit
  processEmailList(EMBEDDED_SAMPLE_DATA);
});
