export const SUBJECTS = ["python", "sql", "maths"] as const;
export type Subject = typeof SUBJECTS[number];

export const MAX_MARKS = 100;
export const PASS_MARK_PER_SUBJECT = 35;
export const PASS_PERCENTAGE = 40;

export const GRADE_RULES: [number, string][] = [
  [90, "A+"],
  [80, "A"],
  [70, "B"],
  [60, "C"],
  [50, "D"],
  [40, "E"],
];
export const FAIL_GRADE = "F";

export interface StudentInput {
  roll_no: number;
  name: string;
  python: number;
  sql: number;
  maths: number;
}

export interface StudentRecord {
  roll_no: number;
  name: string;
  marks: Record<Subject, number>;
  total: number;
  percentage: number;
  grade: string;
  status: "Pass" | "Fail";
  is_passed: boolean;
}

export interface SubjectStats {
  highest: number;
  highest_by: string[];
  lowest: number;
  lowest_by: string[];
  average: number;
}

export interface RankedStudent {
  rank: number;
  student: StudentRecord;
}

export interface AnalysisSummary {
  total: number;
  class_average: number;
  toppers: StudentRecord[];
  subject_stats: Record<Subject, SubjectStats>;
  passed: StudentRecord[];
  failed: StudentRecord[];
  ranking: RankedStudent[];
  grades: Record<string, number>;
  report: string;
}
