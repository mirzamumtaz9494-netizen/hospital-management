"use client";

import React, { useState } from "react";
import { X, ArrowRightLeft, Building, BedDouble, CheckCircle2 } from "lucide-react";
import { ActiveAdmission, IpdBed } from "@/types";

interface BedTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  admission: ActiveAdmission | null;
  onConfirmTransfer: (data: {
    ipNo: string;
    fromWard: string;
    fromBed: string;
    toWard: string;
    toBed: string;
    reason: string;
  }) => void;
}

export const BedTransferModal: React.FC<BedTransferModalProps> = ({
  isOpen,
  onClose,
  admission,
  onConfirmTransfer,
}) => {
  const [toWard, setToWard] = useState("General Ward");
  const [toBed, setToBed] = useState("G-102");
  const [reason, setReason] = useState("Patient stabilized, shifted from ICU to General step-down unit");

  if (!isOpen || !admission) return null;

  const vacantBedsByWard: Record<string, string[]> = {
    "ICU Ward": ["ICU-05", "ICU-09", "ICU-12"],
    "General Ward": ["G-102", "G-103", "G-104", "G-106", "G-114", "G-116", "G-119", "G-121", "G-122"],
    "Special Private Ward": ["P-202", "P-203", "P-204", "P-210"],
    "Maternity Ward": ["MAT-04", "MAT-08"],
    "Cardiac Care Unit (CCU)": ["CCU-02", "CCU-04"],
  };

  const handleWardChange = (ward: string) => {
    setToWard(ward);
    const available = vacantBedsByWard[ward] || ["BED-01"];
    setToBed(available[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmTransfer({
      ipNo: admission.ipNo,
      fromWard: admission.wardName,
      fromBed: admission.bedNumber,
      toWard,
      toBed,
      reason,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-700 font-bold">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Transfer Patient Ward / Bed
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {admission.ipNo} • {admission.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Current location card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Location:</span>
              <span className="font-bold text-slate-900 text-xs">
                {admission.wardName} — Bed {admission.bedNumber}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
              Stay: {admission.days} days
            </span>
          </div>

          {/* Target Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Target Ward <span className="text-rose-500">*</span>
              </label>
              <select
                value={toWard}
                onChange={(e) => handleWardChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:bg-white"
              >
                {Object.keys(vacantBedsByWard).map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Target Vacant Bed <span className="text-rose-500">*</span>
              </label>
              <select
                value={toBed}
                onChange={(e) => setToBed(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-teal-800 focus:bg-white"
              >
                {(vacantBedsByWard[toWard] || []).map((bed) => (
                  <option key={bed} value={bed}>
                    {bed} (Ready & Vacant)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">
              Clinical Justification / Reason for Transfer
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Confirm Bed Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
