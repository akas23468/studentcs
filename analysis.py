"""analysis.py - topper, averages, ranking and reports.

Works on lists of Student objects. Imports only student.py (no file access).
"""
from student import PASS_MARK_PER_SUBJECT, PASS_PERCENTAGE, SUBJECTS


# ------------------------------------------------- list comprehensions (+ loops)
def passed_students(students):
    return [s for s in students if s.is_passed()]          # comprehension

def passed_students_loop(students):                        # same thing, normal loop
    result = []
    for s in students:
        if s.is_passed():
            result.append(s)
    return result

def failed_students(students):
    return [s for s in students if not s.is_passed()]

def student_names(students):
    return [s.name for s in students]

def students_above(students, min_percentage):
    return [s for s in students if s.percentage() > min_percentage]


# ------------------------------------------------------------------- statistics
def class_toppers(students):
    """All students sharing the highest percentage ([] if the class is empty)."""
    if not students:
        return []
    best = max(s.percentage() for s in students)
    return [s for s in students if s.percentage() == best]

def class_average(students):
    if not students:
        return 0.0
    return round(sum(s.percentage() for s in students) / len(students), 2)

def subject_stats(students):
    """{subject: {highest, highest_by, lowest, lowest_by, average}}"""
    if not students:
        return {}
    stats = {}
    for subject in SUBJECTS:
        marks = [s.marks[subject] for s in students]
        hi, lo = max(marks), min(marks)
        stats[subject] = {
            "highest": hi, "highest_by": [s.name for s in students if s.marks[subject] == hi],
            "lowest": lo, "lowest_by": [s.name for s in students if s.marks[subject] == lo],
            "average": round(sum(marks) / len(marks), 2),
        }
    return stats

def rank_students(students):
    """[(rank, student)] best first. Equal percentages share a rank (1,1,3...)."""
    ordered = sorted(students, key=lambda s: (-s.percentage(), s.name.lower()))
    ranked = []
    for position, s in enumerate(ordered, start=1):
        if ranked and s.percentage() == ranked[-1][1].percentage():
            rank = ranked[-1][0]
        else:
            rank = position
        ranked.append((rank, s))
    return ranked

def grade_distribution(students):
    counts = {}
    for s in students:
        counts[s.grade()] = counts.get(s.grade(), 0) + 1
    return counts


# ----------------------------------------------------------------------- report
def generate_report(students):
    if not students:
        return "No student records available. Add students to generate a report."
    passed, failed = passed_students(students), failed_students(students)
    lines = [
        "=" * 50, "  STUDENT PERFORMANCE REPORT", "=" * 50,
        f"Total students   : {len(students)}",
        f"Passed           : {len(passed)}",
        f"Failed           : {len(failed)}",
        f"Pass rate        : {len(passed) / len(students) * 100:.1f}%",
        f"Class average    : {class_average(students)}%",
        f"Passing rule     : >= {PASS_PERCENTAGE}% overall and >= {PASS_MARK_PER_SUBJECT} in every subject",
        "",
        "Topper(s)        : " + ", ".join(
            f"{s.name} ({s.percentage()}%)" for s in class_toppers(students)),
        "", "Subject-wise marks", "-" * 50,
    ]
    for subject, st in subject_stats(students).items():
        lines.append(f"{subject.title():<8} high {st['highest']:>5} ({', '.join(st['highest_by'][:2])})"
                     f" | low {st['lowest']:>5} | avg {st['average']}")
    lines += ["", "Grade distribution", "-" * 50]
    dist = grade_distribution(students)
    lines += [f"{g:<3}: {dist[g]}" for g in sorted(dist)]
    lines += ["", "Top 5 ranks", "-" * 50]
    lines += [f"{r}. {s.name} - {s.percentage()}% ({s.grade()})"
              for r, s in rank_students(students)[:5]]
    return "\n".join(lines)
