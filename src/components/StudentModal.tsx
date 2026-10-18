import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Calculator } from "lucide-react";
import {
  MAX_MARKS,
  PASS_MARK_PER_SUBJECT,
  PASS_PERCENTAGE,
  type StudentRecord,
} from "../types/student";
import { createStudentRecord } from "../lib/studentLogic";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: StudentRecord) => void;
  existingStudent?: StudentRecord | null;
  allStudents: StudentRecord[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingStudent,
  allStudents,
}) => {
  const isEditing = Boolean(existingStudent);

  const [rollNo, setRollNo] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [python, setPython] = useState<string>("");
  const [sql, setSql] = useState<string>("");
  const [maths, setMaths] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingStudent) {
      setRollNo(String(existingStudent.roll_no));
      setName(existingStudent.name);
      setPython(String(existingStudent.marks.python));
      setSql(String(existingStudent.marks.sql));
      setMaths(String(existingStudent.marks.maths));
    } else {
      // Suggest next roll number
      const maxRoll = allStudents.reduce((max, s) => Math.max(max, s.roll_no), 100);
      setRollNo(String(maxRoll + 1));
      setName("");
      setPython("");
      setSql("");
      setMaths("");
    }
    setError(null);
  }, [existingStudent, isOpen, allStudents]);

  if (!isOpen) return null;

  // Live calculation preview
  let preview: StudentRecord | null = null;
  let liveError: string | null = null;

  try {
    if (rollNo && name && python !== "" && sql !== "" && maths !== "") {
      preview = createStudentRecord({
        roll_no: rollNo,
        name,
        python,
        sql,
        maths,
      });
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      liveError = e.message;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedRoll = Number(rollNo.trim());
      if (!isEditing) {
        const isDuplicate = allStudents.some((s) => s.roll_no === parsedRoll);
        if (isDuplicate) {
          setError(`Roll number ${parsedRoll} already exists.`);
          return;
        }
      }

      const record = createStudentRecord({
        roll_no: rollNo,
        name,
        python,
        sql,
        maths,
      });

      onSave(record);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid student input");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {isEditing ? `Update Student #${existingStudent?.roll_no}` : "Add New Student"}
            </h3>
            <p className="text-xs text-slate-500">
              Enter academic marks out of {MAX_MARKS} for each subject
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Roll Number
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                disabled={isEditing}
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="101"
                className={`w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                  isEditing ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-white"
                }`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Diya Patel"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Subject Marks (0 – {MAX_MARKS})
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Python</label>
                <input
                  type="number"
                  min="0"
                  max={MAX_MARKS}
                  step="any"
                  required
                  value={python}
                  onChange={(e) => setPython(e.target.value)}
                  placeholder="0-100"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">SQL</label>
                <input
                  type="number"
                  min="0"
                  max={MAX_MARKS}
                  step="any"
                  required
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                  placeholder="0-100"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">Maths</label>
                <input
                  type="number"
                  min="0"
                  max={MAX_MARKS}
                  step="any"
                  required
                  value={maths}
                  onChange={(e) => setMaths(e.target.value)}
                  placeholder="0-100"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Live Outcome Preview */}
          {preview ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
                <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Calculated Result</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Total</div>
                  <div className="text-sm font-bold text-slate-800">{preview.total} / 300</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Percent</div>
                  <div className="text-sm font-bold text-slate-800">{preview.percentage}%</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Grade</div>
                  <div className="text-sm font-bold text-indigo-600">{preview.grade}</div>
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    preview.is_passed
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  <div className="text-[10px] uppercase font-medium">Status</div>
                  <div className="text-sm font-bold">{preview.status}</div>
                </div>
              </div>
              {!preview.is_passed && (
                <div className="mt-2 text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Must score ≥ {PASS_PERCENTAGE}% overall and ≥ {PASS_MARK_PER_SUBJECT} in every subject.
                  </span>
                </div>
              )}
            </div>
          ) : liveError ? (
            <div className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              {liveError}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditing ? "Save Changes" : "Add Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
