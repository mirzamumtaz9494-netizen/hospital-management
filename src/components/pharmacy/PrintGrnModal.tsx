"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Building2,
  Calendar,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { GrnReceipt } from "@/types";
import { useTenant } from "@/context/TenantContext";
import { printElement } from "@/lib/printService";

interface PrintGrnModalProps {
  isOpen: boolean;
  onClose: () => void;
  grn: GrnReceipt | null;
}

export const PrintGrnModal: React.FC<PrintGrnModalProps> = ({
  isOpen,
  onClose,
  grn,
}) => {
  const { currentTenant } = useTenant();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !grn) return null;

  const handlePrint = () => {
    if (!printRef.current) return;
    printElement(printRef.current, `Goods_Received_Note_${grn.grnNumber}`);
  };

  const hospitalName = currentTenant?.name || "Apex Care Hospital & Research Centre";
  const hospitalUnit = currentTenant?.unitName || "Tertiary Care Multi-Speciality";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">
              Official Goods Received Note: {grn.grnNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div className="p-6 bg-slate-100 max-h-[80vh] overflow-y-auto">
          <div
            ref={printRef}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mx-auto max-w-[750px] text-slate-900 space-y-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-5">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {hospitalName}
                </h1>
                <p className="text-xs font-semibold text-emerald-800">
                  {hospitalUnit} • Pharmacy Goods Inward Receiving Dock
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Road No. 12, Banjara Hills, Hyderabad, Telangana 500034
                </p>
                <div className="text-[11px] text-slate-500 mt-1">
                  Drug License: <strong>TS/HYD/20B/48102</strong> • GSTIN: <strong>36AAACH1948B1Z0</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  Goods Received Note (GRN)
                </div>
                <div className="font-mono text-base font-black text-slate-900 mt-1.5">
                  {grn.grnNumber}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Received Date: <strong>{grn.receivedDate}</strong>
                </div>
              </div>
            </div>

            {/* 3-Way Match Verification Banner */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              grn.isVarianceDetected
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {grn.isVarianceDetected ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>
                  {grn.isVarianceDetected
                    ? "3-Way Discrepancy Flagged (Variance Noted Below)"
                    : "3-Way Match Reconciled (PO == Challan == Invoice)"}
                </span>
              </div>
              <span className="font-semibold px-2 py-0.5 rounded-full text-[10px] bg-white border">
                Status: {grn.qcStatus}
              </span>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div className="text-slate-600">
                  Distributor: <strong className="text-slate-900">{grn.supplierName}</strong>
                </div>
                <div className="text-slate-600">
                  Tax Invoice #: <strong className="font-mono text-slate-900">{grn.vendorInvoiceNo}</strong>
                </div>
                <div className="text-slate-600">
                  Invoice Date: <strong>{grn.vendorInvoiceDate}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-600">
                  Purchase Order Ref: <strong className="font-mono text-slate-900">{grn.poNumber}</strong>
                </div>
                <div className="text-slate-600">
                  Delivery Challan #: <strong className="font-mono text-slate-900">{grn.deliveryChallanNo}</strong>
                </div>
                <div className="text-slate-600">
                  Received By: <strong>{grn.receivedBy}</strong>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine Description</th>
                    <th className="py-2.5 px-2 text-right">PO Qty</th>
                    <th className="py-2.5 px-2 text-right">Recv'd</th>
                    <th className="py-2.5 px-2 text-right">Accepted</th>
                    <th className="py-2.5 px-3">Batch No</th>
                    <th className="py-2.5 px-3">Expiry</th>
                    <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Line Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grn.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {item.medicineName}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                        {item.orderedQty}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                        {item.receivedQty}
                        {item.freeBonusQty > 0 && (
                          <span className="text-[10px] text-emerald-600 block">
                            +{item.freeBonusQty} free
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-800">
                        {item.acceptedQty + item.freeBonusQty}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {item.manufacturerBatchNo}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {item.expiryDate}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-800">
                        ₹{item.purchaseRate}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{item.totalCost.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total and Discrepancy Note */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
              <div className="text-[11px] text-slate-600 flex-1">
                {grn.varianceNotes && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <strong className="text-amber-900 block mb-0.5">Discrepancy Notes:</strong>
                    <span>{grn.varianceNotes}</span>
                  </div>
                )}
                {grn.stockUpdated && (
                  <div className="text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hospital Pharmacy stock successfully incremented with verified batches.</span>
                  </div>
                )}
              </div>

              <div className="w-64 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-900 font-black text-sm">
                  <span>Verified Invoice Total:</span>
                  <span className="font-mono text-emerald-900">
                    ₹{grn.invoiceTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  Input Tax Credit (ITC) applicable
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 flex items-end justify-between border-t border-slate-200 text-xs">
              <div className="text-center space-y-1">
                <div className="w-36 border-b border-slate-400 pb-8"></div>
                <div className="font-bold text-slate-800">{grn.receivedBy}</div>
                <div className="text-[10px] text-slate-500">Receiving Pharmacist</div>
              </div>

              <div className="text-center space-y-1">
                <div className="w-36 border-b border-slate-400 pb-8"></div>
                <div className="font-bold text-slate-800">Quality Inspection Officer</div>
                <div className="text-[10px] text-slate-500">Drug Quality Assurance</div>
              </div>

              <div className="text-center space-y-1">
                <div className="w-36 border-b border-slate-400 pb-8"></div>
                <div className="font-bold text-slate-800">Ramesh Sharma</div>
                <div className="text-[10px] text-slate-500">Hospital Accountant / Billing Clearance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
