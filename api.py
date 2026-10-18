"""api.py - small Flask web API so the React frontend can use the same logic.

Run with:  python api.py     (serves http://localhost:5000)
It reuses student.py, file_handler.py and analysis.py - no logic is duplicated.
"""
import os

from flask import Flask, jsonify, request

import analysis
import file_handler as fh
from student import GRADE_RULES, PASS_MARK_PER_SUBJECT, PASS_PERCENTAGE, SUBJECTS, Student


def create_app(csv_path=fh.DEFAULT_CSV):
    app = Flask(__name__)
    fh.ensure_csv_exists(csv_path)

    def result(s):
        return s.to_result_dict()

    @app.errorhandler(ValueError)
    def bad_input(err):
        return jsonify(error=str(err)), 400

    @app.errorhandler(fh.StudentNotFoundError)
    def not_found(err):
        return jsonify(error=str(err)), 404

    @app.errorhandler(fh.DuplicateRollError)
    def duplicate(err):
        return jsonify(error=str(err)), 409

    @app.errorhandler(fh.CSVFormatError)
    @app.errorhandler(OSError)
    def file_problem(err):
        return jsonify(error=str(err)), 500

    @app.get("/api/config")
    def config():
        return jsonify(subjects=SUBJECTS, pass_percentage=PASS_PERCENTAGE,
                       pass_mark_per_subject=PASS_MARK_PER_SUBJECT,
                       grade_rules=GRADE_RULES)

    @app.get("/api/students")
    def list_students():
        students, warnings = fh.load_students(csv_path)
        return jsonify(students=[result(s) for s in students], warnings=warnings)

    @app.post("/api/students")
    def create_student():
        data = request.get_json(silent=True) or {}
        student = Student.from_dict(data)
        fh.add_student(student, csv_path)
        return jsonify(result(student)), 201

    @app.get("/api/students/<int:roll_no>")
    def get_student(roll_no):
        return jsonify(result(fh.find_student(roll_no, csv_path)))

    @app.put("/api/students/<int:roll_no>")
    def change_student(roll_no):
        data = request.get_json(silent=True) or {}
        marks = {s: data[s] for s in SUBJECTS if s in data}
        return jsonify(result(fh.update_student(roll_no, data.get("name"), marks, csv_path)))

    @app.delete("/api/students/<int:roll_no>")
    def remove_student(roll_no):
        fh.delete_student(roll_no, csv_path)
        return jsonify(deleted=roll_no)

    @app.get("/api/analysis")
    def analyse():
        students, _ = fh.load_students(csv_path)
        return jsonify(
            total=len(students),
            class_average=analysis.class_average(students),
            toppers=[result(s) for s in analysis.class_toppers(students)],
            subject_stats=analysis.subject_stats(students),
            passed=[result(s) for s in analysis.passed_students(students)],
            failed=[result(s) for s in analysis.failed_students(students)],
            ranking=[{"rank": r, **result(s)} for r, s in analysis.rank_students(students)],
            grades=analysis.grade_distribution(students),
            report=analysis.generate_report(students),
        )

    return app


if __name__ == "__main__":
    create_app().run(port=int(os.environ.get("PORT", 5000)), debug=True)
