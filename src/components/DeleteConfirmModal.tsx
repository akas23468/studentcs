import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { StudentRecord } from "../types/student";

interface DeleteConfirmModalProps {
  student: StudentRecord | null;
  onClose: () => void;
  onConfirm: (rollNo: number) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  student,
  onClose,
  onConfirm,
}) => {
  const [confirmText, setConfirmText] = useState("");

  if (!student) return null;

  const isConfirmed = confirmText.trim() === "YES";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Delete Student Record</h3>
            <p className="text-xs text-slate-500">This action cannot be undone.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs text-slate-700 space-y-1">
          <div>
            <span className="font-semibold text-slate-500">Student: </span>
            <span className="font-bold text-slate-800">{student.name}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Roll Number: </span>
            <span className="font-mono font-bold text-slate-800">#{student.roll_no}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-3">
          To confirm removal, please type <strong className="text-rose-600 font-mono">YES</strong> below:
        </p>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type YES to confirm"
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 mb-5 font-mono"
        />

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isConfirmed}
            onClick={() => {
              onConfirm(student.roll_no);
              onClose();
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white transition-colors ${
              isConfirmed
                ? "bg-rose-600 hover:bg-rose-700 shadow-sm cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
