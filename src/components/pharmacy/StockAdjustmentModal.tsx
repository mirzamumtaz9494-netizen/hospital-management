"use client";

import React, { useState } from "react";
import { X, SlidersHorizontal, CheckCircle2, ArrowUpDown } from "lucide-react";
import { MedicineItem } from "@/types";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  medicine: MedicineItem | null;
  onClose: () => void;
  onConfirmAdjustment: (medId: string, newQty: number, reason: string) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  medicine,
  onClose,
  onConfirmAdjustment,
}) => {
  const [adjustedQty, setAdjustedQty] = useState(
    medicine ? String(medicine.stockQuantity) : "100"
  );
  const [reason, setReason] = useState("Received fresh distributor batch / GRN delivery");

  if (!isOpen || !medicine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(adjustedQty, 10);
    if (isNaN(qty) || qty < 0) {
      alert("Please enter a valid stock quantity");
      return;
    }
    onConfirmAdjustment(medicine.id, qty, reason);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-800">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Adjust Drug Stock Level
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {medicine.code} • Batch {medicine.batchNo}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="font-bold text-slate-900 text-sm">{medicine.name}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">{medicine.genericName}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Current Stock: <strong className="text-slate-800">{medicine.stockQuantity} Units</strong> • Min Reorder: {medicine.minReorderLevel}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              New Verified Physical Stock Quantity *
            </label>
            <input
              type="number"
              required
              value={adjustedQty}
              onChange={(e) => setAdjustedQty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Adjustment Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="Received fresh distributor batch / GRN delivery">
                Received fresh distributor batch / GRN delivery
              </option>
              <option value="Physical count audit reconciliation">
                Physical count audit reconciliation
              </option>
              <option value="Damaged / Broken vial write-off">
                Damaged / Broken vial write-off
              </option>
              <option value="Expired stock removed to quarantine">
                Expired stock removed to quarantine
              </option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Update Stock Level
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
