import unittest
import os
import nigeria

class TestNigeriaBanks(unittest.TestCase):
    
    def test_all_banks(self):
        banks = nigeria.all_banks()
        self.assertIsInstance(banks, list)
        self.assertGreater(len(banks), 400, "Should contain over 400 banks")
        
        # Test fields in a sample bank
        sample = banks[0]
        self.assertIn("name", sample)
        self.assertIn("slug", sample)
        self.assertIn("code", sample)
        self.assertIn("ussd", sample)
        self.assertIn("logo_filename", sample)
        self.assertIn("logo_base64", sample)

    def test_get_by_code(self):
        # Test GTBank
        gtb = nigeria.get_by_code("058")
        self.assertIsNotNone(gtb)
        self.assertEqual(gtb["slug"], "guaranty-trust-bank")
        self.assertEqual(gtb["name"], "Guaranty Trust Bank")
        
        # Test Kuda Bank
        kuda = nigeria.get_by_code("50211")
        self.assertIsNotNone(kuda)
        self.assertEqual(kuda["slug"], "kuda-microfinance-bank")
        
        # Test non-existent bank
        none_bank = nigeria.get_by_code("999999")
        self.assertIsNone(none_bank)

    def test_get_by_slug(self):
        # Test Access Bank
        access = nigeria.get_by_slug("access-bank")
        self.assertIsNotNone(access)
        self.assertEqual(access["code"], "044")
        
        # Test OPay (paycom slug)
        opay = nigeria.get_by_slug("paycom")
        self.assertIsNotNone(opay)
        
        # Test case insensitivity and whitespace handling
        access_case = nigeria.get_by_slug("  AcCeSs-BaNk  ")
        self.assertIsNotNone(access_case)
        self.assertEqual(access_case["code"], "044")
        
        # Test non-existent bank
        none_bank = nigeria.get_by_slug("invalid-slug")
        self.assertIsNone(none_bank)

    def test_search(self):
        # Search by name
        wema_search = nigeria.search("wema")
        self.assertGreaterEqual(len(wema_search), 1)
        self.assertTrue(any(b["slug"] == "wema-bank" for b in wema_search))
        
        # Search by code
        code_search = nigeria.search("058")
        self.assertGreaterEqual(len(code_search), 1)
        self.assertTrue(any(b["slug"] == "guaranty-trust-bank" for b in code_search))
        
        # Search for microfinance
        mfb_search = nigeria.search("microfinance")
        self.assertGreater(len(mfb_search), 100, "Should match many microfinance banks")
        
        # Search with no matches
        no_match = nigeria.search("xyzunknownbank")
        self.assertEqual(len(no_match), 0)

    def test_logo_path(self):
        # Valid custom logo
        path = nigeria.get_logo_path("access-bank")
        self.assertIsNotNone(path)
        self.assertTrue(os.path.exists(path))
        self.assertTrue(path.endswith(".png"))
        
        # Non-existent bank should fall back to default SVG
        fallback_path = nigeria.get_logo_path("non-existent-bank")
        self.assertIsNotNone(fallback_path)
        self.assertTrue(os.path.exists(fallback_path))
        self.assertTrue(fallback_path.endswith("default.svg"))

    def test_logo_bytes(self):
        # Valid custom logo bytes
        img_bytes = nigeria.get_logo_bytes("access-bank")
        self.assertGreater(len(img_bytes), 0)
        
        # Fallback bytes
        fallback_bytes = nigeria.get_logo_bytes("non-existent-bank")
        self.assertGreater(len(fallback_bytes), 0)

    def test_logo_base64(self):
        # Custom logo base64
        base64_str = nigeria.get_logo_base64("access-bank")
        self.assertTrue(base64_str.startswith("data:image/png;base64,"))
        
        # Fallback SVG logo base64
        fallback_base64 = nigeria.get_logo_base64("non-existent-bank")
        self.assertTrue(fallback_base64.startswith("data:image/svg+xml;base64,"))

if __name__ == '__main__':
    unittest.main()
