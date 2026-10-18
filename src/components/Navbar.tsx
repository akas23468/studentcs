import React from "react";
import {
  GraduationCap,
  Users,
  BarChart3,
  Trophy,
  FileText,
  FileSpreadsheet,
  Sliders,
  Plus,
} from "lucide-react";

export type ActiveTab = "directory" | "stats" | "rankings" | "report";

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onAddStudent: () => void;
  onOpenCSV: () => void;
  onOpenRules: () => void;
  studentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onAddStudent,
  onOpenCSV,
  onOpenRules,
  studentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Student Performance Analyzer
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {studentCount} Students
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Academic Grade Engine & Cohort Analytics
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRules}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              title="Grading Criteria"
            >
              <Sliders className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Rules</span>
            </button>

            <button
              onClick={onOpenCSV}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              title="Import or Export CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">CSV Data</span>
            </button>

            <button
              onClick={onAddStudent}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Student</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 pt-1 -mb-px">
          <button
            onClick={() => onTabChange("directory")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "directory"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students Directory</span>
          </button>

          <button
            onClick={() => onTabChange("stats")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "stats"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Class Analytics</span>
          </button>

          <button
            onClick={() => onTabChange("rankings")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "rankings"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard & Rankings</span>
          </button>

          <button
            onClick={() => onTabChange("report")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "report"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Performance Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
