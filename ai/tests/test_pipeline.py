"""Run from the repo root:  python -m unittest discover -s ai/tests -v"""

import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sarthi_ai.categories import rule_categories  # noqa: E402
from sarthi_ai.clean import clean_row, infer_state, parse_deadline  # noqa: E402
from sarthi_ai.documents import DocumentNormalizer, canonical_type, looks_like_document  # noqa: E402
from sarthi_ai.text import clean_text, extract_url, fix_mojibake  # noqa: E402

AS_OF = date(2026, 11, 13)


def raw_row(**overrides):
    row = {
        "scheme_id": "SCH_9999", "scheme_name": "Test Scheme", "category": "Education & Learning",
        "applicable_states": "Central", "age_min": "", "age_max": "", "gender": "All", "income_max": "",
        "caste_categories": "All", "occupations": "Any", "is_bpl_required": "False",
        "is_disabled_required": "False", "documents_required": "Aadhaar Card", "deadline": "Ongoing",
        "application_link": "https://example.gov.in/apply", "source_url": "https://www.myscheme.gov.in/schemes/test",
        "last_verified_date": "2026-10-17",
    }
    row.update(overrides)
    return row


class TextTests(unittest.TestCase):
    def test_mojibake_repaired(self):
        self.assertEqual(fix_mojibake("Chief Ministerâ€™s"), "Chief Minister’s")
        self.assertEqual(clean_text("Antim Sansâ€​kar"), "Antim Sanskar")

    def test_url_with_glued_text(self):
        self.assertEqual(extract_url("http://sjd.kerala.gov.inwhere")[0], "http://sjd.kerala.gov.in/")
        self.assertEqual(extract_url("www.scsthub.in.for")[0], "https://www.scsthub.in/")
        self.assertEqual(extract_url("https://abocwwb.assam.gov.in/ï»¿Step")[0],
                         "https://abocwwb.assam.gov.in/")

    def test_url_keeps_port_and_path(self):
        self.assertEqual(extract_url("https://ssepd.gov.in:8443/x/y")[0], "https://ssepd.gov.in:8443/x/y")

    def test_url_missing(self):
        self.assertEqual(extract_url(""), (None, ["missing"]))
        self.assertEqual(extract_url("Yuba-Yogayog notification.pdf")[0], None)


class DocumentTests(unittest.TestCase):
    def test_canonical_types(self):
        self.assertEqual(canonical_type("Caste Certificate (SC/ST/OBC/EWS)"), "Caste Certificate")
        self.assertEqual(canonical_type("Recent Passport-Size Photograph."), "Passport-size Photograph")
        self.assertEqual(canonical_type("Land Records (Khasra / Khatoni / RoR)"), "Land Records")

    def test_fragments_dropped(self):
        self.assertFalse(looks_like_document("required."))
        self.assertFalse(looks_like_document("Whom should I contact in Mahe/Yanam for"))
        self.assertTrue(looks_like_document("Copy of valid three-wheeler license"))

    def test_fuzzy_merge(self):
        norm = DocumentNormalizer().fit(["Copy of Election Card; Copy of Election Card", "Copy of Election Card."])
        out = norm.transform("Copy of Election Card.; required")
        self.assertEqual(out["other_documents"], ["Copy of Election Card"])
        self.assertEqual(out["dropped_fragments"], 1)


class CleanTests(unittest.TestCase):
    def test_invalid_age_range_becomes_unknown(self):
        rec = clean_row(raw_row(age_min="5", age_max="1"), AS_OF, 365)
        self.assertIsNone(rec["age_min"])
        self.assertIsNone(rec["age_max"])
        self.assertIn("age_range_invalid", rec["quality_flags"])

    def test_all_and_any_mean_no_restriction(self):
        rec = clean_row(raw_row(), AS_OF, 365)
        self.assertEqual(rec["caste_categories"], [])
        self.assertEqual(rec["occupations"], [])
        self.assertIsNone(rec["gender"])

    def test_construction_worker_board(self):
        rec = clean_row(raw_row(scheme_name="Funeral Assistance (GBOCWWB)", occupations="student"), AS_OF, 365)
        self.assertEqual(rec["occupations"], ["construction_worker"])

    def test_state_inference(self):
        self.assertEqual(infer_state("Disability Pension - West Bengal", []), ("West Bengal", "name"))
        self.assertEqual(infer_state("Some Scheme", ["https://ikhedut.gujarat.gov.in/"]), ("Gujarat", "url"))
        self.assertEqual(infer_state("Stand-Up India", ["https://www.myscheme.gov.in/"]), (None, None))

    def test_deadlines(self):
        flags = []
        self.assertEqual(parse_deadline("2025-03-31", AS_OF, flags)["deadline_type"], "date")
        self.assertIn("deadline_passed", flags)
        self.assertEqual(parse_deadline("within 6 months of the death", AS_OF, [])["deadline_type"], "relative")
        self.assertEqual(parse_deadline("Ongoing", AS_OF, [])["deadline_type"], "ongoing")

    def test_stale(self):
        self.assertTrue(clean_row(raw_row(last_verified_date="2024-03-28"), AS_OF, 365)["is_stale"])
        self.assertFalse(clean_row(raw_row(), AS_OF, 365)["is_stale"])


class CategoryRuleTests(unittest.TestCase):
    def test_rules(self):
        self.assertEqual(rule_categories("Post Matric Scholarship for SC Students")[0], "Education & Learning")
        self.assertEqual(rule_categories("Financial Assistance For Widows")[0], "Women & Child Development")
        self.assertEqual(rule_categories("Old Age Pension")[0], "Senior Citizens")
        self.assertEqual(rule_categories("Drip Irrigation Subsidy")[0], "Agriculture & Farming")
        self.assertEqual(rule_categories("Airavata Scheme"), [])

    def test_no_substring_false_positive(self):
        # "fish" must not match inside "selfish"; "agri" not inside "pilgrim"
        self.assertNotIn("Agriculture & Farming", rule_categories("Selfish Pilgrimage Grant"))


if __name__ == "__main__":
    unittest.main()
