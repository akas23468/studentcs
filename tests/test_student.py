import unittest

from student import Student


def make(roll=1, py=90, sql=80, maths=70, name="Test"):
    return Student(roll, name, {"python": py, "sql": sql, "maths": maths})


class TestStudent(unittest.TestCase):
    def test_total_and_percentage(self):
        s = make(py=90, sql=80, maths=70)
        self.assertEqual(s.total(), 240)
        self.assertEqual(s.percentage(), 80.0)

    def test_percentage_rounds_to_two_places(self):
        self.assertEqual(make(py=91, sql=82, maths=73).percentage(), 82.0)
        self.assertEqual(make(py=50, sql=50, maths=51).percentage(), 50.33)

    def test_grades(self):
        self.assertEqual(make(py=95, sql=95, maths=95).grade(), "A+")
        self.assertEqual(make(py=80, sql=80, maths=80).grade(), "A")
        self.assertEqual(make(py=70, sql=70, maths=70).grade(), "B")
        self.assertEqual(make(py=60, sql=60, maths=60).grade(), "C")
        self.assertEqual(make(py=50, sql=50, maths=50).grade(), "D")
        self.assertEqual(make(py=40, sql=40, maths=40).grade(), "E")
        self.assertEqual(make(py=10, sql=10, maths=10).grade(), "F")

    def test_pass_fail(self):
        self.assertEqual(make(py=40, sql=40, maths=40).status(), "Pass")
        self.assertEqual(make(py=30, sql=30, maths=30).status(), "Fail")

    def test_failing_one_subject_fails_overall(self):
        s = make(py=100, sql=100, maths=20)       # 73% but maths < 35
        self.assertFalse(s.is_passed())
        self.assertEqual(s.grade(), "F")

    def test_invalid_marks_rejected(self):
        for bad in (-1, 101, "abc", "", None, "nan"):
            with self.assertRaises(ValueError, msg=repr(bad)):
                make(py=bad)

    def test_boundary_marks_accepted(self):
        self.assertEqual(make(py=0, sql=100, maths=0).total(), 100)

    def test_invalid_roll_and_name(self):
        with self.assertRaises(ValueError):
            make(roll="x")
        with self.assertRaises(ValueError):
            make(roll=0)
        with self.assertRaises(ValueError):
            make(name="   ")

    def test_to_dict_matches_csv_columns(self):
        self.assertEqual(list(make().to_dict()), ["roll_no", "name", "python", "sql", "maths"])

    def test_from_dict_with_string_values(self):
        s = Student.from_dict({"roll_no": "7", "name": " Ann ", "python": "90", "sql": "80", "maths": "70"})
        self.assertEqual((s.roll_no, s.name, s.total()), (7, "Ann", 240))


if __name__ == "__main__":
    unittest.main()
