"""student.py - the Student class and the grading rules.

This module imports NOTHING from our other modules, so it can never cause a
circular import. Every other module imports from here.
"""

# ---------------------------------------------------------------- configuration
# Change these values to change the rules - no other code needs editing.
SUBJECTS = ["python", "sql", "maths"]   # must match the CSV column names
MAX_MARKS = 100                         # each subject is out of 100
PASS_MARK_PER_SUBJECT = 35              # must score at least this in EVERY subject
PASS_PERCENTAGE = 40                    # and at least this overall percentage
GRADE_RULES = [                         # (minimum percentage, grade), highest first
    (90, "A+"),
    (80, "A"),
    (70, "B"),
    (60, "C"),
    (50, "D"),
    (40, "E"),
]
FAIL_GRADE = "F"                        # anyone who does not pass gets this grade


# ------------------------------------------------------------------ validation
def parse_roll_no(value):
    """Turn input into a positive integer roll number or raise ValueError."""
    try:
        roll_no = int(str(value).strip())
    except ValueError:
        raise ValueError(f"Roll number must be a whole number, got {value!r}.") from None
    if roll_no <= 0:
        raise ValueError("Roll number must be greater than 0.")
    return roll_no


def parse_marks(value, label="Marks"):
    """Turn input into a number between 0 and MAX_MARKS or raise ValueError."""
    try:
        marks = float(str(value).strip())
    except ValueError:
        raise ValueError(f"{label} must be a number, got {value!r}.") from None
    if not 0 <= marks <= MAX_MARKS:      # also rejects NaN
        raise ValueError(f"{label} must be between 0 and {MAX_MARKS}, got {value}.")
    return int(marks) if marks == int(marks) else marks


# ----------------------------------------------------------------------- class
class Student:
    """One student: roll number, name and marks in each subject."""

    def __init__(self, roll_no, name, marks):
        self.roll_no = parse_roll_no(roll_no)
        self.name = str(name).strip()
        if not self.name:
            raise ValueError("Name cannot be empty.")
        # marks is a dict like {"python": 90, "sql": 80, "maths": 70}
        self.marks = {s: parse_marks(marks.get(s), s) for s in SUBJECTS}

    # -- calculations
    def total(self):
        return sum(self.marks.values())

    def percentage(self):
        return round(self.total() / (MAX_MARKS * len(SUBJECTS)) * 100, 2)

    def is_passed(self):
        return (self.percentage() >= PASS_PERCENTAGE
                and all(m >= PASS_MARK_PER_SUBJECT for m in self.marks.values()))

    def status(self):
        return "Pass" if self.is_passed() else "Fail"

    def grade(self):
        if not self.is_passed():
            return FAIL_GRADE
        pct = self.percentage()
        for minimum, letter in GRADE_RULES:
            if pct >= minimum:
                return letter
        return FAIL_GRADE

    # -- conversion
    def to_dict(self):
        """Flat dict exactly matching the CSV columns."""
        return {"roll_no": self.roll_no, "name": self.name, **self.marks}

    def to_result_dict(self):
        """CSV data plus calculated values (used by the web API)."""
        return {**self.to_dict(), "total": self.total(),
                "percentage": self.percentage(), "grade": self.grade(),
                "status": self.status()}

    @classmethod
    def from_dict(cls, row):
        """Build a Student from a CSV row (a dict). Raises ValueError if bad."""
        return cls(row.get("roll_no"), row.get("name"), row)

    def __repr__(self):
        return f"Student({self.roll_no}, {self.name!r}, {self.marks})"
