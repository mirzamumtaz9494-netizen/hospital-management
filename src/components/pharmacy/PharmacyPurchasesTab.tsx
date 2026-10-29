"use client";

import React, { useState } from "react";
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  Building2,
  IndianRupee,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  Layers,
} from "lucide-react";
import {
  PharmacyPurchaseOrder,
  GrnReceipt,
  PharmacyVendor,
} from "@/types";
import {
  MOCK_PHARMACY_VENDORS,
  MOCK_GRN_RECEIPTS,
} from "@/data/pharmacyMockData";

interface PharmacyPurchasesTabProps {
  purchaseOrders: PharmacyPurchaseOrder[];
  grnReceipts?: GrnReceipt[];
  vendors?: PharmacyVendor[];
  onCreatePo: () => void;
  onOpenGrnModal: (po: PharmacyPurchaseOrder) => void;
  onPrintPo: (po: PharmacyPurchaseOrder) => void;
  onPrintGrn: (grn: GrnReceipt) => void;
}

export const PharmacyPurchasesTab: React.FC<PharmacyPurchasesTabProps> = ({
  purchaseOrders,
  grnReceipts = MOCK_GRN_RECEIPTS,
  vendors = MOCK_PHARMACY_VENDORS,
  onCreatePo,
  onOpenGrnModal,
  onPrintPo,
  onPrintGrn,
}) => {
  const [subTab, setSubTab] = useState<"pos" | "grns" | "vendors">("pos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPos = purchaseOrders.filter((po) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      po.poNumber.toLowerCase().includes(q) ||
      po.supplierName.toLowerCase().includes(q) ||
      po.status.toLowerCase().includes(q)
    );
  });

  const filteredGrns = grnReceipts.filter((grn) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      grn.grnNumber.toLowerCase().includes(q) ||
      grn.poNumber.toLowerCase().includes(q) ||
      grn.supplierName.toLowerCase().includes(q) ||
      grn.vendorInvoiceNo.toLowerCase().includes(q)
    );
  });

  const totalProcurement = purchaseOrders.reduce(
    (acc, po) => acc + po.totalAmount,
    0
  );

  const totalGrnReceived = grnReceipts.reduce(
    (acc, g) => acc + g.invoiceTotal,
    0
  );

  return (
    <div className="space-y-4">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-teal-700" />
            <span>Monthly Procurement Value</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalProcurement.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">
            Direct Distributor Bulk Margins (18–24%)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Active Purchase Orders</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {purchaseOrders.length} Orders
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {purchaseOrders.filter((p) => p.status === "Order Placed").length} Awaiting Receiving Dock
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Goods Received (GRN) Compliance</span>
          </div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight">
            {grnReceipts.length} GRNs (₹{totalGrnReceived.toLocaleString("en-IN")})
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% 3-Way Match &amp; Batch Auto-Increment
          </div>
        </div>
      </div>

      {/* Sub-Navigation and Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Subtabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
            <button
              onClick={() => setSubTab("pos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                subTab === "pos"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setSubTab("grns")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                subTab === "grns"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              GRN Inward Ledger ({grnReceipts.length})
            </button>
            <button
              onClick={() => setSubTab("vendors")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                subTab === "vendors"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Distributors &amp; C&amp;F ({vendors.length})
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 flex-1 max-w-md md:justify-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO, invoice, distributor..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <button
              onClick={onCreatePo}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Purchase Order
            </button>
          </div>
        </div>

        {/* 1. PURCHASE ORDERS VIEW */}
        {subTab === "pos" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Pharmaceutical Distributor</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Expected Delivery</th>
                  <th className="py-3 px-4">SKU Items</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No purchase orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredPos.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {po.poNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {po.supplierName}
                        </div>
                        {po.vendorGstin && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            GST: {po.vendorGstin}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {po.orderDate}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {po.expectedDate}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {po.itemsCount} SKUs
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-right">
                        ₹{po.totalAmount.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            po.status === "Goods Received (GRN)"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : po.status === "Payment Settled"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintPo(po)}
                            title="Print Official PO Document"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {po.status === "Order Placed" ? (
                            <button
                              onClick={() => onOpenGrnModal(po)}
                              className="px-2.5 py-1 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-[11px] transition shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                              <FileCheck className="w-3 h-3" />
                              Record 3-Way GRN
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                              Stock Updated
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. GOODS RECEIVED NOTES (GRN) LEDGER VIEW */}
        {subTab === "grns" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">GRN Number</th>
                  <th className="py-3 px-4">PO Reference</th>
                  <th className="py-3 px-4">Distributor &amp; Invoice</th>
                  <th className="py-3 px-4">Challan #</th>
                  <th className="py-3 px-4">Received Date</th>
                  <th className="py-3 px-4 text-right">Invoice Total</th>
                  <th className="py-3 px-4 text-center">3-Way Match QC</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No Goods Received Notes recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredGrns.map((grn) => (
                    <tr key={grn.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {grn.grnNumber}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {grn.poNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {grn.supplierName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Inv: {grn.vendorInvoiceNo} ({grn.vendorInvoiceDate})
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {grn.deliveryChallanNo}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {grn.receivedDate}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-right">
                        ₹{grn.invoiceTotal.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            grn.isVarianceDetected
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {grn.isVarianceDetected ? (
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          )}
                          {grn.qcStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onPrintGrn(grn)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-bold transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print GRN Slip
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. DISTRIBUTORS & C&F DIRECTORY VIEW */}
        {subTab === "vendors" && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {v.name}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 inline-block mt-0.5">
                      DL: {v.dlNumber}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {v.activeStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    GSTIN: <strong className="font-mono text-slate-800">{v.gstin}</strong>
                  </div>
                  <div>
                    Contact: <strong>{v.contactPerson}</strong> ({v.phone})
                  </div>
                  <div>
                    Email: <span className="text-teal-700 font-medium">{v.email}</span>
                  </div>
                  <div>
                    Credit Facility: <strong>{v.creditDays} Days</strong> ({v.paymentTerms})
                  </div>
                </div>

                {v.bankDetails && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 font-mono">
                    <div>Bank: {v.bankDetails.bankName}</div>
                    <div>A/C: {v.bankDetails.accountNumber} • IFSC: {v.bankDetails.ifscCode}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
