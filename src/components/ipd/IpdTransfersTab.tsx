"use client";

import React, { useState } from "react";
import {
  ArrowRightLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building,
  User,
  Plus,
} from "lucide-react";
import { BedTransferRecord } from "@/types";

interface IpdTransfersTabProps {
  transfers: BedTransferRecord[];
  onInitiateTransfer: () => void;
}

export const IpdTransfersTab: React.FC<IpdTransfersTabProps> = ({
  transfers,
  onInitiateTransfer,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransfers = transfers.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.patientName.toLowerCase().includes(q) ||
      t.ipNo.toLowerCase().includes(q) ||
      t.mrId.toLowerCase().includes(q) ||
      t.fromWard.toLowerCase().includes(q) ||
      t.toWard.toLowerCase().includes(q) ||
      t.doctor.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* 4 Mini KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <ArrowRightLeft className="w-4 h-4 text-teal-600" />
            Transfers Completed Today
          </div>
          <div className="text-2xl font-bold text-slate-900">4</div>
          <span className="text-[11px] text-emerald-600 font-semibold">All bed handovers verified</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Building className="w-4 h-4 text-blue-500" />
            ICU to Ward Step-Downs
          </div>
          <div className="text-2xl font-bold text-blue-700">2</div>
          <span className="text-[11px] text-slate-500">Patients stabilized</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <User className="w-4 h-4 text-amber-500" />
            Room Category Upgrades
          </div>
          <div className="text-2xl font-bold text-amber-700">1</div>
          <span className="text-[11px] text-slate-500">Upgraded to Deluxe Private</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-purple-500" />
            Bed Sanitization in Queue
          </div>
          <div className="text-2xl font-bold text-purple-700">8</div>
          <span className="text-[11px] text-slate-500">Housekeeping assigned</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Ward & Bed Transfer Log
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              {filteredTransfers.length} Records
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, bed or transfer ID"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <button
              onClick={onInitiateTransfer}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Transfer Bed</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Transfer ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Transferred From</th>
                <th className="py-3 px-4">Transferred To</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Clinical Reason</th>
                <th className="py-3 px-4 sm:px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransfers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900">
                    {t.transferId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{t.patientName}</span>
                    <span className="text-[10px] text-slate-500">{t.ipNo} • {t.mrId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {t.fromWard} ({t.fromBed})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {t.toWard} ({t.toBed})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {t.transferDate} • {t.transferTime}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {t.doctor}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={t.reason}>
                    {t.reason}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
