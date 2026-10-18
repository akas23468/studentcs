import {
  FAIL_GRADE,
  GRADE_RULES,
  MAX_MARKS,
  PASS_MARK_PER_SUBJECT,
  PASS_PERCENTAGE,
  SUBJECTS,
  type AnalysisSummary,
  type RankedStudent,
  type StudentRecord,
  type Subject,
  type SubjectStats,
} from "../types/student";

export function parseRollNo(value: unknown): number {
  const strVal = String(value ?? "").trim();
  const num = Number(strVal);
  if (!strVal || isNaN(num) || !Number.isInteger(num)) {
    throw new Error(`Roll number must be a whole number, got '${value}'.`);
  }
  if (num <= 0) {
    throw new Error("Roll number must be greater than 0.");
  }
  return num;
}

export function parseMarks(value: unknown, label = "Marks"): number {
  const strVal = String(value ?? "").trim();
  const num = Number(strVal);
  if (strVal === "" || isNaN(num)) {
    throw new Error(`${label} must be a number, got '${value}'.`);
  }
  if (num < 0 || num > MAX_MARKS) {
    throw new Error(`${label} must be between 0 and ${MAX_MARKS}, got ${value}.`);
  }
  return Math.round(num * 100) / 100;
}

export function createStudentRecord(raw: {
  roll_no: unknown;
  name: unknown;
  python: unknown;
  sql: unknown;
  maths: unknown;
}): StudentRecord {
  const roll_no = parseRollNo(raw.roll_no);
  const name = String(raw.name ?? "").trim();
  if (!name) {
    throw new Error("Name cannot be empty.");
  }

  const marks: Record<Subject, number> = {
    python: parseMarks(raw.python, "Python"),
    sql: parseMarks(raw.sql, "SQL"),
    maths: parseMarks(raw.maths, "Maths"),
  };

  const total = marks.python + marks.sql + marks.maths;
  const percentage = Math.round((total / (MAX_MARKS * SUBJECTS.length)) * 100 * 100) / 100;

  const is_passed =
    percentage >= PASS_PERCENTAGE &&
    SUBJECTS.every((s) => marks[s] >= PASS_MARK_PER_SUBJECT);

  const status = is_passed ? "Pass" : "Fail";

  let grade = FAIL_GRADE;
  if (is_passed) {
    for (const [minimum, letter] of GRADE_RULES) {
      if (percentage >= minimum) {
        grade = letter;
        break;
      }
    }
  }

  return {
    roll_no,
    name,
    marks,
    total,
    percentage,
    grade,
    status,
    is_passed,
  };
}

export function passedStudents(students: StudentRecord[]): StudentRecord[] {
  return students.filter((s) => s.is_passed);
}

export function failedStudents(students: StudentRecord[]): StudentRecord[] {
  return students.filter((s) => !s.is_passed);
}

export function classToppers(students: StudentRecord[]): StudentRecord[] {
  if (students.length === 0) return [];
  const maxPct = Math.max(...students.map((s) => s.percentage));
  return students.filter((s) => s.percentage === maxPct);
}

export function classAverage(students: StudentRecord[]): number {
  if (students.length === 0) return 0.0;
  const sumPct = students.reduce((acc, s) => acc + s.percentage, 0);
  return Math.round((sumPct / students.length) * 100) / 100;
}

export function subjectStats(students: StudentRecord[]): Record<Subject, SubjectStats> {
  const result = {} as Record<Subject, SubjectStats>;
  if (students.length === 0) return result;

  for (const subject of SUBJECTS) {
    const marks = students.map((s) => s.marks[subject]);
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const sum = marks.reduce((a, b) => a + b, 0);
    const average = Math.round((sum / marks.length) * 100) / 100;

    result[subject] = {
      highest,
      highest_by: students.filter((s) => s.marks[subject] === highest).map((s) => s.name),
      lowest,
      lowest_by: students.filter((s) => s.marks[subject] === lowest).map((s) => s.name),
      average,
    };
  }

  return result;
}

export function rankStudents(students: StudentRecord[]): RankedStudent[] {
  if (students.length === 0) return [];
  const ordered = [...students].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  const ranked: RankedStudent[] = [];
  for (let i = 0; i < ordered.length; i++) {
    const s = ordered[i];
    let rank = i + 1;
    if (ranked.length > 0 && s.percentage === ranked[ranked.length - 1].student.percentage) {
      rank = ranked[ranked.length - 1].rank;
    }
    ranked.push({ rank, student: s });
  }

  return ranked;
}

export function gradeDistribution(students: StudentRecord[]): Record<string, number> {
  const counts: Record<string, number> = {
    "A+": 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  };
  for (const s of students) {
    counts[s.grade] = (counts[s.grade] || 0) + 1;
  }
  return counts;
}

export function generateReport(students: StudentRecord[]): string {
  if (students.length === 0) {
    return "No student records available. Add students to generate a report.";
  }

  const passed = passedStudents(students);
  const failed = failedStudents(students);
  const avg = classAverage(students);
  const toppers = classToppers(students);
  const stats = subjectStats(students);
  const dist = gradeDistribution(students);
  const ranked = rankStudents(students);

  const lines: string[] = [
    "=".repeat(50),
    "  STUDENT PERFORMANCE REPORT",
    "=".repeat(50),
    `Total students   : ${students.length}`,
    `Passed           : ${passed.length}`,
    `Failed           : ${failed.length}`,
    `Pass rate        : ${((passed.length / students.length) * 100).toFixed(1)}%`,
    `Class average    : ${avg}%`,
    `Passing rule     : >= ${PASS_PERCENTAGE}% overall and >= ${PASS_MARK_PER_SUBJECT} in every subject`,
    "",
    "Topper(s)        : " +
      toppers.map((s) => `${s.name} (${s.percentage}%)`).join(", "),
    "",
    "Subject-wise marks",
    "-".repeat(50),
  ];

  for (const subject of SUBJECTS) {
    const st = stats[subject];
    if (st) {
      const title = (subject.charAt(0).toUpperCase() + subject.slice(1)).padEnd(8);
      const hi = String(st.highest).padStart(5);
      const hiBy = st.highest_by.slice(0, 2).join(", ");
      const lo = String(st.lowest).padStart(5);
      lines.push(`${title} high ${hi} (${hiBy}) | low ${lo} | avg ${st.average}`);
    }
  }

  lines.push("", "Grade distribution", "-".repeat(50));
  const gradeKeys = ["A+", "A", "B", "C", "D", "E", "F"];
  for (const g of gradeKeys) {
    if (dist[g] !== undefined) {
      lines.push(`${g.padEnd(3)}: ${dist[g]}`);
    }
  }

  lines.push("", "Top 5 ranks", "-".repeat(50));
  const top5 = ranked.slice(0, 5);
  for (const item of top5) {
    lines.push(`${item.rank}. ${item.student.name} - ${item.student.percentage}% (${item.student.grade})`);
  }

  return lines.join("\n");
}

export function computeAnalysis(students: StudentRecord[]): AnalysisSummary {
  return {
    total: students.length,
    class_average: classAverage(students),
    toppers: classToppers(students),
    subject_stats: subjectStats(students),
    passed: passedStudents(students),
    failed: failedStudents(students),
    ranking: rankStudents(students),
    grades: gradeDistribution(students),
    report: generateReport(students),
  };
}

export function parseCSV(csvText: string): { students: StudentRecord[]; warnings: string[] } {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { students: [], warnings: [] };
  }

  const header = lines[0].split(",").map((c) => c.trim().toLowerCase());
  const expected = ["roll_no", "name", ...SUBJECTS];
  const missing = expected.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    throw new Error(
      `CSV is missing column(s): ${missing.join(", ")}. Expected header: ${expected.join(",")}`
    );
  }

  const rollIdx = header.indexOf("roll_no");
  const nameIdx = header.indexOf("name");
  const pyIdx = header.indexOf("python");
  const sqlIdx = header.indexOf("sql");
  const mathsIdx = header.indexOf("maths");

  const students: StudentRecord[] = [];
  const warnings: string[] = [];
  const seenRolls = new Set<number>();

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((c) => c.trim());
    if (row.length < 5) {
      warnings.push(`Line ${i + 1}: skipped (insufficient columns)`);
      continue;
    }
    try {
      const student = createStudentRecord({
        roll_no: row[rollIdx],
        name: row[nameIdx],
        python: row[pyIdx],
        sql: row[sqlIdx],
        maths: row[mathsIdx],
      });
      if (seenRolls.has(student.roll_no)) {
        warnings.push(`Line ${i + 1}: skipped (duplicate roll number ${student.roll_no})`);
      } else {
        seenRolls.add(student.roll_no);
        students.push(student);
      }
    } catch (err: unknown) {
      warnings.push(`Line ${i + 1}: skipped (${err instanceof Error ? err.message : String(err)})`);
    }
  }

  return { students, warnings };
}

export function exportToCSV(students: StudentRecord[]): string {
  const header = ["roll_no", "name", "python", "sql", "maths"];
  const rows = students.map((s) => [
    s.roll_no,
    `"${s.name.replace(/"/g, '""')}"`,
    s.marks.python,
    s.marks.sql,
    s.marks.maths,
  ]);
  return [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
