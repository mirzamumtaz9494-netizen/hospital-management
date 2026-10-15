"use client";

import React, { useState, useEffect } from "react";
import { X, Edit, Bed, Wallet, Check } from "lucide-react";
import { WardTariffMaster } from "@/types";

interface EditTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariff: WardTariffMaster | null;
  onSave: (updated: WardTariffMaster) => void;
}

export const EditTariffModal: React.FC<EditTariffModalProps> = ({
  isOpen,
  onClose,
  tariff,
  onSave,
}) => {
  const [dailyBedRate, setDailyBedRate] = useState(0);
  const [nursingRate, setNursingRate] = useState(0);
  const [rmoRate, setRmoRate] = useState(0);

  useEffect(() => {
    if (tariff) {
      setDailyBedRate(tariff.dailyBedRate);
      setNursingRate(tariff.nursingRate);
      setRmoRate(tariff.rmoRate);
    }
  }, [tariff]);

  if (!isOpen || !tariff) return null;

  const totalCalculated = dailyBedRate + nursingRate + rmoRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...tariff,
      dailyBedRate,
      nursingRate,
      rmoRate,
      totalDailyTariff: totalCalculated,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Update Ward Tariff Slab
              </h3>
              <p className="text-xs text-slate-500">
                {tariff.wardName} ({tariff.wardCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Ward Category: {tariff.category}
              </div>
              <div className="text-[11px] text-slate-500">
                Current Occupancy: {tariff.occupancyBeds} of {tariff.totalBeds} beds
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
              {tariff.wardCode}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Base Daily Room / Bed Rent (₹) *
            </label>
            <input
              type="number"
              min={0}
              step={100}
              required
              value={dailyBedRate}
              onChange={(e) => setDailyBedRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daily Nursing Care Charges (₹) *
            </label>
            <input
              type="number"
              min={0}
              step={50}
              required
              value={nursingRate}
              onChange={(e) => setNursingRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resident Medical Officer (RMO) Tariff (₹) *
            </label>
            <input
              type="number"
              min={0}
              step={50}
              required
              value={rmoRate}
              onChange={(e) => setRmoRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900">
              New Total Daily Tariff:
            </span>
            <span className="text-base font-black font-mono text-teal-800">
              ₹{totalCalculated.toLocaleString("en-IN")} / day
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Tariff Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
