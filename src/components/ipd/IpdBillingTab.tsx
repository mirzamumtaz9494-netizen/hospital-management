"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  CreditCard,
  Building,
  Receipt,
  Search,
  Filter,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { IpBillDetail } from "@/types";

interface IpdBillingTabProps {
  bills: IpBillDetail[];
  onPrintFinalBill: (bill: IpBillDetail) => void;
  onSettleBill: (bill: IpBillDetail) => void;
}

export const IpdBillingTab: React.FC<IpdBillingTabProps> = ({
  bills,
  onPrintFinalBill,
  onSettleBill,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Settled" | "Partially Paid" | "Pending">("All");

  const filteredBills = bills.filter((b) => {
    if (statusFilter !== "All" && b.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.patientName.toLowerCase().includes(q) ||
      b.billNo.toLowerCase().includes(q) ||
      b.ipNo.toLowerCase().includes(q) ||
      b.mrId.toLowerCase().includes(q) ||
      b.doctor.toLowerCase().includes(q) ||
      b.wardBed.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <IndianRupee className="w-4 h-4 text-teal-600" />
            Total IP Invoiced Today
          </div>
          <div className="text-2xl font-bold text-slate-900">₹5,20,000</div>
          <span className="text-[11px] text-emerald-600 font-semibold">▲ 12.1% from yesterday</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Building className="w-4 h-4 text-blue-500" />
            Advance Deposits Held
          </div>
          <div className="text-2xl font-bold text-blue-700">₹3,97,500</div>
          <span className="text-[11px] text-slate-500">Credited to patient ledgers</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Receipt className="w-4 h-4 text-purple-500" />
            Insurance / TPA Claims
          </div>
          <div className="text-2xl font-bold text-purple-700">₹2,02,500</div>
          <span className="text-[11px] text-slate-500">Cashless claims approved</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Net Balance Pending
          </div>
          <div className="text-2xl font-bold text-amber-700">₹1,15,500</div>
          <span className="text-[11px] text-amber-600 font-semibold">Active in-stay patient balances</span>
        </div>
      </div>

      {/* Main Billing Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Inpatient Consolidated Billing & Advance Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              {filteredBills.length} Statements
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bill no, patient or IP No"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              {(["All", "Settled", "Partially Paid", "Pending"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    statusFilter === st
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => alert("Exporting Inpatient Billing Statement...")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 font-semibold shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Bill No</th>
                <th className="py-3 px-4">Patient / IP No</th>
                <th className="py-3 px-4">Ward / Bed</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Fee Breakdown</th>
                <th className="py-3 px-4">Total Bill</th>
                <th className="py-3 px-4">Advance Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900">
                    {b.billNo}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{b.patientName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{b.ipNo} • {b.mrId}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {b.wardBed}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {b.daysStayed} days
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>Bed: ₹{b.bedCharges.toLocaleString()}</div>
                    {b.surgeryOtCharges > 0 && <div className="text-[10px] text-teal-700">OT: ₹{b.surgeryOtCharges.toLocaleString()}</div>}
                    <div className="text-[10px] text-slate-400">Labs: ₹{b.labCharges.toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 text-sm font-mono">
                    ₹{b.totalBill.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700 font-mono">
                    ₹{b.advancePaid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-700 font-mono">
                    ₹{b.balanceDue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {b.status === "Settled" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Settled
                      </span>
                    )}
                    {b.status === "Partially Paid" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        Partially Paid
                      </span>
                    )}
                    {b.status === "Pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <button
                        onClick={() => onPrintFinalBill(b)}
                        className="px-3 py-1 bg-white border border-slate-300 hover:border-teal-700 text-slate-800 font-bold rounded-xl text-xs transition shadow-2xs hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-teal-700" />
                        Final Bill
                      </button>
                    </div>
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
