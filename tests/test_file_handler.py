import csv
import os
import tempfile
import unittest

import file_handler as fh
from student import Student


def make(roll, name="Test", py=80, sql=70, maths=60):
    return Student(roll, name, {"python": py, "sql": sql, "maths": maths})


class TestFileHandler(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = os.path.join(self.tmp.name, "students.csv")

    def tearDown(self):
        self.tmp.cleanup()

    def test_missing_file_is_created_with_headers(self):
        self.assertFalse(os.path.exists(self.path))
        students, warnings = fh.load_students(self.path)
        self.assertEqual((students, warnings), ([], []))
        with open(self.path, newline="") as f:
            self.assertEqual(next(csv.reader(f)), fh.FIELDNAMES)

    def test_empty_file_is_handled(self):
        open(self.path, "w").close()
        self.assertEqual(fh.load_students(self.path)[0], [])

    def test_add_and_find(self):
        fh.add_student(make(1, "Asha"), self.path)
        fh.add_student(make(2, "Bala"), self.path)
        self.assertEqual(fh.find_student(2, self.path).name, "Bala")
        self.assertEqual(len(fh.load_students(self.path)[0]), 2)

    def test_add_preserves_file_without_trailing_newline(self):
        with open(self.path, "w", newline="") as f:
            f.write("roll_no,name,python,sql,maths\n1,Asha,90,80,70")   # no final \n
        fh.add_student(make(2, "Bala"), self.path)
        self.assertEqual([s.roll_no for s in fh.load_students(self.path)[0]], [1, 2])

    def test_duplicate_roll_rejected(self):
        fh.add_student(make(1), self.path)
        with self.assertRaises(fh.DuplicateRollError):
            fh.add_student(make(1, "Other"), self.path)
        self.assertEqual(len(fh.load_students(self.path)[0]), 1)

    def test_search_missing_student(self):
        with self.assertRaises(fh.StudentNotFoundError):
            fh.find_student(99, self.path)

    def test_update_changes_name_and_marks(self):
        fh.add_student(make(1, "Asha", py=50), self.path)
        updated = fh.update_student(1, name="Asha K", marks={"python": 95}, path=self.path)
        self.assertEqual(updated.marks["python"], 95)
        self.assertEqual(fh.find_student(1, self.path).name, "Asha K")
        self.assertEqual(fh.find_student(1, self.path).marks["sql"], 70)   # unchanged

    def test_update_invalid_marks_leaves_file_untouched(self):
        fh.add_student(make(1, py=50), self.path)
        with self.assertRaises(ValueError):
            fh.update_student(1, marks={"python": 500}, path=self.path)
        self.assertEqual(fh.find_student(1, self.path).marks["python"], 50)

    def test_update_missing_student(self):
        with self.assertRaises(fh.StudentNotFoundError):
            fh.update_student(5, name="X", path=self.path)

    def test_delete_and_backup(self):
        fh.add_student(make(1), self.path)
        fh.add_student(make(2), self.path)
        fh.delete_student(1, self.path)
        self.assertEqual([s.roll_no for s in fh.load_students(self.path)[0]], [2])
        self.assertTrue(os.path.exists(self.path + ".bak"))
        with self.assertRaises(fh.StudentNotFoundError):
            fh.delete_student(1, self.path)

    def test_malformed_rows_are_skipped_with_warnings(self):
        with open(self.path, "w", newline="") as f:
            f.write("roll_no,name,python,sql,maths\n"
                    "1,Good,90,80,70\n"
                    "2,BadMarks,abc,80,70\n"
                    "3,TooHigh,101,80,70\n"
                    "x,BadRoll,50,50,50\n"
                    "1,Duplicate,50,50,50\n"
                    "4,Short\n")
        students, warnings = fh.load_students(self.path)
        self.assertEqual([s.roll_no for s in students], [1])
        self.assertEqual(len(warnings), 5)

    def test_wrong_headers_raise_and_file_not_modified(self):
        with open(self.path, "w") as f:
            f.write("id,fullname\n1,Asha\n")
        with self.assertRaises(fh.CSVFormatError):
            fh.load_students(self.path)
        with open(self.path) as f:
            self.assertEqual(f.read(), "id,fullname\n1,Asha\n")


if __name__ == "__main__":
    unittest.main()
