import React, { useState } from "react";
import { FileText, Copy, Check, Download, Terminal } from "lucide-react";

interface ReportViewerProps {
  reportText: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ reportText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_performance_report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">Student Performance Report</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official summary report matching python <code className="font-mono text-indigo-600">generate_report()</code> logic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Report</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border-t border-slate-900">
        <div className="flex items-center gap-2 text-slate-500 pb-3 mb-3 border-b border-slate-800 text-[11px]">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span>Output Stream (Terminal Format)</span>
        </div>
        <pre className="whitespace-pre select-all selection:bg-emerald-900 selection:text-white">
          {reportText}
        </pre>
      </div>
    </div>
  );
};
