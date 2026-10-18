import React, { useState, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import type { StudentRecord } from "../types/student";

interface StudentTableProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (student: StudentRecord) => void;
  onAddStudent: () => void;
}

type FilterStatus = "all" | "passed" | "failed";
type SortField = "roll_no" | "name" | "python" | "sql" | "maths" | "total" | "percentage" | "grade";

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onAddStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("roll_no");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Status filter
      if (statusFilter === "passed" && !s.is_passed) return false;
      if (statusFilter === "failed" && s.is_passed) return false;

      // Search term
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesRoll = String(s.roll_no).includes(query);
        if (!matchesName && !matchesRoll) return false;
      }

      return true;
    });
  }, [students, statusFilter, searchTerm]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "roll_no":
          comparison = a.roll_no - b.roll_no;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "python":
          comparison = a.marks.python - b.marks.python;
          break;
        case "sql":
          comparison = a.marks.sql - b.marks.sql;
          break;
        case "maths":
          comparison = a.marks.maths - b.marks.maths;
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "percentage":
          comparison = a.percentage - b.percentage;
          break;
        case "grade":
          comparison = a.grade.localeCompare(b.grade);
          break;
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [filteredStudents, sortField, sortAsc]);

  const passedCount = students.filter((s) => s.is_passed).length;
  const failedCount = students.length - passedCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Filter and Controls Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter("passed")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === "passed"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passed ({passedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter("failed")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === "failed"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Failed ({failedCount})</span>
          </button>
        </div>

        {/* Search & Add button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or roll..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
          </div>

          <button
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200/70 select-none">
              <th
                onClick={() => handleSort("roll_no")}
                className="py-3 px-4 w-20 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Roll</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("name")}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Student Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("python")}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Python</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("sql")}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>SQL</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("maths")}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Maths</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("total")}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("percentage")}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>%</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("grade")}
                className="py-3 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Grade</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-6 h-6 text-slate-300" />
                    <span>No students found matching your criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedStudents.map((s) => (
                <tr
                  key={s.roll_no}
                  onClick={() => onSelectStudent(s)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    #{s.roll_no}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {s.name}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-mono font-medium ${
                      s.marks.python < 35 ? "text-rose-600 font-bold" : "text-slate-700"
                    }`}
                  >
                    {s.marks.python}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-mono font-medium ${
                      s.marks.sql < 35 ? "text-rose-600 font-bold" : "text-slate-700"
                    }`}
                  >
                    {s.marks.sql}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-mono font-medium ${
                      s.marks.maths < 35 ? "text-rose-600 font-bold" : "text-slate-700"
                    }`}
                  >
                    {s.marks.maths}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                    {s.total}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600">
                    {s.percentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        s.grade === "F"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : s.grade === "A+" || s.grade === "A"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {s.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        s.is_passed
                          ? "bg-emerald-100/80 text-emerald-800"
                          : "bg-rose-100/80 text-rose-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectStudent(s)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="View Result"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditStudent(s)}
                        className="p-1 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                        title="Update Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteStudent(s)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count indicator */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {sortedStudents.length} of {students.length} record(s)
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          Subjects: Python · SQL · Maths
        </span>
      </div>
    </div>
  );
};
