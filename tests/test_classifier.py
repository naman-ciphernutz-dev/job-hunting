"""
Unit tests for Job Hunt Autopilot classifier, scam detector, and follow-up engine.
"""

import unittest
from datetime import date
from python_engine.ingestion import load_inbox
from python_engine.classifier import classify_email, process_inbox


class TestJobHuntAutopilot(unittest.TestCase):
    def setUp(self):
        self.ref_date = date(2026, 10, 24)
        self.emails = load_inbox("data/sample_inbox.json")

    def test_inbox_loading(self):
        """Verify sample dataset contains 20 emails."""
        self.assertEqual(len(self.emails), 20)
        mbox_emails = load_inbox("data/sample_inbox.mbox")
        self.assertEqual(len(mbox_emails), 20)

    def test_scam_detection(self):
        """Test fake offers are correctly flagged as scam with detailed reasons."""
        # Email #2: Infosys HR on Gmail asking for Rs 4,999 training fee
        email_2 = next(e for e in self.emails if e["id"] == 2)
        res_2 = classify_email(email_2, self.ref_date)
        self.assertEqual(res_2["category"], "scam")
        self.assertTrue(res_2["scam_analysis"]["is_scam"])
        self.assertTrue(any("Fee" in r for r in res_2["scam_analysis"]["reasons"]))
        self.assertTrue(any("Impersonation" in r for r in res_2["scam_analysis"]["reasons"]))

        # Email #6: Wipro on Yahoo mail asking for laptop courier charges
        email_6 = next(e for e in self.emails if e["id"] == 6)
        res_6 = classify_email(email_6, self.ref_date)
        self.assertEqual(res_6["category"], "scam")
        self.assertTrue(res_6["scam_analysis"]["is_scam"])

        # Email #15: Hinglish direct selection scam with UPI fee
        email_15 = next(e for e in self.emails if e["id"] == 15)
        res_15 = classify_email(email_15, self.ref_date)
        self.assertEqual(res_15["category"], "scam")
        self.assertTrue(res_15["scam_analysis"]["is_scam"])

    def test_genuine_offers_not_flagged(self):
        """Ensure authentic offers from legitimate corporate domains are NOT classified as scams."""
        email_12 = next(e for e in self.emails if e["id"] == 12)  # Hasura
        res_12 = classify_email(email_12, self.ref_date)
        self.assertEqual(res_12["category"], "offer")
        self.assertFalse(res_12["scam_analysis"]["is_scam"])

        email_18 = next(e for e in self.emails if e["id"] == 18)  # CRED
        res_18 = classify_email(email_18, self.ref_date)
        self.assertEqual(res_18["category"], "offer")
        self.assertFalse(res_18["scam_analysis"]["is_scam"])

    def test_interview_classification(self):
        """Ensure technical interview invites and code pair rounds are classified as interview."""
        email_3 = next(e for e in self.emails if e["id"] == 3)  # Finly Round 1
        res_3 = classify_email(email_3, self.ref_date)
        self.assertEqual(res_3["category"], "interview")

        email_8 = next(e for e in self.emails if e["id"] == 8)  # Razorpay Round 2
        res_8 = classify_email(email_8, self.ref_date)
        self.assertEqual(res_8["category"], "interview")

        email_20 = next(e for e in self.emails if e["id"] == 20)  # Urban Company pair programming
        res_20 = classify_email(email_20, self.ref_date)
        self.assertEqual(res_20["category"], "interview")

    def test_rejections_classification(self):
        """Ensure polite rejections are accurately labeled as rejected."""
        email_4 = next(e for e in self.emails if e["id"] == 4)  # Stripe
        res_4 = classify_email(email_4, self.ref_date)
        self.assertEqual(res_4["category"], "rejected")

        email_9 = next(e for e in self.emails if e["id"] == 9)  # Atlassian
        res_9 = classify_email(email_9, self.ref_date)
        self.assertEqual(res_9["category"], "rejected")

    def test_followup_reminder_7_days(self):
        """Ensure applications >= 7 days old trigger follow-up reminders with drafts."""
        # Email #1: Applied 2026-10-10 -> 14 days silent relative to 2026-10-24
        email_1 = next(e for e in self.emails if e["id"] == 1)
        res_1 = classify_email(email_1, self.ref_date)
        self.assertEqual(res_1["category"], "applied")
        self.assertTrue(res_1["followup"]["needs_followup"])
        self.assertEqual(res_1["followup"]["days_silent"], 14)
        self.assertIsNotNone(res_1["followup"]["followup_draft"])
        self.assertIn("14 days ago", res_1["followup"]["followup_draft"])

        # Email #11: Applied 2026-10-22 -> 2 days silent (Recent, no follow-up needed yet)
        email_11 = next(e for e in self.emails if e["id"] == 11)
        res_11 = classify_email(email_11, self.ref_date)
        self.assertFalse(res_11["followup"]["needs_followup"])

    def test_full_pipeline_process_inbox(self):
        """Verify batch processor summary stats and structure."""
        result = process_inbox(self.emails, self.ref_date)
        summary = result["summary"]
        self.assertEqual(summary["total_emails"], 20)
        self.assertGreater(summary["scams_detected"], 0)
        self.assertGreater(summary["followups_pending"], 0)
        self.assertIn("applied", summary["stages"])
        self.assertIn("interview", summary["stages"])
        self.assertIn("rejected", summary["stages"])
        self.assertIn("offer", summary["stages"])
        self.assertIn("scam", summary["stages"])


if __name__ == "__main__":
    unittest.main()
