import React, { useState } from "react";
import { Medal, Search, Eye } from "lucide-react";
import type { RankedStudent, StudentRecord } from "../types/student";

interface LeaderboardProps {
  ranking: RankedStudent[];
  onSelectStudent: (student: StudentRecord) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ ranking, onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = ranking.filter(
    (item) =>
      item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.student.roll_no).includes(searchTerm)
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300 shadow-xs">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-900 font-bold text-xs border border-amber-700/30 shadow-xs">
          🥉 3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs border border-slate-200">
        #{rank}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Class Rankings</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by overall percentage (highest first). Students with identical percentages share ranks.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or roll..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200/70">
              <th className="py-3 px-4 w-16 text-center">Rank</th>
              <th className="py-3 px-4 w-20">Roll</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4 text-right">Python</th>
              <th className="py-3 px-4 text-right">SQL</th>
              <th className="py-3 px-4 text-right">Maths</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-right">Percentage</th>
              <th className="py-3 px-4 text-center">Grade</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400 text-sm">
                  No ranked students match your search.
                </td>
              </tr>
            ) : (
              filtered.map(({ rank, student }) => (
                <tr
                  key={student.roll_no}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectStudent(student)}
                >
                  <td className="py-3 px-4 text-center">{getRankBadge(rank)}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">
                    #{student.roll_no}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <span>{student.name}</span>
                    {rank === 1 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                        Topper
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {student.marks.python}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {student.marks.sql}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {student.marks.maths}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                    {student.total}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600">
                    {student.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        student.grade === "F"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : student.grade === "A+" || student.grade === "A"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        student.is_passed
                          ? "bg-emerald-100/80 text-emerald-800"
                          : "bg-rose-100/80 text-rose-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="View Report Card"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
