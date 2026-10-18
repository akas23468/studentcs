"""file_handler.py - everything that touches the CSV file.

Imports only student.py. Returns Student objects to the caller.
"""
import csv
import os
import shutil

from student import SUBJECTS, Student, parse_roll_no

DEFAULT_CSV = os.path.join(os.path.dirname(os.path.abspath(__file__)), "students.csv")
FIELDNAMES = ["roll_no", "name"] + SUBJECTS


class DuplicateRollError(Exception):
    """Raised when a roll number already exists."""


class StudentNotFoundError(Exception):
    """Raised when a roll number does not exist."""


class CSVFormatError(Exception):
    """Raised when the CSV file has missing/wrong headers."""


def ensure_csv_exists(path=DEFAULT_CSV):
    """Create the file with headers if it is missing or completely empty."""
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        with open(path, "w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=FIELDNAMES).writeheader()


def load_students(path=DEFAULT_CSV):
    """Read the CSV. Returns (students, warnings).

    Bad rows are skipped and reported in `warnings` - never silently.
    """
    ensure_csv_exists(path)
    students, warnings = [], []
    seen = set()
    try:
        with open(path, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            missing = [c for c in FIELDNAMES if c not in (reader.fieldnames or [])]
            if missing:
                raise CSVFormatError(
                    f"CSV is missing column(s): {', '.join(missing)}. "
                    f"Expected header: {','.join(FIELDNAMES)}")
            for row in reader:
                try:
                    student = Student.from_dict(row)
                    if student.roll_no in seen:
                        raise ValueError(f"duplicate roll number {student.roll_no}")
                except ValueError as err:
                    warnings.append(f"Line {reader.line_num}: skipped ({err})")
                else:
                    seen.add(student.roll_no)
                    students.append(student)
    except OSError as err:
        raise OSError(f"Could not read '{path}': {err}") from err
    return students, warnings


def save_students(students, path=DEFAULT_CSV):
    """Rewrite the whole file safely: backup -> temp file -> atomic replace."""
    tmp_path = path + ".tmp"
    try:
        if os.path.exists(path):
            shutil.copyfile(path, path + ".bak")        # never lose data
        with open(tmp_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()
            writer.writerows(s.to_dict() for s in students)
        os.replace(tmp_path, path)
    except OSError as err:
        raise OSError(f"Could not write '{path}': {err}") from err
    finally:
        if os.path.exists(tmp_path):                     # clean up after a failure
            os.remove(tmp_path)


def find_student(roll_no, path=DEFAULT_CSV):
    roll_no = parse_roll_no(roll_no)
    students, _ = load_students(path)
    for s in students:
        if s.roll_no == roll_no:
            return s
    raise StudentNotFoundError(f"No student with roll number {roll_no}.")


def add_student(student, path=DEFAULT_CSV):
    """Append one student. Existing rows are never touched."""
    students, _ = load_students(path)
    if any(s.roll_no == student.roll_no for s in students):
        raise DuplicateRollError(f"Roll number {student.roll_no} already exists.")
    try:
        with open(path, "rb+") as f:                     # make sure last line ends in \n
            f.seek(0, os.SEEK_END)
            if f.tell() > 0:
                f.seek(-1, os.SEEK_END)
                needs_newline = f.read(1) not in (b"\n", b"\r")
            else:
                needs_newline = False
        with open(path, "a", newline="", encoding="utf-8") as f:
            if needs_newline:
                f.write("\n")
            csv.DictWriter(f, fieldnames=FIELDNAMES).writerow(student.to_dict())
    except OSError as err:
        raise OSError(f"Could not write '{path}': {err}") from err


def update_student(roll_no, name=None, marks=None, path=DEFAULT_CSV):
    """Change a student's name and/or marks. Returns the updated Student."""
    roll_no = parse_roll_no(roll_no)
    students, _ = load_students(path)
    for i, old in enumerate(students):
        if old.roll_no == roll_no:
            new_marks = {**old.marks, **(marks or {})}
            students[i] = Student(roll_no, name if name else old.name, new_marks)
            save_students(students, path)
            return students[i]
    raise StudentNotFoundError(f"No student with roll number {roll_no}.")


def delete_student(roll_no, path=DEFAULT_CSV):
    """Remove one student. A .bak copy of the old file is kept."""
    roll_no = parse_roll_no(roll_no)
    students, _ = load_students(path)
    remaining = [s for s in students if s.roll_no != roll_no]
    if len(remaining) == len(students):
        raise StudentNotFoundError(f"No student with roll number {roll_no}.")
    save_students(remaining, path)
