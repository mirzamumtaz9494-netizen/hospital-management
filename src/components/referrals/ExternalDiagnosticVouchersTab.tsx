"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  Filter,
  Plus,
  Printer,
  FileText,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileUp,
  Download,
  Barcode,
  ExternalLink,
} from "lucide-react";
import {
  ExternalDiagnosticOrder,
  ExternalDiagnosticCenter,
  ExternalOrderStatus,
} from "@/types";

interface ExternalDiagnosticVouchersTabProps {
  orders: ExternalDiagnosticOrder[];
  centers: ExternalDiagnosticCenter[];
  onOpenNewOrderModal: () => void;
  onOpenPrintModal: (order: ExternalDiagnosticOrder, center?: ExternalDiagnosticCenter) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: ExternalOrderStatus) => void;
}

export const ExternalDiagnosticVouchersTab: React.FC<ExternalDiagnosticVouchersTabProps> = ({
  orders,
  centers,
  onOpenNewOrderModal,
  onOpenPrintModal,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCenter, setFilterCenter] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReportOrder, setSelectedReportOrder] = useState<ExternalDiagnosticOrder | null>(null);

  // Filtered orders
  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.referringDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.selectedTests.some((t) => t.testName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCenter = filterCenter === "all" || o.destinationCenterId === filterCenter;
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;

    return matchesSearch && matchesCenter && matchesStatus;
  });

  // Calculate metrics
  const totalReferredValue = orders.reduce((sum, o) => sum + o.totalMrp, 0);
  const totalHospitalShare = orders.reduce((sum, o) => sum + o.hospitalReceivableShare, 0);
  const reportsReceivedCount = orders.filter((o) => o.status === "Report Received" || o.status === "Reconciled").length;
  const pendingCount = orders.filter((o) => o.status === "Voucher Issued" || o.status === "Appointment Booked").length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Referrals</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{orders.length}</h3>
            <p className="text-[11px] text-teal-600 font-medium mt-0.5">External Diagnostic Orders</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Barcode className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Tariff Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalReferredValue.toLocaleString("en-IN")}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Referred Investigation MRP</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital B2B Share</p>
            <h3 className="text-2xl font-black text-emerald-900 mt-1">₹{totalHospitalShare.toLocaleString("en-IN")}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              ~{Math.round((totalHospitalShare / (totalReferredValue || 1)) * 100)}% Institutional Margin
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Results Tracking</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">
              {reportsReceivedCount} / {orders.length}
            </h3>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">{pendingCount} Tests Awaiting Results</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by voucher #, patient, test or center..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCenter}
            onChange={(e) => setFilterCenter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Diagnostic Centers</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.centerName}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Order Statuses</option>
            <option value="Voucher Issued">Voucher Issued</option>
            <option value="Appointment Booked">Appointment Booked</option>
            <option value="Test Completed">Test Completed</option>
            <option value="Report Received">Report Received</option>
            <option value="Reconciled">Reconciled</option>
          </select>

          <button
            onClick={onOpenNewOrderModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            Issue Referral Voucher
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Voucher No</th>
                <th className="py-3.5 px-4">Patient Information</th>
                <th className="py-3.5 px-4">Partner Diagnostic Center</th>
                <th className="py-3.5 px-4">Investigation(s) Requisitioned</th>
                <th className="py-3.5 px-4 text-right">Tariff / Margin</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">B2B Settlement</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No diagnostic vouchers found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const center = centers.find((c) => c.id === order.destinationCenterId);

                  const statusColors = {
                    "Voucher Issued": "bg-slate-100 text-slate-700 border-slate-200",
                    "Appointment Booked": "bg-blue-50 text-blue-700 border-blue-200",
                    "Test Completed": "bg-indigo-50 text-indigo-700 border-indigo-200",
                    "Report Received": "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Reconciled: "bg-teal-50 text-teal-700 border-teal-200",
                  };

                  const paymentColors = {
                    "Pending Center Invoice": "bg-amber-50 text-amber-700 border-amber-200",
                    Verified: "bg-blue-50 text-blue-700 border-blue-200",
                    Settled: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Disputed: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      {/* Voucher # */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {order.voucherNumber}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{order.referralDate}</div>
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{order.patientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {order.uhid} • {order.patientAge}y/{order.patientGender}
                        </div>
                        <div className="text-[10px] text-teal-700">Ref: {order.referringDoctor}</div>
                      </td>

                      {/* Partner Center */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-teal-600" />
                          {order.destinationCenterName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {center?.branch || "Imaging Branch"}
                        </div>
                      </td>

                      {/* Tests */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {order.selectedTests.map((t, idx) => (
                          <div key={idx} className="font-medium text-slate-800 text-[11px] truncate">
                            • {t.testName}
                          </div>
                        ))}
                        <div className="text-[10px] text-slate-400 italic truncate mt-0.5">
                          Indication: {order.clinicalIndication}
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          ₹{order.totalMrp.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold">
                          +₹{order.hospitalReceivableShare.toLocaleString("en-IN")} (Share)
                        </div>
                      </td>

                      {/* Order Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            statusColors[order.status]
                          }`}
                        >
                          <option value="Voucher Issued">Voucher Issued</option>
                          <option value="Appointment Booked">Appointment Booked</option>
                          <option value="Test Completed">Test Completed</option>
                          <option value="Report Received">Report Received</option>
                          <option value="Reconciled">Reconciled</option>
                        </select>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            paymentColors[order.paymentStatus]
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenPrintModal(order, center)}
                            title="Print Barcoded Diagnostic Voucher Slip"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] font-semibold border border-teal-200 transition cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            Print Slip
                          </button>

                          {order.reportAttachmentUrl ? (
                            <button
                              onClick={() => setSelectedReportOrder(order)}
                              title="View Attached Diagnostic Report"
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold border border-indigo-200 transition cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              Report
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedReportOrder(order)}
                              title="Attach External Lab Findings"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            >
                              <FileUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {selectedReportOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  External Diagnostic Report: {selectedReportOrder.voucherNumber}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedReportOrder.patientName} • {selectedReportOrder.destinationCenterName}
                </p>
              </div>
              <button
                onClick={() => setSelectedReportOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Radiologist / Pathologist Impression:</span>
                <p className="text-slate-600 italic">
                  "{selectedReportOrder.reportSummaryNotes || "Report awaiting official transcription from diagnostic partner."}"
                </p>
              </div>

              {selectedReportOrder.reportAttachmentUrl && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span className="font-semibold text-[11px]">Official PDF Report Attached</span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Simulating external PDF download from partner PACS/LIMS server.");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                </div>
              )}
            </div>

            <div className="text-right pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedReportOrder(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
