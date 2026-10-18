import os
import tempfile
import unittest

import file_handler as fh

try:
    from api import create_app
except ImportError:           # Flask not installed - skip API tests
    create_app = None


@unittest.skipIf(create_app is None, "Flask is not installed")
class TestApi(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.client = create_app(os.path.join(self.tmp.name, "s.csv")).test_client()

    def tearDown(self):
        self.tmp.cleanup()

    def body(self, roll=1, py=80):
        return {"roll_no": roll, "name": "Asha", "python": py, "sql": 70, "maths": 60}

    def test_crud_flow(self):
        self.assertEqual(self.client.post("/api/students", json=self.body()).status_code, 201)
        self.assertEqual(self.client.post("/api/students", json=self.body()).status_code, 409)
        self.assertEqual(self.client.post("/api/students", json=self.body(2, 500)).status_code, 400)
        self.assertEqual(self.client.put("/api/students/1", json={"python": 95}).get_json()["python"], 95)
        self.assertEqual(self.client.get("/api/students/9").status_code, 404)
        self.assertEqual(len(self.client.get("/api/students").get_json()["students"]), 1)
        self.assertEqual(self.client.delete("/api/students/1").status_code, 200)

    def test_analysis_on_empty_file(self):
        data = self.client.get("/api/analysis").get_json()
        self.assertEqual((data["total"], data["toppers"], data["ranking"]), (0, [], []))


if __name__ == "__main__":
    unittest.main()
