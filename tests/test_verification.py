"""
End-to-End Verification Test Suite for Job Hunt Autopilot.
Directly tests the remaining verification items requested in the architectural review:
- Gap A: Out-of-order email arrival and state monotonicity.
- Gap B: Scam evidence grounding & verification that free-mail alone is not fraud.
- Gap C: Deterministic follow-up calculation with injectable clock & stage gating.
- Gap D: Re-import idempotency (no duplicates) & incremental application updates.
- Complete 20-email source accounting.
"""

import unittest
from datetime import date
from python_engine.ingestion import load_inbox
from python_engine.classifier import classify_email, process_inbox
from python_engine.application_tracker import group_emails_into_applications


class TestVerificationSuite(unittest.TestCase):
    def setUp(self):
        self.ref_date = date(2026, 10, 24)
        self.emails = load_inbox("data/sample_inbox.json")

    def test_20_email_complete_accounting(self):
        """Verify that every single one of the 20 incoming emails is accounted for."""
        result = process_inbox(self.emails, self.ref_date)
        app_tracker = result["application_tracker"]

        apps = app_tracker["applications"]
        scams = app_tracker["scam_quarantine"]

        total_app_emails = sum(len(a["emails"]) for a in apps)
        total_scam_emails = len(scams)

        self.assertEqual(len(self.emails), 20)
        self.assertEqual(total_app_emails + total_scam_emails, 20)
        self.assertEqual(len(apps), 13)
        self.assertEqual(len(scams), 4)

    def test_reimport_idempotency_and_no_duplicates(self):
        """Gap D: Re-importing the same inbox must not duplicate applications or emails."""
        result_first = process_inbox(self.emails, self.ref_date)
        
        # Double the email feed (simulate re-importing the exact same emails)
        doubled_feed = self.emails + self.emails
        self.assertEqual(len(doubled_feed), 40)

        result_doubled = process_inbox(doubled_feed, self.ref_date)
        app_tracker = result_doubled["application_tracker"]

        # Number of unique applications must remain exactly 13
        self.assertEqual(len(app_tracker["applications"]), 13)
        self.assertEqual(app_tracker["total_scams_blocked"], 4)

        # Check an application with 2 emails (e.g. Razorpay) still has exactly 2 emails, not 4
        razorpay = next(a for a in app_tracker["applications"] if a["company"] == "Razorpay")
        self.assertEqual(len(razorpay["emails"]), 2)

    def test_incremental_update_advances_stage_and_resets_followup(self):
        """Gap D: Adding a new email to an existing application updates stage and resets reminder."""
        result_initial = process_inbox(self.emails, self.ref_date)
        zentech_initial = next(a for a in result_initial["application_tracker"]["applications"] if a["company"] == "Zentech")

        # Initially, Zentech applied on Oct 10 -> 14 days silent, follow-up is overdue
        self.assertEqual(zentech_initial["current_stage"], "applied")
        self.assertEqual(zentech_initial["days_silent"], 14)
        self.assertTrue(zentech_initial["needs_followup"])

        # Simulate incremental update: Zentech sends an interview invite on Oct 23
        new_email = {
            "id": 21,
            "date": "2026-10-23",
            "from": "careers@zentech.in",
            "subject": "Interview invite: Technical screening for Backend Engineer",
            "body": "Hi Rahul, we would like to invite you for a 45-minute technical discussion."
        }
        updated_feed = self.emails + [new_email]

        result_updated = process_inbox(updated_feed, self.ref_date)
        zentech_updated = next(a for a in result_updated["application_tracker"]["applications"] if a["company"] == "Zentech")

        # Stage should advance to interview
        self.assertEqual(zentech_updated["current_stage"], "interview")
        # Last event date should update to Oct 23
        self.assertEqual(zentech_updated["last_event_date"], "2026-10-23")
        # Days silent resets to (2026-10-24 - 2026-10-23) = 1 day
        self.assertEqual(zentech_updated["days_silent"], 1)
        # Follow-up reminder is now cleared because employer actively responded
        self.assertFalse(zentech_updated["needs_followup"])
        self.assertEqual(len(zentech_updated["emails"]), 2)

    def test_out_of_order_arrival_and_state_monotonicity(self):
        """Gap A: Out-of-order emails do not revert terminal application stages."""
        # Create an out-of-order scenario for an application:
        # 1. Rejection on Oct 17
        email_rejection = {
            "id": 101,
            "date": "2026-10-17",
            "from": "careers@techcorp.io",
            "subject": "Update on your application to TechCorp",
            "body": "Thank you for interviewing. We regret to inform you that we are not moving forward."
        }
        # 2. Older acknowledgment arriving later in batch with date Oct 05
        email_ack = {
            "id": 102,
            "date": "2026-10-05",
            "from": "careers@techcorp.io",
            "subject": "Application received: TechCorp",
            "body": "We received your application."
        }

        # Process in reverse order (Ack after Rejection)
        feed = [email_rejection, email_ack]
        classified = [classify_email(e, self.ref_date) for e in feed]
        grouped = group_emails_into_applications(classified, self.ref_date)

        app = grouped["applications"][0]
        # Must preserve terminal rejected stage
        self.assertEqual(app["current_stage"], "rejected")
        # Must sort timeline chronologically (Oct 05 before Oct 17)
        self.assertEqual(app["emails"][0]["id"], 102)
        self.assertEqual(app["emails"][1]["id"], 101)
        # Rejected applications must never trigger follow-ups
        self.assertFalse(app["needs_followup"])

    def test_scam_evidence_grounding_and_free_mail_alone_not_fraud(self):
        """Gap B: Free webmail alone must NOT be flagged as fraud without advance fee / phishing evidence."""
        # Benign recruiter from Gmail asking to schedule an interview without fee or ID requests
        benign_gmail_email = {
            "id": 201,
            "date": "2026-10-20",
            "from": "recruiter.startup@gmail.com",
            "subject": "Interview invite: Software Engineer discussion",
            "body": "Hi Rahul, saw your profile. Let us connect for a 30 minute chat on Google Meet."
        }
        res = classify_email(benign_gmail_email, self.ref_date)
        self.assertFalse(res["scam_analysis"]["is_scam"])
        self.assertEqual(res["category"], "interview")

        # Fake offer with training fee and corporate impersonation
        fake_email = next(e for e in self.emails if e["id"] == 2)
        fake_res = classify_email(fake_email, self.ref_date)
        self.assertTrue(fake_res["scam_analysis"]["is_scam"])
        self.assertEqual(fake_res["category"], "scam")
        # Verify evidence citations exist
        self.assertGreater(len(fake_res["scam_analysis"]["reasons"]), 0)
        self.assertTrue(any("training fee" in r.lower() or "payment" in r.lower() for r in fake_res["scam_analysis"]["reasons"]))

    def test_deterministic_followup_with_injectable_clock(self):
        """Gap C: Test injectable clock and stage gating (no follow-ups for rejected, offer, or scam)."""
        # Test anchor date 2026-10-24
        res_standard = process_inbox(self.emails, date(2026, 10, 24))
        swiggy = next(a for a in res_standard["application_tracker"]["applications"] if a["company"] == "Swiggy")
        # Swiggy applied Oct 08 -> 16 days silent on Oct 24
        self.assertEqual(swiggy["days_silent"], 16)
        self.assertTrue(swiggy["needs_followup"])

        # Shift injectable clock back to 2026-10-10 (only 2 days after application)
        res_early = process_inbox(self.emails, date(2026, 10, 10))
        swiggy_early = next(a for a in res_early["application_tracker"]["applications"] if a["company"] == "Swiggy")
        self.assertEqual(swiggy_early["days_silent"], 2)
        self.assertFalse(swiggy_early["needs_followup"])

        # Stage gating: Ensure offers and rejections NEVER trigger follow-up reminders
        for app in res_standard["application_tracker"]["applications"]:
            if app["current_stage"] in ["rejected", "offer"]:
                self.assertFalse(app["needs_followup"], f"{app['company']} at stage {app['current_stage']} should not have follow-up")


if __name__ == "__main__":
    unittest.main()
