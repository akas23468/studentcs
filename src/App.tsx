import React, { useState, useEffect, useMemo } from "react";
import { Navbar, type ActiveTab } from "./components/Navbar";
import { StudentTable } from "./components/StudentTable";
import { StatsDashboard } from "./components/StatsDashboard";
import { Leaderboard } from "./components/Leaderboard";
import { ReportViewer } from "./components/ReportViewer";
import { StudentModal } from "./components/StudentModal";
import { StudentResultModal } from "./components/StudentResultModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { CSVModal } from "./components/CSVModal";
import { RulesModal } from "./components/RulesModal";
import { getDefaultStudents } from "./data/defaultStudents";
import { computeAnalysis } from "./lib/studentLogic";
import type { StudentRecord } from "./types/student";
import { CheckCircle2, AlertCircle } from "lucide-react";

const STORAGE_KEY = "student_performance_analyzer_records_v1";

export const App: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return getDefaultStudents();
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("directory");
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentRecord | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error("Failed to persist to localStorage:", e);
    }
  }, [students]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Recompute full academic analysis
  const analysis = useMemo(() => {
    return computeAnalysis(students);
  }, [students]);

  // Handlers
  const handleSaveStudent = (record: StudentRecord) => {
    if (studentToEdit) {
      setStudents((prev) =>
        prev.map((s) => (s.roll_no === record.roll_no ? record : s))
      );
      showToast(`Student #${record.roll_no} (${record.name}) updated successfully.`);
      setStudentToEdit(null);
    } else {
      setStudents((prev) => [...prev, record]);
      showToast(`Student #${record.roll_no} (${record.name}) added successfully.`);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteStudent = (rollNo: number) => {
    setStudents((prev) => prev.filter((s) => s.roll_no !== rollNo));
    showToast(`Student #${rollNo} deleted.`);
  };

  const handleImportStudents = (imported: StudentRecord[], warnings: string[]) => {
    setStudents(imported);
    if (warnings.length > 0) {
      showToast(`Imported ${imported.length} students with ${warnings.length} skipped rows.`);
    } else {
      showToast(`Successfully imported ${imported.length} student records.`);
    }
  };

  const handleResetStudents = (defaultList: StudentRecord[]) => {
    setStudents(defaultList);
    showToast(`Reset back to initial dataset (${defaultList.length} students).`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddStudent={() => {
          setStudentToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenCSV={() => setIsCSVModalOpen(true)}
        onOpenRules={() => setIsRulesModalOpen(true)}
        studentCount={students.length}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl animate-in slide-in-from-bottom duration-200">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "directory" && (
          <StudentTable
            students={students}
            onSelectStudent={(student) => setSelectedStudentForModal(student)}
            onEditStudent={(student) => {
              setStudentToEdit(student);
              setIsAddModalOpen(true);
            }}
            onDeleteStudent={(student) => setStudentToDelete(student)}
            onAddStudent={() => {
              setStudentToEdit(null);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {activeTab === "stats" && (
          <StatsDashboard
            analysis={analysis}
            onSelectStudent={(student) => setSelectedStudentForModal(student)}
          />
        )}

        {activeTab === "rankings" && (
          <Leaderboard
            ranking={analysis.ranking}
            onSelectStudent={(student) => setSelectedStudentForModal(student)}
          />
        )}

        {activeTab === "report" && <ReportViewer reportText={analysis.report} />}
      </main>

      {/* Modals */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        existingStudent={studentToEdit}
        allStudents={students}
      />

      <StudentResultModal
        student={selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
      />

      <DeleteConfirmModal
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteStudent}
      />

      <CSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        students={students}
        onImportStudents={handleImportStudents}
        onResetStudents={handleResetStudents}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};
