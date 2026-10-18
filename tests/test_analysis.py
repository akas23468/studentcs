import unittest

import analysis
from student import Student


def make(roll, name, py, sql, maths):
    return Student(roll, name, {"python": py, "sql": sql, "maths": maths})


class TestAnalysis(unittest.TestCase):
    def setUp(self):
        self.a = make(1, "Asha", 90, 90, 90)     # 90.0 pass
        self.b = make(2, "Bala", 60, 60, 60)     # 60.0 pass
        self.c = make(3, "Chitra", 20, 30, 40)   # 30.0 fail
        self.students = [self.b, self.c, self.a]

    def test_empty_list(self):
        self.assertEqual(analysis.class_toppers([]), [])
        self.assertEqual(analysis.class_average([]), 0.0)
        self.assertEqual(analysis.subject_stats([]), {})
        self.assertEqual(analysis.rank_students([]), [])
        self.assertIn("No student records", analysis.generate_report([]))

    def test_class_average(self):
        self.assertEqual(analysis.class_average(self.students), 60.0)

    def test_topper_and_ties(self):
        self.assertEqual(analysis.class_toppers(self.students), [self.a])
        twin = make(4, "Dev", 90, 90, 90)
        self.assertEqual(len(analysis.class_toppers(self.students + [twin])), 2)

    def test_passed_failed_lists(self):
        self.assertEqual(analysis.passed_students(self.students), [self.b, self.a])
        self.assertEqual(analysis.failed_students(self.students), [self.c])

    def test_comprehension_matches_loop(self):
        self.assertEqual(analysis.passed_students(self.students),
                         analysis.passed_students_loop(self.students))

    def test_names_and_above(self):
        self.assertEqual(analysis.student_names(self.students), ["Bala", "Chitra", "Asha"])
        self.assertEqual(analysis.students_above(self.students, 60), [self.a])

    def test_ranking_order(self):
        ranks = [(r, s.name) for r, s in analysis.rank_students(self.students)]
        self.assertEqual(ranks, [(1, "Asha"), (2, "Bala"), (3, "Chitra")])

    def test_ranking_ties_share_rank(self):
        twin = make(4, "Dev", 90, 90, 90)
        ranks = [r for r, _ in analysis.rank_students(self.students + [twin])]
        self.assertEqual(ranks, [1, 1, 3, 4])

    def test_subject_stats(self):
        py = analysis.subject_stats(self.students)["python"]
        self.assertEqual((py["highest"], py["lowest"]), (90, 20))
        self.assertEqual(py["highest_by"], ["Asha"])
        self.assertEqual(py["average"], 56.67)

    def test_report_mentions_key_numbers(self):
        report = analysis.generate_report(self.students)
        self.assertIn("Total students   : 3", report)
        self.assertIn("Asha", report)


if __name__ == "__main__":
    unittest.main()
