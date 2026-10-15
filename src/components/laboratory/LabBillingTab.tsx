"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  Search,
  Filter,
  Printer,
  Receipt,
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  Building,
} from "lucide-react";
import { LabBillItem } from "@/types";

interface LabBillingTabProps {
  bills: LabBillItem[];
  onPrintBill: (bill: LabBillItem) => void;
  onSettleBill: (bill: LabBillItem) => void;
}

export const LabBillingTab: React.FC<LabBillingTabProps> = ({
  bills,
  onPrintBill,
  onSettleBill,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const filteredBills = bills.filter((b) => {
    if (selectedStatus !== "All" && b.status !== selectedStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.billNo.toLowerCase().includes(q) ||
      b.orderNo.toLowerCase().includes(q) ||
      b.patientName.toLowerCase().includes(q) ||
      b.mrId.toLowerCase().includes(q) ||
      b.doctor.toLowerCase().includes(q) ||
      b.paymentMode.toLowerCase().includes(q)
    );
  });

  const totalRevenue = bills.reduce((acc, b) => acc + b.paidAmount, 0);

  return (
    <div className="space-y-4">
      {/* 4 Revenue Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-teal-700" />
            <span>Today&apos;s Lab Revenue</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">
            ▲ 5.2% vs yesterday
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <Receipt className="w-3.5 h-3.5 text-blue-600" />
            <span>Total Invoices</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {bills.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            100% electronic billing
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <CreditCard className="w-3.5 h-3.5 text-violet-600" />
            <span>Digital / Cashless</span>
          </div>
          <div className="text-2xl font-black text-violet-700 tracking-tight">
            82%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            UPI & TPA claims
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Settled Status</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            100%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Zero pending receivables
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bill by number, order, patient, MR ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Ledger
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Bill No / Order</th>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Diagnostic Items</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Net Amount</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900">{bill.billNo}</div>
                    <div className="text-[11px] text-teal-700 font-semibold">{bill.orderNo}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{bill.time}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{bill.patientName}</div>
                    <div className="font-mono text-slate-400 text-[11px]">{bill.mrId}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="space-y-0.5">
                      {bill.tests.map((t, idx) => (
                        <div key={idx} className="text-[11px] text-slate-700 font-medium truncate">
                          {t.testName} <span className="text-slate-400 font-mono">(₹{t.cost})</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {bill.doctor}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-black text-slate-900 text-xs">
                      ₹{bill.netPayable.toLocaleString("en-IN")}
                    </div>
                    {bill.discount > 0 && (
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        -₹{bill.discount} Disc.
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {bill.paymentMode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Paid
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onPrintBill(bill)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1.5 ml-auto"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-700" />
                      Receipt
                    </button>
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
