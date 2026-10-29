"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Building2,
  Calendar,
  Truck,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";
import { PharmacyPurchaseOrder } from "@/types";
import { useTenant } from "@/context/TenantContext";
import { printElement } from "@/lib/printService";

interface PrintPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PharmacyPurchaseOrder | null;
}

export const PrintPurchaseOrderModal: React.FC<PrintPurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const { currentTenant } = useTenant();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    if (!printRef.current) return;
    printElement(printRef.current, `Purchase_Order_${order.poNumber}`);
  };

  const hospitalName = currentTenant?.name || "Apex Care Hospital & Research Centre";
  const hospitalUnit = currentTenant?.unitName || "Tertiary Care Multi-Speciality";
  const hospitalPhone = currentTenant?.contactPhone || "+91 40 2345 6789";
  const hospitalEmail = currentTenant?.contactEmail || "procurement@apexcarehospital.com";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold">
              Official Purchase Order Document: {order.poNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
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
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {hospitalName}
                </h1>
                <p className="text-xs font-semibold text-teal-800">
                  {hospitalUnit} • Central Hospital Pharmacy Store
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Road No. 12, Banjara Hills, Hyderabad, Telangana 500034
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                  <span>DL No: <strong>TS/HYD/20B/48102</strong></span>
                  <span>•</span>
                  <span>GSTIN: <strong>36AAACH1948B1Z0</strong></span>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg text-teal-900 font-bold text-xs uppercase tracking-wider">
                  Purchase Order (PO)
                </div>
                <div className="font-mono text-base font-black text-slate-900 mt-1.5">
                  {order.poNumber}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Date: <strong>{order.orderDate}</strong>
                </div>
              </div>
            </div>

            {/* Vendor & Order Logistics Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Vendor / C&amp;F Distributor Details:
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  {order.supplierName}
                </div>
                {order.vendorGstin && (
                  <div className="text-slate-600">
                    Vendor GSTIN: <strong className="font-mono">{order.vendorGstin}</strong>
                  </div>
                )}
                {order.vendorDlNumber && (
                  <div className="text-slate-600">
                    Drug License: <strong className="font-mono">{order.vendorDlNumber}</strong>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Order &amp; Delivery Logistics:
                </span>
                <div className="text-slate-700">
                  Expected Delivery Date: <strong>{order.expectedDate}</strong>
                </div>
                <div className="text-slate-700">
                  Payment Terms: <strong>{order.paymentTerms || "30 Days Net Credit"}</strong>
                </div>
                <div className="text-slate-700">
                  Receiving Dock: <strong>Basement 1, Central Pharmacy Gate 3</strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine Description / Generic Formula</th>
                    <th className="py-2.5 px-3">Packaging</th>
                    <th className="py-2.5 px-3 text-right">Order Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">GST %</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">
                            {item.medicineName}
                          </div>
                          {item.genericName && (
                            <div className="text-[10px] text-slate-500">
                              {item.genericName}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {item.packSize}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {item.orderedQuantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                          ₹{item.unitCost}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                          {item.gstPercent}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{item.totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-500">
                        {order.itemsCount} Products (Total Procurement: ₹{order.totalAmount.toLocaleString("en-IN")})
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end pt-2">
              <div className="w-64 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Base Value:</span>
                  <span className="font-mono font-bold">
                    ₹{order.subtotal?.toLocaleString("en-IN") || Math.round(order.totalAmount * 0.88).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Input GST (CGST+SGST):</span>
                  <span className="font-mono font-bold text-teal-800">
                    +₹{order.taxAmount?.toLocaleString("en-IN") || Math.round(order.totalAmount * 0.12).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-1.5 border-t border-slate-200">
                  <span>Total Payable Value:</span>
                  <span className="font-mono text-teal-900">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Statutory Terms */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 text-[10px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 uppercase block">
                Statutory Terms &amp; Receiving Instructions:
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Supplied batches must possess minimum 75% residual shelf-life at the time of delivery.</li>
                <li>Original Tax Invoice and triplicate Delivery Challan must accompany the shipment.</li>
                <li>Thermolabile cold-chain items (2°C - 8°C) must be delivered with calibrated temperature data loggers.</li>
              </ul>
            </div>

            {/* Authorization Signatures */}
            <div className="pt-8 flex items-end justify-between border-t border-slate-200 text-xs">
              <div className="text-center space-y-1">
                <div className="w-40 border-b border-slate-400 pb-8"></div>
                <div className="font-bold text-slate-800">Ananya Deshmukh</div>
                <div className="text-[10px] text-slate-500">Head Pharmacist &amp; In-Charge</div>
              </div>

              <div className="text-center space-y-1">
                <div className="w-40 border-b border-slate-400 pb-8"></div>
                <div className="font-bold text-slate-800">Chief Medical Officer</div>
                <div className="text-[10px] text-slate-500">Medical Administration</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
