"""main.py - terminal menu. Run with:  python main.py

Flow: show menu -> read choice -> call a handler -> handler uses
file_handler (read/write CSV) and analysis (calculations) -> print -> repeat.
"""
import analysis
import file_handler as fh
from student import MAX_MARKS, SUBJECTS, Student, parse_marks, parse_roll_no

MENU = """
========================================
    STUDENT PERFORMANCE ANALYZER
========================================

1. Add Student
2. View All Students
3. Search Student
4. Update Student
5. Delete Student
6. View Individual Result
7. Display Class Topper
8. View Class Statistics
9. List Passed Students
10. List Failed Students
11. Rank Students
12. Generate Performance Report
0. Exit
"""


# --------------------------------------------------------------- input helpers
def ask(prompt, parser):
    """Keep asking until `parser` accepts the input (it raises ValueError if not)."""
    while True:
        try:
            return parser(input(prompt))
        except ValueError as err:
            print(f"  ! {err} Please try again.")


def ask_marks(subject, current=None):
    hint = f" [{current}]" if current is not None else ""
    return ask(f"  {subject.title()} marks (0-{MAX_MARKS}){hint}: ",
               lambda t: current if (t.strip() == "" and current is not None)
               else parse_marks(t, subject.title()))


def print_table(students, with_rank=None):
    head = f"{'Roll':<6}{'Name':<22}" + "".join(f"{s.title():>9}" for s in SUBJECTS)
    head += f"{'Total':>8}{'%':>8}{'Grade':>7}{'Status':>8}"
    print("\n" + head + "\n" + "-" * len(head))
    for s in students:
        row = f"{s.roll_no:<6}{s.name[:21]:<22}" + "".join(f"{s.marks[x]:>9}" for x in SUBJECTS)
        print(row + f"{s.total():>8}{s.percentage():>8}{s.grade():>7}{s.status():>8}")
    print(f"\n{len(students)} record(s).")


# -------------------------------------------------------------------- handlers
def add_student():
    roll = ask("Roll number: ", parse_roll_no)
    name = input("Name: ")
    marks = {s: ask_marks(s) for s in SUBJECTS}
    try:
        fh.add_student(Student(roll, name, marks))
    except (ValueError, fh.DuplicateRollError) as err:
        print(f"  ! Could not add student: {err}")
    else:
        print(f"  Student {roll} added.")


def view_all():
    students, _ = fh.load_students()
    print_table(students) if students else print("No students found.")


def search_student():
    roll = ask("Roll number to search: ", parse_roll_no)
    try:
        print_table([fh.find_student(roll)])
    except fh.StudentNotFoundError as err:
        print(f"  ! {err}")


def update_student():
    roll = ask("Roll number to update: ", parse_roll_no)
    try:
        old = fh.find_student(roll)
    except fh.StudentNotFoundError as err:
        print(f"  ! {err}")
        return
    print("Press Enter to keep the current value.")
    name = input(f"  Name [{old.name}]: ").strip() or old.name
    marks = {s: ask_marks(s, old.marks[s]) for s in SUBJECTS}
    try:
        fh.update_student(roll, name, marks)
    except (ValueError, fh.StudentNotFoundError) as err:
        print(f"  ! Could not update: {err}")
    else:
        print("  Student updated. (Previous file saved as students.csv.bak)")


def delete_student():
    roll = ask("Roll number to delete: ", parse_roll_no)
    try:
        student = fh.find_student(roll)
        if input(f"Delete {student.name} ({roll})? Type YES to confirm: ").strip() != "YES":
            print("  Cancelled. Nothing was deleted.")
            return
        fh.delete_student(roll)
    except fh.StudentNotFoundError as err:
        print(f"  ! {err}")
    else:
        print("  Student deleted. (Previous file saved as students.csv.bak)")


def view_result():
    roll = ask("Roll number: ", parse_roll_no)
    try:
        s = fh.find_student(roll)
    except fh.StudentNotFoundError as err:
        print(f"  ! {err}")
        return
    print(f"\n--- Result: {s.name} (Roll {s.roll_no}) ---")
    for subject in SUBJECTS:
        print(f"  {subject.title():<12}{s.marks[subject]:>6} / {MAX_MARKS}")
    print(f"  {'Total':<12}{s.total():>6} / {MAX_MARKS * len(SUBJECTS)}")
    print(f"  Percentage  {s.percentage()}%   Grade {s.grade()}   Status {s.status()}")


def show_topper():
    students, _ = fh.load_students()
    toppers = analysis.class_toppers(students)
    if not toppers:
        print("No students found.")
    for s in toppers:
        print(f"  Topper: {s.name} (Roll {s.roll_no}) - {s.percentage()}%")


def show_statistics():
    students, _ = fh.load_students()
    if not students:
        print("No students found.")
        return
    print(f"\nClass average: {analysis.class_average(students)}%")
    for subject, st in analysis.subject_stats(students).items():
        print(f"  {subject.title():<8} highest {st['highest']} ({', '.join(st['highest_by'])})"
              f" | lowest {st['lowest']} ({', '.join(st['lowest_by'])}) | avg {st['average']}")


def show_passed():
    students, _ = fh.load_students()
    passed = analysis.passed_students(students)
    print_table(passed) if passed else print("No students passed.")


def show_failed():
    students, _ = fh.load_students()
    failed = analysis.failed_students(students)
    print_table(failed) if failed else print("No students failed.")


def show_ranking():
    students, _ = fh.load_students()
    if not students:
        print("No students found.")
        return
    print(f"\n{'Rank':<6}{'Name':<22}{'%':>8}{'Grade':>7}")
    for rank, s in analysis.rank_students(students):
        print(f"{rank:<6}{s.name[:21]:<22}{s.percentage():>8}{s.grade():>7}")


def show_report():
    students, _ = fh.load_students()
    print("\n" + analysis.generate_report(students))


ACTIONS = {
    "1": add_student, "2": view_all, "3": search_student, "4": update_student,
    "5": delete_student, "6": view_result, "7": show_topper, "8": show_statistics,
    "9": show_passed, "10": show_failed, "11": show_ranking, "12": show_report,
}


def main():
    try:
        fh.ensure_csv_exists()
        _, warnings = fh.load_students()
    except (OSError, fh.CSVFormatError) as err:
        print(f"Cannot start: {err}")
        return
    for w in warnings:
        print("Warning:", w)

    while True:
        print(MENU)
        choice = input("Choose an option: ").strip()
        if choice == "0":
            print("Goodbye!")
            break
        action = ACTIONS.get(choice)
        if action is None:
            print("  ! Invalid option. Enter a number from 0 to 12.")
            continue
        try:
            action()
        except (OSError, fh.CSVFormatError) as err:   # file problems, any menu item
            print(f"  ! File problem: {err}")
        input("\nPress Enter to return to the menu...")


if __name__ == "__main__":
    main()
