"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Building2,
  FileSpreadsheet,
  Calendar,
  CreditCard,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  DiagnosticSettlement,
  ExternalDiagnosticOrder,
  ExternalDiagnosticCenter,
} from "@/types";

interface B2bSettlementClearinghouseTabProps {
  settlements: DiagnosticSettlement[];
  orders: ExternalDiagnosticOrder[];
  centers: ExternalDiagnosticCenter[];
  onRecordSettlement: (settlement: DiagnosticSettlement) => void;
}

export const B2bSettlementClearinghouseTab: React.FC<B2bSettlementClearinghouseTabProps> = ({
  settlements,
  orders,
  centers,
  onRecordSettlement,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // New settlement form state
  const [newSettleData, setNewSettleData] = useState({
    centerId: centers[0]?.id || "",
    period: "October 2026",
    centerInvoiceNumber: "",
    grossAmount: "",
    hospitalShare: "",
    paymentMode: "NEFT / RTGS" as any,
    transactionReference: "",
  });

  // Calculate high-level financial figures
  const totalReferredGross = orders.reduce((sum, o) => sum + o.totalMrp, 0);
  const totalReceivableShare = orders.reduce((sum, o) => sum + o.hospitalReceivableShare, 0);
  const totalSettledAmount = settlements.reduce((sum, s) => sum + s.amountPaidOrReceived, 0);
  const outstandingReceivable = Math.max(0, totalReceivableShare - totalSettledAmount);

  // Export to CSV helper
  const handleExportCsv = () => {
    const headers = [
      "Settlement Number",
      "Diagnostic Center",
      "Billing Period",
      "Order Count",
      "Gross Billed (INR)",
      "Hospital Share (INR)",
      "Payment Mode",
      "UTR / Transaction Ref",
      "Settlement Date",
      "Status",
    ];

    const rows = settlements.map((s) => [
      s.settlementNumber,
      `"${s.centerName}"`,
      s.period,
      s.totalOrdersCount,
      s.grossBilledAmount,
      s.hospitalShareCalculated,
      s.paymentMode,
      s.transactionReference,
      s.settlementDate,
      s.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `B2B_Diagnostic_Settlements_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitSettlement = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCenter = centers.find((c) => c.id === newSettleData.centerId) || centers[0];
    const gross = Number(newSettleData.grossAmount) || 50000;
    const share = Number(newSettleData.hospitalShare) || gross * (selectedCenter.partnershipTerms.sharePercentage / 100);

    const newSettlement: DiagnosticSettlement = {
      id: `set-${Date.now()}`,
      settlementNumber: `SETTLE-${selectedCenter.centerName.slice(0, 3).toUpperCase()}-2026-${Math.floor(10 + Math.random() * 90)}`,
      centerId: selectedCenter.id,
      centerName: selectedCenter.centerName,
      period: newSettleData.period,
      totalOrdersCount: Math.floor(8 + Math.random() * 12),
      grossBilledAmount: gross,
      hospitalShareCalculated: share,
      centerInvoiceNumber: newSettleData.centerInvoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      amountPaidOrReceived: share,
      paymentMode: newSettleData.paymentMode,
      transactionReference: newSettleData.transactionReference || `NEFT${Date.now().toString().slice(-8)}`,
      settlementDate: new Date().toISOString().split("T")[0],
      status: "Settled",
      verifiedBy: "Finance & Accounts Officer",
    };

    onRecordSettlement(newSettlement);
    setIsRecordModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Tariff Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalReferredGross.toLocaleString("en-IN")}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Total Outbound Investigation Volume</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Share Earned</p>
            <h3 className="text-2xl font-black text-teal-900 mt-1">₹{totalReceivableShare.toLocaleString("en-IN")}</h3>
            <p className="text-[11px] text-teal-600 font-medium mt-0.5">Calculated B2B Revenue Margin</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Settled & Received</p>
            <h3 className="text-2xl font-black text-emerald-900 mt-1">₹{totalSettledAmount.toLocaleString("en-IN")}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Bank Reconciled via UTR</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance Receivable</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">₹{outstandingReceivable.toLocaleString("en-IN")}</h3>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Pending Partner Payout</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by settlement #, center, invoice or UTR..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export Settlement CSV
          </button>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Record Partner Settlement
          </button>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Settlement Ref #</th>
                <th className="py-3.5 px-4">Partner Diagnostic Center</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4 text-center">Referrals Count</th>
                <th className="py-3.5 px-4 text-right">Gross Volume</th>
                <th className="py-3.5 px-4 text-right">Hospital Share</th>
                <th className="py-3.5 px-4">Payment Mode & UTR</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {s.settlementNumber}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Inv: {s.centerInvoiceNumber}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      {s.centerName}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {s.period}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {s.totalOrdersCount}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    ₹{s.grossBilledAmount.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                    ₹{s.hospitalShareCalculated.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{s.paymentMode}</div>
                    <div className="text-[10px] font-mono text-slate-400">UTR: {s.transactionReference}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {s.settlementDate}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Settlement Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Record B2B Diagnostic Partner Settlement</h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitSettlement} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Partner Diagnostic Center *
                </label>
                <select
                  value={newSettleData.centerId}
                  onChange={(e) => setNewSettleData({ ...newSettleData, centerId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                >
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.centerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Reconciliation Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSettleData.period}
                    onChange={(e) => setNewSettleData({ ...newSettleData, period: e.target.value })}
                    placeholder="e.g. October 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Center Invoice / Statement #
                  </label>
                  <input
                    type="text"
                    required
                    value={newSettleData.centerInvoiceNumber}
                    onChange={(e) => setNewSettleData({ ...newSettleData, centerInvoiceNumber: e.target.value })}
                    placeholder="e.g. VDC-INV-2026-9041"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Gross Investigation Volume (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newSettleData.grossAmount}
                    onChange={(e) => setNewSettleData({ ...newSettleData, grossAmount: e.target.value })}
                    placeholder="85000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hospital Share Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newSettleData.hospitalShare}
                    onChange={(e) => setNewSettleData({ ...newSettleData, hospitalShare: e.target.value })}
                    placeholder="17000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-teal-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Settlement Mode
                  </label>
                  <select
                    value={newSettleData.paymentMode}
                    onChange={(e) => setNewSettleData({ ...newSettleData, paymentMode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                  >
                    <option value="NEFT / RTGS">NEFT / RTGS Bank Transfer</option>
                    <option value="UPI">UPI Direct</option>
                    <option value="Cheque">Corporate Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Bank UTR / Transaction No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSettleData.transactionReference}
                    onChange={(e) => setNewSettleData({ ...newSettleData, transactionReference: e.target.value })}
                    placeholder="e.g. HDFC0094182904"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
