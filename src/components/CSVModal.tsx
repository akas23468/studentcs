import React, { useState } from "react";
import { X, Upload, Download, RefreshCw, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { parseCSV, exportToCSV } from "../lib/studentLogic";
import { getDefaultStudents } from "../data/defaultStudents";
import type { StudentRecord } from "../types/student";

interface CSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentRecord[];
  onImportStudents: (students: StudentRecord[], warnings: string[]) => void;
  onResetStudents: (students: StudentRecord[]) => void;
}

export const CSVModal: React.FC<CSVModalProps> = ({
  isOpen,
  onClose,
  students,
  onImportStudents,
  onResetStudents,
}) => {
  const [csvContent, setCsvContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setError(null);
    setWarnings([]);

    if (!csvContent.trim()) {
      setError("Please paste or upload CSV content first.");
      return;
    }

    try {
      const result = parseCSV(csvContent);
      if (result.students.length === 0) {
        setError("No valid student records found in the provided CSV.");
        return;
      }
      onImportStudents(result.students, result.warnings);
      if (result.warnings.length === 0) {
        onClose();
      } else {
        setWarnings(result.warnings);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error parsing CSV");
    }
  };

  const handleExport = () => {
    const csv = exportToCSV(students);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        "Are you sure you want to reset records to the default 100 students dataset from students.csv?"
      )
    ) {
      const defaultRecords = getDefaultStudents();
      onResetStudents(defaultRecords);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">CSV Data Management</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="p-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl space-y-1 max-h-32 overflow-y-auto">
              <div className="flex items-center gap-1 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Warnings ({warnings.length} rows skipped):</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Export Current ({students.length} Records)</span>
            </button>

            <button
              onClick={handleResetToDefault}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Reset to Original (100 Students)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Upload or Paste CSV
              </label>
              <label className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Browse File</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="roll_no,name,python,sql,maths&#10;101,Aarav Sharma,92,88,95&#10;102,Diya Patel,85,91,89"
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Required header format: <code className="font-mono text-slate-600">roll_no,name,python,sql,maths</code>
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
