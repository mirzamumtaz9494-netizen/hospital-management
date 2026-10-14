"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  CreditCard,
  Wallet,
  AlertCircle,
  Search,
  Filter,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  Receipt,
  Eye,
  Plus,
  X,
} from "lucide-react";
import { OpBillItem } from "@/types";

interface OpdBillingTabProps {
  bills: OpBillItem[];
  onPrintBill: (bill: OpBillItem) => void;
  onCollectPayment: (bill: OpBillItem) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  RK: "bg-blue-100 text-blue-700",
  KR: "bg-rose-100 text-rose-700",
  VR: "bg-teal-100 text-teal-700",
  AD: "bg-pink-100 text-pink-700",
  FA: "bg-indigo-100 text-indigo-700",
  MJ: "bg-amber-100 text-amber-700",
  DM: "bg-cyan-100 text-cyan-700",
};

export const OpdBillingTab: React.FC<OpdBillingTabProps> = ({
  bills,
  onPrintBill,
  onCollectPayment,
}) => {
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Unpaid" | "Partial">("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBillForPay, setSelectedBillForPay] = useState<OpBillItem | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<"UPI" | "Cash" | "Card">("UPI");

  const filteredBills = bills.filter((b) => {
    if (statusFilter !== "All" && b.paymentStatus !== statusFilter) return false;
    if (modeFilter !== "All" && b.paymentMode !== modeFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.patientName.toLowerCase().includes(q) ||
      b.billNo.toLowerCase().includes(q) ||
      b.opNo.toLowerCase().includes(q) ||
      b.mrId.toLowerCase().includes(q) ||
      b.phone.includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <IndianRupee className="w-4 h-4 text-teal-600" />
            Total OP Billed Today
          </div>
          <div className="text-2xl font-bold text-slate-900">₹1,85,400</div>
          <span className="text-[11px] text-emerald-600 font-semibold">142 Invoices generated</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <CreditCard className="w-4 h-4 text-blue-500" />
            Digital & UPI Receipts
          </div>
          <div className="text-2xl font-bold text-blue-700">₹1,12,400</div>
          <span className="text-[11px] text-slate-500">Instant QR & POS settlement</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Wallet className="w-4 h-4 text-teal-700" />
            Cash at Counter
          </div>
          <div className="text-2xl font-bold text-teal-800">₹54,200</div>
          <span className="text-[11px] text-slate-500">Counters 1 & 2 verified</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Balance / Unpaid OP
          </div>
          <div className="text-2xl font-bold text-amber-700">₹18,800</div>
          <span className="text-[11px] text-amber-600 font-semibold">Pending collection at pharmacy/lab</span>
        </div>
      </div>

      {/* Main Billing Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Top Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Outpatient Cashier & Billing Desk
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              {filteredBills.length} Invoices
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bill no, patient or OP No"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Modes</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>

            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              {(["All", "Paid", "Unpaid", "Partial"] as const).map((st) => (
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
              onClick={() => alert("Exporting Outpatient Invoices to Excel...")}
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
                <th className="py-3 px-4 sm:px-6">Bill No ↑</th>
                <th className="py-3 px-4">OP Token</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Department & Doctor</th>
                <th className="py-3 px-4">Fee Breakdown</th>
                <th className="py-3 px-4">Net Total</th>
                <th className="py-3 px-4">Paid / Due</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition group">
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900">
                    {b.billNo}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {b.opNo}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          AVATAR_COLORS[b.initials] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {b.initials}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block group-hover:text-teal-700 transition">
                          {b.patientName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {b.mrId} • {b.date}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{b.doctor}</div>
                    <div className="text-[10px] text-slate-500">{b.department}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>Consult: ₹{b.consultationFee}</div>
                    {b.labCharges > 0 && <div className="text-[10px] text-teal-700">Lab: ₹{b.labCharges}</div>}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                    ₹{b.totalAmount}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <div className="text-emerald-700 font-bold">Paid: ₹{b.paidAmount}</div>
                    {b.balanceDue > 0 && (
                      <div className="text-amber-700 text-[10px] font-bold">Due: ₹{b.balanceDue}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {b.paymentStatus === "Paid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Paid ({b.paymentMode})
                        </span>
                      )}
                      {b.paymentStatus === "Unpaid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Unpaid
                        </span>
                      )}
                      {b.paymentStatus === "Partial" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          Partial
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {b.balanceDue > 0 && (
                        <button
                          onClick={() => {
                            setSelectedBillForPay(b);
                            setPayAmount(b.balanceDue);
                          }}
                          className="px-2.5 py-1 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition shadow-2xs"
                        >
                          Collect
                        </button>
                      )}
                      <button
                        onClick={() => onPrintBill(b)}
                        className="p-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="Print Official Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {selectedBillForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Collect OPD Fee / Balance
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedBillForPay.billNo} • {selectedBillForPay.patientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedBillForPay(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed:</span>
                  <span className="font-bold text-slate-800">₹{selectedBillForPay.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Already Paid:</span>
                  <span className="font-bold text-emerald-700">₹{selectedBillForPay.paidAmount}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">Balance Pending:</span>
                  <span className="font-bold text-amber-700">₹{selectedBillForPay.balanceDue}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Amount Received (₹)
                </label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Payment Mode
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                >
                  <option value="UPI">UPI / Digital QR</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Card">Debit / Credit Card</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBillForPay(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCollectPayment({
                      ...selectedBillForPay,
                      paidAmount: selectedBillForPay.paidAmount + payAmount,
                      balanceDue: Math.max(0, selectedBillForPay.balanceDue - payAmount),
                      paymentStatus:
                        selectedBillForPay.balanceDue - payAmount <= 0 ? "Paid" : "Partial",
                      paymentMode: payMode,
                    });
                    setSelectedBillForPay(null);
                  }}
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs"
                >
                  Record Payment & Issue Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
