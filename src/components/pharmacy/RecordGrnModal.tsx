"use client";

import React, { useState } from "react";
import {
  X,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  PharmacyPurchaseOrder,
  GrnReceipt,
  GrnLineItem,
  MedicineItem,
} from "@/types";

interface RecordGrnModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PharmacyPurchaseOrder | null;
  onConfirmGrn: (grn: GrnReceipt, shouldAutoIncrementStock: boolean) => void;
}

export const RecordGrnModal: React.FC<RecordGrnModalProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
  onConfirmGrn,
}) => {
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState("");
  const [vendorInvoiceDate, setVendorInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deliveryChallanNo, setDeliveryChallanNo] = useState("");
  const [receivedDate, setReceivedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [receivedBy, setReceivedBy] = useState("Ananya Deshmukh (Head Pharmacist)");
  const [varianceNotes, setVarianceNotes] = useState("");
  const [autoIncrementStock, setAutoIncrementStock] = useState(true);

  // Initialize line items from PO
  const [grnItems, setGrnItems] = useState<GrnLineItem[]>(() => {
    if (!purchaseOrder?.items) {
      return [
        {
          id: "grn-item-1",
          medicineId: "med-1",
          medicineName: "Augmentin 625 Duo Tablet",
          orderedQty: 100,
          receivedQty: 100,
          freeBonusQty: 5,
          rejectedQty: 0,
          acceptedQty: 100,
          manufacturerBatchNo: "AUG-26K091",
          expiryDate: "09/2028",
          purchaseRate: 145,
          agreedPoRate: 145,
          mrp: 204,
          gstPercent: 12,
          totalCost: 145 * 100 * 1.12,
        },
      ];
    }
    return purchaseOrder.items.map((pi, idx) => ({
      id: `grn-item-${idx}`,
      medicineId: pi.medicineId,
      medicineName: pi.medicineName,
      orderedQty: pi.orderedQuantity,
      receivedQty: pi.orderedQuantity,
      freeBonusQty: Math.floor(pi.orderedQuantity / 20), // default 20+1 scheme
      rejectedQty: 0,
      acceptedQty: pi.orderedQuantity,
      manufacturerBatchNo: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: "12/2028",
      purchaseRate: pi.unitCost,
      agreedPoRate: pi.unitCost,
      mrp: Math.round(pi.unitCost * 1.35),
      gstPercent: pi.gstPercent || 12,
      totalCost: pi.totalAmount,
    }));
  });

  if (!isOpen || !purchaseOrder) return null;

  const handleItemFieldChange = (
    id: string,
    field: keyof GrnLineItem,
    value: any
  ) => {
    setGrnItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (
            field === "receivedQty" ||
            field === "rejectedQty" ||
            field === "purchaseRate" ||
            field === "gstPercent"
          ) {
            updated.acceptedQty = Math.max(
              0,
              updated.receivedQty - (updated.rejectedQty || 0)
            );
            const base = updated.acceptedQty * updated.purchaseRate;
            const tax = base * (updated.gstPercent / 100);
            updated.totalCost = Math.round(base + tax);
            updated.hasPriceVariance =
              updated.purchaseRate !== updated.agreedPoRate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  // 3-Way Match Variance Check
  const hasQuantityVariance = grnItems.some(
    (item) => item.acceptedQty !== item.orderedQty
  );
  const hasPriceVariance = grnItems.some(
    (item) => item.purchaseRate !== item.agreedPoRate
  );
  const isVarianceDetected = hasQuantityVariance || hasPriceVariance;

  const totalInvoiceAmount = grnItems.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorInvoiceNo.trim()) {
      alert("Please provide the Vendor Tax Invoice Number for 3-way matching.");
      return;
    }

    const grnNumber = `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrn: GrnReceipt = {
      id: `grn-${Date.now()}`,
      grnNumber,
      poId: purchaseOrder.id,
      poNumber: purchaseOrder.poNumber,
      vendorId: purchaseOrder.vendorId || "vnd-01",
      supplierName: purchaseOrder.supplierName,
      vendorInvoiceNo: vendorInvoiceNo.trim(),
      vendorInvoiceDate,
      deliveryChallanNo: deliveryChallanNo.trim() || `DC-${Date.now().toString().slice(-5)}`,
      receivedDate,
      receivedBy,
      items: grnItems,
      invoiceTotal: Math.round(totalInvoiceAmount),
      isVarianceDetected,
      varianceNotes: isVarianceDetected
        ? varianceNotes || "Variance acknowledged during receiving dock inspection."
        : undefined,
      qcStatus: isVarianceDetected ? "Partial Discrepancy" : "Verified & Accepted",
      stockUpdated: autoIncrementStock,
      createdAt: new Date().toISOString(),
    };

    onConfirmGrn(newGrn, autoIncrementStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
              <FileCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">
                  Record Goods Received Note (3-Way GRN Match)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-200 border border-teal-500/40 font-mono">
                  {purchaseOrder.poNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Vendor: <strong>{purchaseOrder.supplierName}</strong> • Reconcile PO vs Delivery Challan vs Vendor Invoice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 3-Way Reconciliation Status Banner */}
          {isVarianceDetected ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold">
                  3-Way Discrepancy Flagged: Variance Detected
                </div>
                <p className="text-amber-800 text-[11px]">
                  {hasQuantityVariance && "• Physical received count differs from PO ordered quantity. "}
                  {hasPriceVariance && "• Vendor invoice rate differs from agreed PO unit cost."}
                  {" "}An inspection audit note will be logged alongside this GRN.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">
                  3-Way Match Reconciled: 100% Compliant
                </span>
                <span className="text-emerald-700 ml-2">
                  (PO Ordered == Physical Delivery Challan == Vendor Invoice Rates)
                </span>
              </div>
            </div>
          )}

          {/* Receiving Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vendor Tax Invoice Number *
              </label>
              <input
                type="text"
                required
                value={vendorInvoiceNo}
                onChange={(e) => setVendorInvoiceNo(e.target.value)}
                placeholder="e.g. INV-SUN-88419"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Vendor Invoice Date *
              </label>
              <input
                type="date"
                required
                value={vendorInvoiceDate}
                onChange={(e) => setVendorInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Delivery Challan (DC) #
              </label>
              <input
                type="text"
                value={deliveryChallanNo}
                onChange={(e) => setDeliveryChallanNo(e.target.value)}
                placeholder="e.g. DC-SUN-4412"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Inspected &amp; Received By
              </label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>
          </div>

          {/* Line Items Receiving & Batch Intake Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Dock Physical Receiving &amp; Batch Intake ({grnItems.length} Products)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Verify manufacturer batch &amp; expiry on carton labels
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Medicine SKU</th>
                      <th className="py-2.5 px-2 text-right">PO Ordered</th>
                      <th className="py-2.5 px-2 text-right">Received</th>
                      <th className="py-2.5 px-2 text-right">Bonus Free</th>
                      <th className="py-2.5 px-2 text-right">Rejected</th>
                      <th className="py-2.5 px-2 text-right">Accepted (Stock+)</th>
                      <th className="py-2.5 px-3">Batch No *</th>
                      <th className="py-2.5 px-3">Expiry *</th>
                      <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                      <th className="py-2.5 px-3 text-right">Line Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grnItems.map((item) => {
                      const isQtyDiff = item.acceptedQty !== item.orderedQty;
                      const isPriceDiff = item.purchaseRate !== item.agreedPoRate;

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/50 ${
                            isQtyDiff || isPriceDiff ? "bg-amber-50/30" : ""
                          }`}
                        >
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            <div>{item.medicineName}</div>
                            {isPriceDiff && (
                              <div className="text-[10px] text-amber-700 font-bold">
                                Agreed PO Rate: ₹{item.agreedPoRate}
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-2 text-right font-mono text-slate-500 font-bold">
                            {item.orderedQty}
                          </td>

                          <td className="py-2.5 px-2 text-right">
                            <input
                              type="number"
                              min={0}
                              value={item.receivedQty}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "receivedQty",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-1.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-right text-slate-900"
                            />
                          </td>

                          <td className="py-2.5 px-2 text-right">
                            <input
                              type="number"
                              min={0}
                              value={item.freeBonusQty}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "freeBonusQty",
                                  Number(e.target.value)
                                )
                              }
                              className="w-14 px-1.5 py-1 bg-white border border-slate-300 rounded font-mono text-right text-emerald-700 font-bold"
                            />
                          </td>

                          <td className="py-2.5 px-2 text-right">
                            <input
                              type="number"
                              min={0}
                              value={item.rejectedQty}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "rejectedQty",
                                  Number(e.target.value)
                                )
                              }
                              className="w-14 px-1.5 py-1 bg-white border border-slate-300 rounded font-mono text-right text-red-600 font-bold"
                            />
                          </td>

                          <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-800">
                            +{item.acceptedQty + item.freeBonusQty}
                          </td>

                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              required
                              value={item.manufacturerBatchNo}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "manufacturerBatchNo",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. B-26K09"
                              className="w-24 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-slate-900"
                            />
                          </td>

                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              required
                              value={item.expiryDate}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "expiryDate",
                                  e.target.value
                                )
                              }
                              placeholder="MM/YYYY"
                              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs text-slate-900"
                            />
                          </td>

                          <td className="py-2.5 px-2 text-right">
                            <input
                              type="number"
                              step="0.1"
                              value={item.purchaseRate}
                              onChange={(e) =>
                                handleItemFieldChange(
                                  item.id,
                                  "purchaseRate",
                                  Number(e.target.value)
                                )
                              }
                              className={`w-18 px-1.5 py-1 bg-white border rounded font-mono font-bold text-right ${
                                isPriceDiff
                                  ? "border-amber-400 text-amber-800"
                                  : "border-slate-300 text-slate-900"
                              }`}
                            />
                          </td>

                          <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                            ₹{item.totalCost.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Variance Notes if detected */}
          {isVarianceDetected && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Discrepancy / Variance Audit Notes
              </label>
              <textarea
                rows={2}
                value={varianceNotes}
                onChange={(e) => setVarianceNotes(e.target.value)}
                placeholder="Explain reason for discrepancy (e.g. 5 vials damaged in transit with broken seal, returned to delivery agent for credit note)..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          )}

          {/* Stock Auto-Increment Toggle */}
          <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <div className="text-xs font-bold text-teal-950">
                  Auto-Increment Hospital Pharmacy Stock Quantities
                </div>
                <div className="text-[11px] text-teal-800">
                  Immediately updates Drug Inventory with received batch numbers, quantities, and resets low-stock alerts.
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoIncrementStock}
                onChange={(e) => setAutoIncrementStock(e.target.checked)}
                className="w-4 h-4 accent-teal-700 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Summary & Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200">
            <div className="text-xs text-slate-600">
              Verified Invoice Total:{" "}
              <strong className="text-slate-900 font-mono text-base">
                ₹{Math.round(totalInvoiceAmount).toLocaleString("en-IN")}
              </strong>{" "}
              (incl. GST)
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit GRN &amp; Auto-Increment Stock
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
