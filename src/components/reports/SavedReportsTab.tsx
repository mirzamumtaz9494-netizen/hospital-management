"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  FileSpreadsheet,
  FileCheck,
  Building,
  Sparkles,
} from "lucide-react";
import { SavedReportItem, ReportCategory } from "@/types";
import { MOCK_SAVED_REPORTS } from "@/data/reportsMockData";

interface SavedReportsTabProps {
  reports?: SavedReportItem[];
  onViewReport: (report: SavedReportItem) => void;
  onDownloadReport: (report: SavedReportItem) => void;
}

export const SavedReportsTab: React.FC<SavedReportsTabProps> = ({
  reports = MOCK_SAVED_REPORTS,
  onViewReport,
  onDownloadReport,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    { id: "All", label: "All Reports", count: reports.length },
    { id: "Financial", label: "Financial & Revenue", count: reports.filter((r) => r.category === "Financial").length },
    { id: "Clinical", label: "Clinical & Operations", count: reports.filter((r) => r.category === "Clinical").length },
    { id: "Laboratory", label: "Laboratory (LIS)", count: reports.filter((r) => r.category === "Laboratory").length },
    { id: "Pharmacy", label: "Pharmacy & Stocks", count: reports.filter((r) => r.category === "Pharmacy").length },
    { id: "Compliance", label: "NABH & Compliance", count: reports.filter((r) => r.category === "Compliance" || r.category === "Executive").length },
  ];

  const filteredReports = reports.filter((rep) => {
    if (selectedCategory !== "All") {
      if (selectedCategory === "Compliance") {
        if (rep.category !== "Compliance" && rep.category !== "Executive") return false;
      } else if (rep.category !== selectedCategory) {
        return false;
      }
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rep.code.toLowerCase().includes(q) ||
      rep.title.toLowerCase().includes(q) ||
      rep.description.toLowerCase().includes(q) ||
      rep.generatedBy.toLowerCase().includes(q) ||
      rep.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const getCategoryColor = (cat: ReportCategory) => {
    switch (cat) {
      case "Financial":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "Clinical":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Laboratory":
        return "bg-violet-50 text-violet-800 border-violet-200";
      case "Pharmacy":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Compliance":
      case "Executive":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Hospital Master Reports &amp; Analytics Archive
            </h3>
            <p className="text-xs text-slate-500">
              Access pre-configured regulatory submissions, financial day-end summaries, and operational audits
            </p>
          </div>

          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 self-start sm:self-auto">
            {reports.length} Reports Configured
          </span>
        </div>

        {/* Categories Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategory === cat.id
                      ? "bg-teal-500/30 text-teal-300"
                      : "bg-white text-slate-500 border border-slate-200"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code, title, or keyword..."
              className="w-full pl-10 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono font-bold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {report.code}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(
                    report.category
                  )}`}
                >
                  {report.category}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition line-clamp-1">
                  {report.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {report.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {report.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/60 px-1.5 py-0.2 rounded font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta & Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {report.frequency} • {report.size}
                </span>
                <span className="font-bold text-slate-700">{report.format}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewReport(report)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  View &amp; Print
                </button>

                <button
                  onClick={() => onDownloadReport(report)}
                  className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-2xs"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
