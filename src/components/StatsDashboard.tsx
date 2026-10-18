import React from "react";
import {
  Trophy,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Percent,
} from "lucide-react";
import type { AnalysisSummary, StudentRecord } from "../types/student";
import { SUBJECTS } from "../types/student";

interface StatsDashboardProps {
  analysis: AnalysisSummary;
  onSelectStudent: (student: StudentRecord) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  analysis,
  onSelectStudent,
}) => {
  const { total, class_average, toppers, subject_stats, passed, failed, grades } = analysis;

  const passRate = total > 0 ? ((passed.length / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Enrolled
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{total}</div>
            <div className="text-[11px] text-slate-400">Class database records</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Class Average
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{class_average}%</div>
            <div className="text-[11px] text-slate-400">Overall cohort benchmark</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Passed Students
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              {passed.length}{" "}
              <span className="text-xs font-bold text-emerald-600/90">({passRate}%)</span>
            </div>
            <div className="text-[11px] text-slate-400">≥ 35/subj & ≥ 40% overall</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Failed Students
            </div>
            <div className="text-2xl font-black text-rose-700 mt-0.5">
              {failed.length}{" "}
              <span className="text-xs font-bold text-rose-600/90">
                ({total > 0 ? ((failed.length / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Requires academic support</div>
          </div>
        </div>
      </div>

      {/* Class Topper Banner (Handles ties) */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 text-white/10 pointer-events-none">
          <Trophy className="w-48 h-48" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <Trophy className="w-8 h-8 text-yellow-200" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-amber-100 flex items-center gap-1.5">
                <span>Class Topper{toppers.length > 1 ? "s (Tie)" : ""}</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/20 font-bold">
                  Rank 1
                </span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {toppers.length > 0
                  ? toppers.map((t) => t.name).join(", ")
                  : "No students in record"}
              </div>
              <div className="text-xs text-amber-100 mt-0.5">
                {toppers.length > 0
                  ? `Achieved top score of ${toppers[0].percentage}% with Grade ${toppers[0].grade}`
                  : "Add students to identify toppers"}
              </div>
            </div>
          </div>

          {toppers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {toppers.map((t) => (
                <button
                  key={t.roll_no}
                  onClick={() => onSelectStudent(t)}
                  className="px-3 py-1.5 rounded-xl bg-white text-amber-900 text-xs font-bold hover:bg-amber-50 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>View #{t.roll_no} ({t.name})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Subject Performance Analysis</h3>
          </div>
          <span className="text-xs text-slate-500">Python · SQL · Maths</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUBJECTS.map((sub) => {
            const stats = subject_stats[sub];
            if (!stats) return null;
            const subTitle = sub.charAt(0).toUpperCase() + sub.slice(1);

            return (
              <div
                key={sub}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <h4 className="font-bold text-slate-800 text-sm">{subTitle}</h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      Avg: {stats.average}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start justify-between">
                      <span className="text-emerald-700 font-medium">Highest:</span>
                      <div className="text-right">
                        <span className="font-bold text-emerald-800 text-sm font-mono">
                          {stats.highest}
                        </span>
                        <div className="text-[10px] text-slate-500 max-w-[130px] truncate">
                          {stats.highest_by.slice(0, 2).join(", ")}
                          {stats.highest_by.length > 2 ? ` +${stats.highest_by.length - 2}` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-rose-600 font-medium">Lowest:</span>
                      <div className="text-right">
                        <span className="font-bold text-rose-700 text-sm font-mono">
                          {stats.lowest}
                        </span>
                        <div className="text-[10px] text-slate-500 max-w-[130px] truncate">
                          {stats.lowest_by.slice(0, 2).join(", ")}
                          {stats.lowest_by.length > 2 ? ` +${stats.lowest_by.length - 2}` : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual bar */}
                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Lowest: {stats.lowest}</span>
                    <span>Average: {stats.average}</span>
                    <span>Highest: {stats.highest}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${Math.min(stats.average, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Grade Distribution</h3>
          </div>
          <span className="text-xs text-slate-500">Grading scale: A+ down to F</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(["A+", "A", "B", "C", "D", "E", "F"] as const).map((grade) => {
            const count = grades[grade] || 0;
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";

            const isFail = grade === "F";
            const isTop = grade === "A+" || grade === "A";

            return (
              <div
                key={grade}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isFail
                    ? "bg-rose-50/50 border-rose-200 text-rose-900"
                    : isTop
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                    : "bg-slate-50/80 border-slate-200 text-slate-800"
                }`}
              >
                <div className="text-lg font-black">{grade}</div>
                <div className="text-xl font-bold font-mono my-0.5">{count}</div>
                <div className="text-[10px] text-slate-500 font-medium">{pct}% of cohort</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
