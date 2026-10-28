"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertOctagon,
  Printer,
  Droplet,
  Send,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { BloodRequisition } from "@/types";

interface BloodRequisitionsTabProps {
  requisitions: BloodRequisition[];
  onRunCrossmatch: (reqId: string) => void;
  onOpenIssueModal: (req: BloodRequisition) => void;
  onPrintIssueVoucher: (req: BloodRequisition) => void;
}

export const BloodRequisitionsTab: React.FC<BloodRequisitionsTabProps> = ({
  requisitions,
  onRunCrossmatch,
  onOpenIssueModal,
  onPrintIssueVoucher,
}) => {
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");

  const filtered = requisitions.filter((r) => {
    if (urgencyFilter !== "All" && r.urgency !== urgencyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Inpatient &amp; OT Blood Requisitions ({filtered.length} Requests)
            </h3>
            <p className="text-[11px] text-slate-500">
              Crossmatching queue, patient compatibility sign-offs, and blood dispatch ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Urgency Levels</option>
              <option value="Immediate STAT">Immediate STAT</option>
              <option value="Within 4 Hours">Within 4 Hours</option>
              <option value="Scheduled OT">Scheduled OT</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Req # &amp; Urgency</th>
                <th className="py-2.5 px-3.5">Patient Details</th>
                <th className="py-2.5 px-3.5">Ward / Bed</th>
                <th className="py-2.5 px-3.5">Requisitioned Blood</th>
                <th className="py-2.5 px-3.5">Clinical Indication</th>
                <th className="py-2.5 px-3.5">Crossmatch Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((r) => {
                const isStat = r.urgency === "Immediate STAT";
                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3.5">
                      <div className="font-bold font-mono text-slate-900">{r.reqNumber}</div>
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                          isStat
                            ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                            : r.urgency === "Within 4 Hours"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900">{r.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {r.mrId} • {r.ipNo}
                      </div>
                      <div className="text-[10px] text-teal-700 font-semibold">
                        {r.requestedDoctor}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800">
                        {r.wardBed}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md font-black text-xs bg-rose-50 text-rose-700 border border-rose-200">
                          {r.bloodGroup}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{r.unitsNeeded} Unit(s)</div>
                          <div className="text-[10px] text-slate-500">{r.component}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 max-w-[200px]">
                      <span className="text-[11px] text-slate-600 block line-clamp-2">
                        {r.indication}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        Req: {r.requestedAt}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      {r.status === "Pending Crossmatch" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Crossmatch
                        </span>
                      )}
                      {r.status === "Crossmatch Compatible" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                          Compatible &amp; Verified
                        </span>
                      )}
                      {r.status === "Units Reserved" && (
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Units Reserved
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            {r.reservedBagBarcode}
                          </span>
                        </div>
                      )}
                      {r.status === "Issued to OT" && (
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-purple-600" />
                            Issued to OT / Ward
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            {r.reservedBagBarcode}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right space-x-1.5">
                      {r.status === "Pending Crossmatch" && (
                        <button
                          onClick={() => onRunCrossmatch(r.id)}
                          className="px-2.5 py-1 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                        >
                          Run Crossmatch
                        </button>
                      )}
                      {r.status === "Units Reserved" && (
                        <button
                          onClick={() => onOpenIssueModal(r)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                        >
                          Issue to Ward
                        </button>
                      )}
                      {(r.status === "Issued to OT" || r.status === "Units Reserved") && (
                        <button
                          onClick={() => onPrintIssueVoucher(r)}
                          className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                          title="Print Transfusion Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
