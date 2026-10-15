"use client";

import React, { useState } from "react";
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Search,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import { WardIndent } from "@/types";

interface PharmacyWardIndentsTabProps {
  indents: WardIndent[];
  onIssueIndent: (indentId: string) => void;
  onPrintIndent: (indent: WardIndent) => void;
}

export const PharmacyWardIndentsTab: React.FC<PharmacyWardIndentsTabProps> = ({
  indents,
  onIssueIndent,
  onPrintIndent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("All");

  const filteredIndents = indents.filter((ind) => {
    if (selectedWard !== "All" && !ind.wardName.includes(selectedWard)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ind.indentNo.toLowerCase().includes(q) ||
      ind.wardName.toLowerCase().includes(q) ||
      ind.requestedByNurse.toLowerCase().includes(q) ||
      ind.items.some((i) => i.medicineName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Inpatient (IPD) Ward Drug Indents &amp; Nurse Requisitions
            </h3>
            <p className="text-xs text-slate-500">
              Review and dispatch daily bedside floor stock, emergency OT kits, and ICU critical medications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              {indents.filter((i) => i.status === "Pending Review").length} Pending Dispatches
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by indent no, ward, or drug..."
              className="w-full pl-10 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Inpatient Wards</option>
              <option value="ICU">ICU Ward</option>
              <option value="General">General Ward</option>
              <option value="OT">Operation Theatre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Indents List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIndents.map((indent) => {
          const isPending = indent.status === "Pending Review";
          const isStat = indent.priority === "STAT Emergency";

          return (
            <div
              key={indent.id}
              className={`bg-white rounded-2xl border p-4 shadow-2xs flex flex-col justify-between transition ${
                isStat
                  ? "border-rose-300 bg-rose-50/10"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {indent.indentNo}
                      </span>
                      {isStat && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 animate-pulse">
                          STAT
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      {indent.wardName}
                    </h4>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPending
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {indent.status}
                  </span>
                </div>

                {/* Requester Info */}
                <div className="text-[11px] text-slate-500">
                  Requested by: <strong className="text-slate-700">{indent.requestedByNurse}</strong>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {indent.requestedAt}
                  </div>
                </div>

                {/* Itemized Requisition List */}
                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Requested Items ({indent.items.length})
                  </div>
                  {indent.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs flex items-center justify-between text-slate-700 font-medium"
                    >
                      <span className="truncate pr-2">{item.medicineName}</span>
                      <span className="font-mono text-slate-900 font-bold shrink-0">
                        Qty: {item.issuedQty} / {item.requestedQty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Cost */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-slate-500">Total Indent Value:</span>
                  <span className="font-black text-slate-900">
                    ₹{indent.totalCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onPrintIndent(indent)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  Print Slip
                </button>

                {isPending && (
                  <button
                    onClick={() => onIssueIndent(indent.id)}
                    className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Issue &amp; Dispatch
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
