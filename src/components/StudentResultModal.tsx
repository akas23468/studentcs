import React, { useState } from "react";
import { X, Award, CheckCircle2, XCircle, Copy, Check, Printer } from "lucide-react";
import {
  MAX_MARKS,
  PASS_MARK_PER_SUBJECT,
  SUBJECTS,
  type StudentRecord,
} from "../types/student";

interface StudentResultModalProps {
  student: StudentRecord | null;
  onClose: () => void;
}

export const StudentResultModal: React.FC<StudentResultModalProps> = ({ student, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!student) return null;

  const handleCopy = () => {
    const text = [
      `--- Result: ${student.name} (Roll ${student.roll_no}) ---`,
      ...SUBJECTS.map(
        (s) =>
          `  ${(s.charAt(0).toUpperCase() + s.slice(1)).padEnd(12)}${String(student.marks[s]).padStart(6)} / ${MAX_MARKS}`
      ),
      `  ${"Total".padEnd(12)}${String(student.total).padStart(6)} / ${MAX_MARKS * SUBJECTS.length}`,
      `  Percentage  ${student.percentage}%   Grade ${student.grade}   Status ${student.status}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getSubjectColor = (mark: number) => {
    if (mark >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (mark >= PASS_MARK_PER_SUBJECT) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header banner */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-200 tracking-wider uppercase">
                Academic Transcript
              </span>
              <h2 className="text-xl font-bold text-white">{student.name}</h2>
              <p className="text-xs text-indigo-200">Roll No: {student.roll_no}</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Key Summary Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Total Score
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {student.total}{" "}
                <span className="text-xs font-normal text-slate-500">/ 300</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Percentage
              </span>
              <div className="text-xl font-extrabold text-indigo-600 mt-1">
                {student.percentage}%
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                student.is_passed
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                Grade & Status
              </span>
              <div className="text-xl font-extrabold flex items-center justify-center gap-1 mt-1">
                <span>{student.grade}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-white/70">
                  {student.status}
                </span>
              </div>
            </div>
          </div>

          {/* Subject Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Subject-wise Scores
            </h4>
            <div className="space-y-3">
              {SUBJECTS.map((sub) => {
                const mark = student.marks[sub];
                const passed = mark >= PASS_MARK_PER_SUBJECT;
                const subTitle = sub.charAt(0).toUpperCase() + sub.slice(1);

                return (
                  <div
                    key={sub}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        {passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800">{subTitle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{mark}</span>
                        <span className="text-xs text-slate-400">/ {MAX_MARKS}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getSubjectColor(
                            mark
                          )}`}
                        >
                          {passed ? "Pass" : "Fail (< 35)"}
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          passed
                            ? mark >= 80
                              ? "bg-emerald-500"
                              : "bg-indigo-600"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.min(mark, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Criteria info */}
          <div className="text-[11px] text-slate-500 bg-slate-100/70 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
            <strong>Passing Rule:</strong> Must achieve at least{" "}
            <strong>{PASS_MARK_PER_SUBJECT} marks</strong> in every individual subject and an overall
            percentage of at least <strong>40%</strong>.
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
