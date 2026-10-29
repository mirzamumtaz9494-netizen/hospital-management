"use client";

import React, { useState } from "react";
import {
  X,
  Truck,
  Plus,
  Trash2,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import {
  PharmacyPurchaseOrder,
  PharmacyVendor,
  MedicineItem,
  PoLineItem,
} from "@/types";
import { MOCK_PHARMACY_VENDORS } from "@/data/pharmacyMockData";

interface NewPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMedicines: MedicineItem[];
  availableVendors?: PharmacyVendor[];
  onSubmitPo: (newPo: PharmacyPurchaseOrder) => void;
}

export const NewPurchaseOrderModal: React.FC<NewPurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  availableMedicines,
  availableVendors = MOCK_PHARMACY_VENDORS,
  onSubmitPo,
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState(
    availableVendors[0]?.id || ""
  );
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
  });
  const [paymentTerms, setPaymentTerms] = useState("30 Days Credit via NEFT");
  const [notes, setNotes] = useState("");

  // Line items state
  const [lineItems, setLineItems] = useState<PoLineItem[]>([
    {
      id: "item-1",
      medicineId: availableMedicines[0]?.id || "med-1",
      medicineName: availableMedicines[0]?.name || "Augmentin 625 Duo Tablet",
      genericName: availableMedicines[0]?.genericName || "",
      packSize: "Strip of 10 Tablets",
      orderedQuantity: 100,
      unitCost: availableMedicines[0]?.unitCost || 140,
      gstPercent: 12,
      totalAmount: (availableMedicines[0]?.unitCost || 140) * 100 * 1.12,
    },
  ]);

  if (!isOpen) return null;

  const currentVendor = availableVendors.find((v) => v.id === selectedVendorId);

  const handleAddItem = () => {
    const med = availableMedicines[0];
    const newItem: PoLineItem = {
      id: `item-${Date.now()}`,
      medicineId: med?.id || "med-1",
      medicineName: med?.name || "Medicine",
      genericName: med?.genericName || "",
      packSize: "Strip of 10 Tablets",
      orderedQuantity: 50,
      unitCost: med?.unitCost || 50,
      gstPercent: 12,
      totalAmount: (med?.unitCost || 50) * 50 * 1.12,
    };
    setLineItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof PoLineItem,
    value: any
  ) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "medicineId") {
            const med = availableMedicines.find((m) => m.id === value);
            if (med) {
              updated.medicineName = med.name;
              updated.genericName = med.genericName;
              updated.unitCost = med.unitCost;
            }
          }
          // Recalculate line total
          const base = updated.orderedQuantity * updated.unitCost;
          const tax = base * (updated.gstPercent / 100);
          updated.totalAmount = Math.round(base + tax);
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.orderedQuantity * item.unitCost,
    0
  );
  const taxAmount = lineItems.reduce(
    (sum, item) =>
      sum + item.orderedQuantity * item.unitCost * (item.gstPercent / 100),
    0
  );
  const grandTotal = Math.round(subtotal + taxAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVendor) return;

    const poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPo: PharmacyPurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber,
      vendorId: currentVendor.id,
      supplierName: currentVendor.name,
      vendorGstin: currentVendor.gstin,
      vendorDlNumber: currentVendor.dlNumber,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate,
      items: lineItems,
      itemsCount: lineItems.length,
      subtotal: Math.round(subtotal),
      taxAmount: Math.round(taxAmount),
      totalAmount: grandTotal,
      paymentTerms,
      notes,
      status: "Order Placed",
    };

    onSubmitPo(newPo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Generate Pharmacy Purchase Order (PO)
              </h2>
              <p className="text-xs text-teal-200">
                Official institutional drug procurement to pharmaceutical C&amp;F stockists
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
          {/* Top Vendor & Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Pharmaceutical Distributor *
              </label>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
              >
                {availableVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              {currentVendor && (
                <div className="mt-1.5 text-[10px] text-slate-500 space-y-0.5">
                  <div>GSTIN: <span className="font-mono font-bold text-slate-700">{currentVendor.gstin}</span></div>
                  <div>DL No: <span className="font-mono text-slate-700">{currentVendor.dlNumber}</span></div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected Delivery Date *
              </label>
              <input
                type="date"
                required
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Hospital Receiving Dock standard: 3-5 days
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment &amp; Credit Terms
              </label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                e.g. 30 Days Credit via NEFT / Cheque
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Order Line Items ({lineItems.length})
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine SKU
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Medicine / Product SKU</th>
                      <th className="py-2.5 px-3">Packaging</th>
                      <th className="py-2.5 px-3 text-right">Order Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                      <th className="py-2.5 px-3 text-right">GST %</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                      <th className="py-2.5 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3">
                          <select
                            value={item.medicineId}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "medicineId",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                          >
                            {availableMedicines.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.genericName})
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.packSize}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "packSize",
                                e.target.value
                              )
                            }
                            className="w-28 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                          />
                        </td>

                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            min={1}
                            value={item.orderedQuantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "orderedQuantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-right text-slate-900"
                          />
                        </td>

                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            step="0.1"
                            min={0.1}
                            value={item.unitCost}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "unitCost",
                                Number(e.target.value)
                              )
                            }
                            className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-right text-slate-900"
                          />
                        </td>

                        <td className="py-2 px-3 text-right">
                          <select
                            value={item.gstPercent}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "gstPercent",
                                Number(e.target.value)
                              )
                            }
                            className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                          >
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                          </select>
                        </td>

                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{item.totalAmount.toLocaleString("en-IN")}
                        </td>

                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={lineItems.length <= 1}
                            className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notes and Grand Total summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dispatch Instructions / Transport Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ensure unbroken manufacturer seals and cold chain packaging with temperature data logger..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Base Value):</span>
                <span className="font-mono font-bold">
                  ₹{Math.round(subtotal).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (Input Tax Credit):</span>
                <span className="font-mono font-bold text-teal-800">
                  +₹{Math.round(taxAmount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 text-sm font-black pt-2 border-t border-slate-200">
                <span>Total PO Procurement Value:</span>
                <span className="font-mono text-teal-900">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
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
              <FileText className="w-4 h-4" />
              Generate Official Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
