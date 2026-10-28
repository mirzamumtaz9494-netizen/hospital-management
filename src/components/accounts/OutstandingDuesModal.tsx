"use client";

import React, { useState } from "react";
import {
  X,
  AlertCircle,
  IndianRupee,
  Phone,
  Send,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  CreditCard,
  QrCode,
  FileText,
  Clock,
  Printer,
  ShieldAlert,
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";

export interface OutstandingPatientDue {
  id: string;
  uhid: string;
  patientName: string;
  phone: string;
  doctorName: string;
  department: string;
  admissionDate: string;
  dischargeDate?: string;
  totalBill: number;
  advancePaid: number;
  balanceDue: number;
  daysPending: number;
  status: "CRITICAL_DUE" | "MODERATE" | "CLEARED";
  lastNoticeSent?: string;
}

const INITIAL_DUES: OutstandingPatientDue[] = [
  {
    id: "due-1",
    uhid: "UHID-APEX-2026-104921",
    patientName: "Meenakshi Sundaram",
    phone: "9849012345",
    doctorName: "Dr. S. Reddy",
    department: "Cardiology",
    admissionDate: "18 Oct 2026",
    totalBill: 75000,
    advancePaid: 25000,
    balanceDue: 50000,
    daysPending: 10,
    status: "CRITICAL_DUE",
    lastNoticeSent: "26 Oct 2026",
  },
  {
    id: "due-2",
    uhid: "UHID-APEX-2026-104922",
    patientName: "Rajendra Prasad",
    phone: "9876543210",
    doctorName: "Dr. A. Rao",
    department: "Orthopedics",
    admissionDate: "22 Oct 2026",
    totalBill: 45000,
    advancePaid: 15000,
    balanceDue: 30000,
    daysPending: 6,
    status: "CRITICAL_DUE",
  },
  {
    id: "due-3",
    uhid: "UHID-APEX-2026-104923",
    patientName: "Farida Begum",
    phone: "9700112233",
    doctorName: "Dr. P. Nair",
    department: "Gynecology",
    admissionDate: "25 Oct 2026",
    totalBill: 32000,
    advancePaid: 20000,
    balanceDue: 12000,
    daysPending: 3,
    status: "MODERATE",
  },
  {
    id: "due-4",
    uhid: "UHID-APEX-2026-104924",
    patientName: "Gopal Krishna",
    phone: "9123456780",
    doctorName: "Dr. K. Sharma",
    department: "General Medicine",
    admissionDate: "27 Oct 2026",
    totalBill: 18000,
    advancePaid: 10000,
    balanceDue: 8000,
    daysPending: 1,
    status: "MODERATE",
  },
];

interface OutstandingDuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutstandingDuesModal: React.FC<OutstandingDuesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentTenant } = useTenant();
  const [duesList, setDuesList] = useState<OutstandingPatientDue[]>(INITIAL_DUES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDue, setSelectedDue] = useState<OutstandingPatientDue | null>(null);

  // Settlement Form State
  const [settleAmount, setSettleAmount] = useState<number>(0);
  const [settleMode, setSettleMode] = useState<"UPI" | "Cash" | "Card">("UPI");
  const [upiUtr, setUpiUtr] = useState("");
  const [notificationSentMsg, setNotificationSentMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalOutstanding = duesList.reduce((sum, d) => sum + d.balanceDue, 0);
  const criticalCount = duesList.filter((d) => d.status === "CRITICAL_DUE").length;

  const filteredDues = duesList.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.patientName.toLowerCase().includes(q) ||
      d.uhid.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.doctorName.toLowerCase().includes(q)
    );
  });

  const handleSendReminder = (due: OutstandingPatientDue) => {
    const msg = `Automated Payment Reminder sent to ${due.patientName} (${due.phone}) and CC: ${due.doctorName} for balance of ₹${due.balanceDue.toLocaleString("en-IN")}.`;
    setNotificationSentMsg(msg);
    setDuesList((prev) =>
      prev.map((item) =>
        item.id === due.id
          ? {
              ...item,
              lastNoticeSent: new Date().toLocaleDateString("en-IN"),
            }
          : item
      )
    );
    setTimeout(() => setNotificationSentMsg(null), 4000);
  };

  const handleSettleDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDue || !settleAmount || settleAmount <= 0) return;

    const remaining = Math.max(0, selectedDue.balanceDue - settleAmount);

    setDuesList((prev) =>
      prev.map((item) =>
        item.id === selectedDue.id
          ? {
              ...item,
              advancePaid: item.advancePaid + settleAmount,
              balanceDue: remaining,
              status: remaining === 0 ? "CLEARED" : item.status,
            }
          : item
      )
    );

    setNotificationSentMsg(
      `Payment of ₹${settleAmount.toLocaleString("en-IN")} recorded via ${settleMode} for ${selectedDue.patientName}! Balance remaining: ₹${remaining.toLocaleString("en-IN")}`
    );
    setSelectedDue(null);
    setSettleAmount(0);
    setUpiUtr("");
    setTimeout(() => setNotificationSentMsg(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Patient Outstanding Balance Tracking &amp; Automated Recovery
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {criticalCount} Overdue Alerts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Inpatient and OPD unsettled patient balances, automatic doctor &amp; admin notification dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success / Notification Banner */}
        {notificationSentMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationSentMsg}</span>
          </div>
        )}

        {/* KPI Strip */}
        <div className="p-5 border-b border-slate-100 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Total Outstanding Balance
            </span>
            <span className="font-mono text-xl font-black text-rose-700">
              ₹{totalOutstanding.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              High-Risk Dues (&gt; ₹25,000)
            </span>
            <span className="font-mono text-xl font-black text-amber-700">
              {criticalCount} Patients
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Active Hospital Tenant
            </span>
            <span className="text-xs font-bold text-slate-800 truncate block mt-1">
              {currentTenant.name}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Recovery Action Mode
            </span>
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1 mt-1">
              <Send className="w-3.5 h-3.5" />
              Automated WhatsApp &amp; SMS
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, UHID, Mobile Number, or Attending Doctor..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Dues Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold text-[11px]">
                    <th className="p-3">Patient &amp; UHID</th>
                    <th className="p-3">Doctor &amp; Dept</th>
                    <th className="p-3">Total Invoiced</th>
                    <th className="p-3">Advance Paid</th>
                    <th className="p-3">Pending Balance</th>
                    <th className="p-3">Days Pending</th>
                    <th className="p-3 text-right">Recovery Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDues.map((due) => (
                    <tr
                      key={due.id}
                      className={`hover:bg-slate-50/80 transition ${
                        due.status === "CLEARED" ? "opacity-60 bg-slate-50/40" : ""
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{due.patientName}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {due.uhid} • Ph: {due.phone}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{due.doctorName}</div>
                        <div className="text-[10px] text-slate-500">{due.department}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700">
                        ₹{due.totalBill.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-700">
                        ₹{due.advancePaid.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-sm font-black text-rose-700">
                          ₹{due.balanceDue.toLocaleString("en-IN")}
                        </div>
                        {due.status === "CRITICAL_DUE" && (
                          <span className="inline-block text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mt-0.5">
                            High Priority Due
                          </span>
                        )}
                        {due.status === "CLEARED" && (
                          <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5">
                            Fully Settled
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-slate-600 font-bold">
                          {due.daysPending} days
                        </span>
                        {due.lastNoticeSent && (
                          <div className="text-[9px] text-slate-400">
                            Reminded {due.lastNoticeSent}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {due.balanceDue > 0 ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSendReminder(due)}
                              title="Send WhatsApp & SMS notification to Patient and CC Attending Doctor"
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95"
                            >
                              <Send className="w-3 h-3" />
                              Notify
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDue(due);
                                setSettleAmount(due.balanceDue);
                              }}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 active:scale-95"
                            >
                              <CreditCard className="w-3 h-3" />
                              Settle
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold">Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settle Payment Slide-down Dialog */}
          {selectedDue && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4 animate-in slide-in-from-bottom-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-sm">
                    Record Due Payment Settlement: {selectedDue.patientName}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedDue.uhid} • Total Outstanding: ₹{selectedDue.balanceDue.toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDue(null)}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSettleDue} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Amount to Collect (₹)</label>
                  <input
                    type="number"
                    max={selectedDue.balanceDue}
                    min={1}
                    value={settleAmount || ""}
                    onChange={(e) => setSettleAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Settlement Payment Mode</label>
                  <select
                    value={settleMode}
                    onChange={(e) => setSettleMode(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="UPI">UPI / Digital BharatQR</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>

                {settleMode === "UPI" && (
                  <div>
                    <label className="block text-slate-400 mb-1">12-Digit UPI UTR</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={upiUtr}
                      onChange={(e) => setUpiUtr(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 429188203912"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                )}

                <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedDue(null)}
                    className="px-3.5 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition shadow-md"
                  >
                    Authorize &amp; Post Payment
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
          <span className="font-mono text-[11px]">
            Hospital Audit Engine • Automatic Doctor Balance Tracking Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
