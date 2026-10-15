"use client";

import React, { useState } from "react";
import {
  X,
  Pill,
  CheckCircle2,
  Clock,
  Printer,
  AlertTriangle,
  CreditCard,
  User,
  ShieldCheck,
} from "lucide-react";
import { PharmacyOrder } from "@/types";

interface DispensePrescriptionModalProps {
  isOpen: boolean;
  order: PharmacyOrder | null;
  onClose: () => void;
  onConfirmDispense: (order: PharmacyOrder, nextAction?: "print" | "close") => void;
}

export const DispensePrescriptionModal: React.FC<DispensePrescriptionModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirmDispense,
}) => {
  const [pharmacistNotes, setPharmacistNotes] = useState(
    "All dosages and drug interactions verified. No contraindications flagged."
  );

  if (!isOpen || !order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-800">
              <Pill className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Dispense Prescribed Medication
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {order.rxNumber} • {order.prescribingDoctor}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Patient Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-sm">{order.patientName}</div>
              <div className="text-slate-500 text-[11px]">
                {order.age} Y / {order.gender} • <span className="font-mono">{order.mrId}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-teal-100 text-teal-800">
                {order.source} {order.wardBed ? `(${order.wardBed})` : ""}
              </span>
            </div>
          </div>

          {/* Medicines Checklist to Dispense */}
          <div>
            <div className="text-slate-700 font-bold mb-2 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Prescription Items to Pack ({order.items.length})</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Batch Allocation OK
              </span>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      {item.medicineName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.dosage} • {item.frequency} ({item.duration})
                    </div>
                    {item.instructions && (
                      <div className="text-[10px] text-teal-700 italic mt-0.5">
                        Instructions: {item.instructions}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Batch: {item.batchNo} • Exp: {item.expiryDate}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      Qty: {item.quantity}
                    </span>
                    <div className="font-mono text-slate-500 text-[11px] mt-0.5">
                      ₹{Math.round(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacist Clinical Verification Remarks */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Pharmacist Counseling / Verification Notes
            </label>
            <input
              type="text"
              value={pharmacistNotes}
              onChange={(e) => setPharmacistNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Pricing & Net Amount */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Total Invoice Amount:</span>
              <div className="font-mono text-lg font-black text-slate-900">
                ₹{order.netTotal.toFixed(0)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-500 text-[10px]">Payment Status:</span>
              <div className="font-bold text-emerald-700 text-xs">
                {order.paymentStatus} ({order.paymentMode})
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onConfirmDispense(order, "print")}
                className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-800 transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-teal-700" />
                Dispense &amp; Print Bill
              </button>

              <button
                type="button"
                onClick={() => onConfirmDispense(order, "close")}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Dispensed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
