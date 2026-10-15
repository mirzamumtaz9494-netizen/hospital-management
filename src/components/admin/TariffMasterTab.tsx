"use client";

import React, { useState } from "react";
import {
  Wallet,
  Bed,
  CheckCircle2,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertCircle,
  Edit,
  ShieldCheck,
} from "lucide-react";
import { WardTariffMaster } from "@/types";

interface TariffMasterTabProps {
  tariffs: WardTariffMaster[];
  onEditTariff: (tariff: WardTariffMaster) => void;
}

export const TariffMasterTab: React.FC<TariffMasterTabProps> = ({
  tariffs,
  onEditTariff,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Intensive Care", "Critical Care", "General", "Private"];

  const filteredTariffs = tariffs.filter((t) => {
    return selectedCategory === "All" || t.category === selectedCategory;
  });

  const totalBeds = tariffs.reduce((sum, t) => sum + t.totalBeds, 0);
  const totalOccupied = tariffs.reduce((sum, t) => sum + t.occupancyBeds, 0);
  const overallOccupancyPct = Math.round((totalOccupied / totalBeds) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Inpatient Beds
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalBeds} Beds
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-teal-700 font-bold">{tariffs.length} Ward Slabs</span> configured
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Hospital Census
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalOccupied} / {totalBeds}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-700 font-bold">{overallOccupancyPct}% Occupancy</span> active
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lowest Bed Charge
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹1,200
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-blue-700 font-bold">General Ward</span> (Male / Female)
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Highest Critical Slab
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹10,000
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-purple-700 font-bold">Multi-Disciplinary ICU</span> (All-inclusive)
          </div>
        </div>
      </div>

      {/* 2. Regulatory & Tax Ceiling Guidance Banner */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Hospital Tariff Statutory Compliance:</span> Daily bed tariffs are aligned with General Insurance Council (GIC) Preferred Provider Network (PPN) cashless schedule rates. Wards below ₹5,000/day are 0% GST exempt under CBIC healthcare notifications.
        </div>
      </div>

      {/* 3. Tariff Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Inpatient Bed &amp; Ward Daily Tariff Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Component breakdown of room rent, nursing supervision, and resident medical officer (RMO) fees
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">Ward Code &amp; Tier</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Base Bed Rate</th>
                <th className="py-3 px-4 text-right">Nursing Fee</th>
                <th className="py-3 px-4 text-right">RMO Charge</th>
                <th className="py-3 px-4 text-right">Total Daily Rate</th>
                <th className="py-3 px-4 text-center">Bed Census</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTariffs.map((tariff) => {
                const occupancyPct = Math.round(
                  (tariff.occupancyBeds / tariff.totalBeds) * 100
                );

                return (
                  <tr key={tariff.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900">
                          {tariff.wardName}
                        </div>
                        <div className="text-[11px] font-mono text-teal-700 font-semibold">
                          {tariff.wardCode}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tariff.category === "Intensive Care"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : tariff.category === "Critical Care"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : tariff.category === "Private"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {tariff.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                      ₹{tariff.dailyBedRate.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                      ₹{tariff.nursingRate.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                      ₹{tariff.rmoRate.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        ₹{tariff.totalDailyTariff.toLocaleString("en-IN")}/day
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-28 mx-auto space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
                          <span>{tariff.occupancyBeds}/{tariff.totalBeds}</span>
                          <span>{occupancyPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancyPct >= 90
                                ? "bg-rose-500"
                                : occupancyPct >= 70
                                ? "bg-teal-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${occupancyPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onEditTariff(tariff)}
                        className="px-2.5 py-1 text-teal-700 hover:bg-teal-50 border border-teal-200/60 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
                      >
                        <Edit className="w-3 h-3" />
                        Edit Rate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
