"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Calculator,
  IndianRupee,
  QrCode,
  FileText,
  User,
  Clock,
  Sparkles,
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import {
  DenominationBreakdown,
  calculatePhysicalCash,
  validateUpiUtr,
  generateShiftZReport,
  CashierShiftReport,
  ShiftTransaction,
} from "@/lib/reconciliationService";

interface ShiftReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions?: any[];
  onShiftReconciled?: (report: CashierShiftReport) => void;
}

export const ShiftReconciliationModal: React.FC<ShiftReconciliationModalProps> = ({
  isOpen,
  onClose,
  transactions = [],
  onShiftReconciled,
}) => {
  const { currentTenant } = useTenant();

  // Mode: "FORM" to input counts and reconcile, "Z_REPORT" to view/print official report
  const [viewMode, setViewMode] = useState<"FORM" | "Z_REPORT">("FORM");
  const [generatedReport, setGeneratedReport] = useState<CashierShiftReport | null>(null);

  // Cashier & Terminal Details
  const [cashierName, setCashierName] = useState("Ramesh Sharma (Counter 1)");
  const [terminalStation, setTerminalStation] = useState("POS-COUNTER-01");
  const [supervisorName, setSupervisorName] = useState("Anita Deshmukh (Chief Auditor)");
  const [shiftNotes, setShiftNotes] = useState("");

  // Physical Denominations
  const [denominations, setDenominations] = useState<DenominationBreakdown>({
    d500: 180,
    d200: 120,
    d100: 210,
    d50: 160,
    d20: 80,
    d10: 60,
    dCoins: 600,
  });

  // Shift start time
  const openedAt = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() - 8);
    return d.toISOString();
  }, []);

  // Prepare normalized shift transactions
  const shiftTxns: ShiftTransaction[] = useMemo(() => {
    if (transactions && transactions.length > 0) {
      return transactions.map((t, idx) => ({
        id: t.id || `tx-${idx}`,
        invoice_number: t.voucherNo || t.refNumber || `INV-${idx + 1000}`,
        patient_name: t.patientOrVendor || "General Patient",
        uhid: `UHID-APEX-2026-${100000 + idx}`,
        payment_mode:
          t.paymentMode === "UPI" || t.paymentMode === "Cash" || t.paymentMode === "Card"
            ? t.paymentMode
            : "Cash",
        amount: Number(t.amount) || 0,
        upi_utr_ref: t.refNumber?.replace(/\D/g, "").padStart(12, "4") || "429188203912",
        timestamp: t.timestamp || "Today",
      }));
    }

    // Default mock shift transactions if none provided
    return [
      {
        id: "tx-1",
        invoice_number: "VCH-2026-8910",
        patient_name: "Rajesh Kumar",
        uhid: "UHID-APEX-2026-102910",
        payment_mode: "Cash",
        amount: 85000,
        timestamp: "09:30 AM",
      },
      {
        id: "tx-2",
        invoice_number: "VCH-2026-8911",
        patient_name: "Sunita Verma",
        uhid: "UHID-APEX-2026-102911",
        payment_mode: "Cash",
        amount: 60200,
        timestamp: "10:15 AM",
      },
      {
        id: "tx-3",
        invoice_number: "VCH-2026-8912",
        patient_name: "Amit Patel",
        uhid: "UHID-APEX-2026-102912",
        payment_mode: "UPI",
        amount: 35000,
        upi_utr_ref: "429188203912",
        timestamp: "11:45 AM",
      },
      {
        id: "tx-4",
        invoice_number: "VCH-2026-8913",
        patient_name: "Priya Sharma",
        uhid: "UHID-APEX-2026-102913",
        payment_mode: "UPI",
        amount: 24500,
        upi_utr_ref: "429188203915",
        timestamp: "01:20 PM",
      },
      {
        id: "tx-5",
        invoice_number: "VCH-2026-8914",
        patient_name: "Vikram Malhotra",
        uhid: "UHID-APEX-2026-102914",
        payment_mode: "Card",
        amount: 45000,
        timestamp: "03:10 PM",
      },
    ];
  }, [transactions]);

  // UPI UTR states for editable reconciliation
  const [upiUtrs, setUpiUtrs] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    shiftTxns.forEach((tx) => {
      if (tx.payment_mode === "UPI") {
        map[tx.id] = tx.upi_utr_ref || "429188203912";
      }
    });
    return map;
  });

  const physicalCash = useMemo(() => calculatePhysicalCash(denominations), [denominations]);

  const systemCash = useMemo(() => {
    return shiftTxns
      .filter((t) => t.payment_mode === "Cash")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [shiftTxns]);

  const totalUpi = useMemo(() => {
    return shiftTxns
      .filter((t) => t.payment_mode === "UPI")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [shiftTxns]);

  const variance = physicalCash - systemCash;

  if (!isOpen) return null;

  const handleDenominationChange = (field: keyof DenominationBreakdown, val: string) => {
    const parsed = parseInt(val, 10);
    setDenominations((prev) => ({
      ...prev,
      [field]: isNaN(parsed) ? 0 : Math.max(0, parsed),
    }));
  };

  const handleUpiUtrChange = (txId: string, val: string) => {
    setUpiUtrs((prev) => ({
      ...prev,
      [txId]: val.replace(/\D/g, "").slice(0, 12),
    }));
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify UPI UTRs
    const upiList = shiftTxns.filter((t) => t.payment_mode === "UPI");
    for (const tx of upiList) {
      const utr = upiUtrs[tx.id] || "";
      const validation = validateUpiUtr(utr);
      if (!validation.valid) {
        alert(`Validation Error on ${tx.invoice_number} (${tx.patient_name}): ${validation.error}`);
        return;
      }
    }

    const report = generateShiftZReport(
      shiftTxns,
      denominations,
      cashierName,
      terminalStation,
      currentTenant.id,
      openedAt,
      supervisorName,
      shiftNotes
    );

    setGeneratedReport(report);
    setViewMode("Z_REPORT");
    if (onShiftReconciled) {
      onShiftReconciled(report);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Automated Cash &amp; UPI Shift Reconciliation
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 text-teal-800 border border-teal-300">
                  DAY-END Z-REPORT
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Physical drawer denomination tally, 12-digit UPI UTR verification, and cashier handover
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

        {/* View Switcher Bar (No Print) */}
        <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white no-print text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Active Terminal:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {terminalStation}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-500">Cashier:</span>
            <span className="font-bold text-slate-900">{cashierName}</span>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === "Z_REPORT" && (
              <>
                <button
                  onClick={() => setViewMode("FORM")}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition"
                >
                  Edit Counts
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Official Z-Report
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          {viewMode === "FORM" ? (
            <form onSubmit={handleGenerateReport} className="space-y-6">
              {/* SECTION A: Real-Time Cash Drawer Variance Header */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  variance === 0
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : variance > 0
                    ? "bg-amber-50 border-amber-300 text-amber-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                        variance === 0
                          ? "bg-emerald-500/20 text-emerald-700"
                          : variance > 0
                          ? "bg-amber-500/20 text-amber-700"
                          : "bg-rose-500/20 text-rose-700"
                      }`}
                    >
                      {variance === 0 ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <AlertTriangle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                        {variance === 0
                          ? "PERFECT CASH RECONCILIATION - EXACT MATCH"
                          : variance > 0
                          ? "DRAWER SURPLUS DETECTED"
                          : "DRAWER CASH SHORTAGE DETECTED"}
                        <span className="font-mono text-xs px-2 py-0.5 rounded font-black bg-white/80 border">
                          Variance: {variance >= 0 ? `+₹${variance.toLocaleString("en-IN")}` : `-₹${Math.abs(variance).toLocaleString("en-IN")}`}
                        </span>
                      </div>
                      <p className="text-xs opacity-90 mt-0.5">
                        {variance === 0
                          ? "Physical cash counted in the drawer precisely equals system-invoiced receipts."
                          : variance > 0
                          ? "Excess cash found in drawer. Excess will be deposited to hospital petty reserves."
                          : "Physical cash is less than registered invoices. Cashier explanation required."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        System Expected
                      </span>
                      <span className="font-mono text-base font-black text-slate-900">
                        ₹{systemCash.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="border-l pl-4 border-slate-300">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Physical Counted
                      </span>
                      <span className="font-mono text-base font-black text-slate-900">
                        ₹{physicalCash.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: Cash Denomination Counter */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-teal-600" />
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Physical Cash Drawer Denomination Counter
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Drawer Total: ₹{physicalCash.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs">
                  {/* ₹500 */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>₹500 Note</span>
                      <span className="font-mono text-slate-500">
                        ₹{((denominations.d500 || 0) * 500).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={denominations.d500 || ""}
                      onChange={(e) => handleDenominationChange("d500", e.target.value)}
                      placeholder="Count"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  {/* ₹200 */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>₹200 Note</span>
                      <span className="font-mono text-slate-500">
                        ₹{((denominations.d200 || 0) * 200).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={denominations.d200 || ""}
                      onChange={(e) => handleDenominationChange("d200", e.target.value)}
                      placeholder="Count"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  {/* ₹100 */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>₹100 Note</span>
                      <span className="font-mono text-slate-500">
                        ₹{((denominations.d100 || 0) * 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={denominations.d100 || ""}
                      onChange={(e) => handleDenominationChange("d100", e.target.value)}
                      placeholder="Count"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  {/* ₹50 */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>₹50 Note</span>
                      <span className="font-mono text-slate-500">
                        ₹{((denominations.d50 || 0) * 50).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={denominations.d50 || ""}
                      onChange={(e) => handleDenominationChange("d50", e.target.value)}
                      placeholder="Count"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  {/* ₹20 */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>₹20 Note</span>
                      <span className="font-mono text-slate-500">
                        ₹{((denominations.d20 || 0) * 20).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={denominations.d20 || ""}
                      onChange={(e) => handleDenominationChange("d20", e.target.value)}
                      placeholder="Count"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  {/* ₹10 */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>₹10 Note</span>
                      <span className="font-mono text-slate-500">
                        ₹{((denominations.d10 || 0) * 10).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={denominations.d10 || ""}
                      onChange={(e) => handleDenominationChange("d10", e.target.value)}
                      placeholder="Count"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  {/* Coins */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Coins</span>
                      <span className="font-mono text-slate-500">
                        ₹{(denominations.dCoins || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={denominations.dCoins || ""}
                      onChange={(e) => handleDenominationChange("dCoins", e.target.value)}
                      placeholder="Total ₹"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Digital UPI UTR Reconciliation Ledger */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Digital UPI Receipts &amp; Bank UTR Verification
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700">
                    Total UPI Settled: ₹{totalUpi.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                        <th className="pb-2">Invoice / Ref</th>
                        <th className="pb-2">Patient Name</th>
                        <th className="pb-2">Time</th>
                        <th className="pb-2 text-right">Amount</th>
                        <th className="pb-2 pl-4">12-Digit Bank UTR (Required)</th>
                        <th className="pb-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {shiftTxns
                        .filter((t) => t.payment_mode === "UPI")
                        .map((tx) => {
                          const currentUtr = upiUtrs[tx.id] || "";
                          const check = validateUpiUtr(currentUtr);
                          return (
                            <tr key={tx.id} className="hover:bg-slate-50">
                              <td className="py-2.5 font-mono font-bold text-slate-800">
                                {tx.invoice_number}
                              </td>
                              <td className="py-2.5 text-slate-900 font-bold">
                                {tx.patient_name}
                              </td>
                              <td className="py-2.5 text-slate-500">{tx.timestamp}</td>
                              <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                                ₹{tx.amount.toLocaleString("en-IN")}
                              </td>
                              <td className="py-2.5 pl-4">
                                <input
                                  type="text"
                                  maxLength={12}
                                  value={currentUtr}
                                  onChange={(e) => handleUpiUtrChange(tx.id, e.target.value)}
                                  placeholder="12-digit UTR"
                                  className={`font-mono text-xs px-2.5 py-1 rounded-lg border focus:outline-none ${
                                    check.valid
                                      ? "border-emerald-300 bg-emerald-50/50 text-emerald-950"
                                      : "border-rose-300 bg-rose-50/50 text-rose-950"
                                  }`}
                                />
                              </td>
                              <td className="py-2.5 text-center">
                                {check.valid ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Invalid UTR
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION D: Shift Handover Sign-off */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Cashier Name &amp; Terminal
                  </label>
                  <input
                    type="text"
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Accounts Supervisor / Auditor
                  </label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">
                    Cashier Shift Notes / Discrepancy Reason (if any)
                  </label>
                  <textarea
                    rows={2}
                    value={shiftNotes}
                    onChange={(e) => setShiftNotes(e.target.value)}
                    placeholder="Enter reason for any shortage/surplus, petty cash disbursements, or drawer handover details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Generate &amp; Lock Official Z-Report
                </button>
              </div>
            </form>
          ) : (
            /* PRINTABLE Z-REPORT VIEW */
            generatedReport && (
              <div className="space-y-4">
                {/* Official Printable Z-Report Sheet */}
                <div className="print-z-report max-w-2xl mx-auto bg-white p-8 border border-slate-300 rounded-2xl shadow-xl font-sans text-xs text-slate-900 space-y-5">
                  {/* Hospital & Report Header */}
                  <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
                    <div>
                      <div className="text-lg font-black uppercase tracking-tight text-slate-900">
                        {currentTenant.name}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {currentTenant.unitName} • Hospital Accounts Department
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        GSTIN: 36AAAAA0000A1Z5 • Terminal: {generatedReport.terminal_station}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block border-2 border-slate-900 px-3 py-1 font-mono text-xs font-black uppercase tracking-wider">
                        SHIFT Z-REPORT
                      </span>
                      <div className="font-mono text-xs font-bold text-slate-800 mt-1">
                        {generatedReport.shift_id}
                      </div>
                    </div>
                  </div>

                  {/* Shift Metadata */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 uppercase font-bold text-[9px] block">
                        Shift Opened
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {new Date(generatedReport.opened_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase font-bold text-[9px] block">
                        Shift Closed
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {new Date(generatedReport.closed_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase font-bold text-[9px] block">
                        Cashier
                      </span>
                      <span className="font-bold text-slate-900 truncate block">
                        {generatedReport.cashier_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase font-bold text-[9px] block">
                        Supervisor
                      </span>
                      <span className="font-bold text-slate-900 truncate block">
                        {generatedReport.supervisor_name || "Verified"}
                      </span>
                    </div>
                  </div>

                  {/* Financial Settlement Breakdown */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-900 text-white font-bold px-3 py-1.5 text-[11px] uppercase tracking-wider">
                      Settlement Collections Ledger
                    </div>
                    <div className="p-3 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Physical Cash Counted in Drawer:</span>
                        <span className="font-mono font-black text-slate-900">
                          ₹{generatedReport.physical_cash_counted.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">System Expected Invoiced Cash:</span>
                        <span className="font-mono font-bold text-slate-700">
                          ₹{generatedReport.system_expected_cash.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Cash Variance (Discrepancy):</span>
                        <span
                          className={`font-mono font-black ${
                            generatedReport.cash_variance === 0
                              ? "text-emerald-700"
                              : generatedReport.cash_variance > 0
                              ? "text-amber-700"
                              : "text-rose-700"
                          }`}
                        >
                          {generatedReport.cash_variance >= 0
                            ? `+₹${generatedReport.cash_variance.toLocaleString("en-IN")}`
                            : `-₹${Math.abs(generatedReport.cash_variance).toLocaleString("en-IN")}`}{" "}
                          ({generatedReport.variance_status})
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">
                          Digital UPI Collections ({generatedReport.upi_txn_count} txns):
                        </span>
                        <span className="font-mono font-bold text-blue-700">
                          ₹{generatedReport.total_upi_amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Card POS Swipes:</span>
                        <span className="font-mono font-bold text-purple-700">
                          ₹{generatedReport.total_card_amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 font-black text-sm text-slate-900 bg-slate-50 px-2 rounded-lg">
                        <span>Gross Shift Collections:</span>
                        <span className="font-mono text-teal-800 text-base">
                          ₹{generatedReport.total_gross_collections.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Denominations Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                    <div className="bg-slate-100 font-bold px-3 py-1 text-slate-700 uppercase tracking-wider text-[10px]">
                      Cash Drawer Denomination Audit
                    </div>
                    <div className="p-3 grid grid-cols-4 gap-2 font-mono">
                      <div>₹500 × {generatedReport.denominations.d500} = ₹{(generatedReport.denominations.d500 * 500).toLocaleString("en-IN")}</div>
                      <div>₹200 × {generatedReport.denominations.d200} = ₹{(generatedReport.denominations.d200 * 200).toLocaleString("en-IN")}</div>
                      <div>₹100 × {generatedReport.denominations.d100} = ₹{(generatedReport.denominations.d100 * 100).toLocaleString("en-IN")}</div>
                      <div>₹50 × {generatedReport.denominations.d50} = ₹{(generatedReport.denominations.d50 * 50).toLocaleString("en-IN")}</div>
                      <div>₹20 × {generatedReport.denominations.d20} = ₹{(generatedReport.denominations.d20 * 20).toLocaleString("en-IN")}</div>
                      <div>₹10 × {generatedReport.denominations.d10} = ₹{(generatedReport.denominations.d10 * 10).toLocaleString("en-IN")}</div>
                      <div>Coins = ₹{generatedReport.denominations.dCoins.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                    <div>
                      <div className="border-b border-dashed border-slate-400 pb-8 font-serif italic text-slate-500">
                        {generatedReport.cashier_name}
                      </div>
                      <span className="font-bold text-slate-700 block mt-1">
                        Handing-Over Cashier Signature
                      </span>
                    </div>
                    <div>
                      <div className="border-b border-dashed border-slate-400 pb-8 font-serif italic text-slate-500">
                        {generatedReport.supervisor_name}
                      </div>
                      <span className="font-bold text-slate-700 block mt-1">
                        Accounts Supervisor / Auditor Signature
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
