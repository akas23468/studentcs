import React from "react";
import { X, Sliders, CheckCircle2 } from "lucide-react";
import {
  GRADE_RULES,
  MAX_MARKS,
  PASS_MARK_PER_SUBJECT,
  PASS_PERCENTAGE,
  SUBJECTS,
} from "../types/student";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Academic Grading Rules & Criteria</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-600">
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
              Core Examination Schema
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Subjects
                </span>
                <span className="font-bold text-slate-800">
                  {SUBJECTS.map((s) => s.toUpperCase()).join(", ")}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Max Marks / Subject
                </span>
                <span className="font-bold text-slate-800">{MAX_MARKS} (Total 300)</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
              Passing Benchmark Criteria
            </h4>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-amber-900">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Subject-level minimum:</strong> Must score at least{" "}
                  <strong>{PASS_MARK_PER_SUBJECT} marks</strong> in EVERY subject (Python, SQL, Maths).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Overall class percentage:</strong> Must achieve at least{" "}
                  <strong>{PASS_PERCENTAGE}%</strong> overall score.
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
              Grade Bands (Passing Students)
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {GRADE_RULES.map(([min, grade]) => (
                <div key={grade} className="flex items-center justify-between px-3 py-2 bg-white">
                  <span className="font-bold text-slate-800">Grade {grade}</span>
                  <span className="font-mono text-slate-600">≥ {min}% overall</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2 bg-rose-50/50 text-rose-800">
                <span className="font-bold">Grade F (Fail)</span>
                <span className="font-mono">&lt; 40% overall OR &lt; 35 in any subject</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
