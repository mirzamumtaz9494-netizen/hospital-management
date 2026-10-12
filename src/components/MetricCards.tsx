"use client";

import React from "react";
import {
  IndianRupee,
  FlaskConical,
  Pill,
  Bed,
  ArrowUpRight,
} from "lucide-react";

// Reusable SVG Sparkline
const Sparkline: React.FC<{ color?: string }> = ({ color = "#10b981" }) => (
  <svg
    className="w-16 h-6 overflow-visible"
    viewBox="0 0 64 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 18C8 18 12 12 18 14C24 16 28 8 34 10C40 12 46 4 52 7C56 9 60 3 62 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. Today OP Revenue */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-slate-600">Today OP Revenue</span>
        </div>

        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
          ₹1,85,400
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            8.4%
          </span>
          <Sparkline color="#10b981" />
        </div>
      </div>

      {/* 2. Today IP Revenue */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-slate-600">Today IP Revenue</span>
        </div>

        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
          ₹5,20,000
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            12.1%
          </span>
          <Sparkline color="#10b981" />
        </div>
      </div>

      {/* 3. Laboratory Sales */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
            <FlaskConical className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-slate-600">Laboratory Sales</span>
        </div>

        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
          ₹65,200
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            5.2%
          </span>
          <Sparkline color="#10b981" />
        </div>
      </div>

      {/* 4. Pharmacy Sales */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
            <Pill className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-slate-600">Pharmacy Sales</span>
        </div>

        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
          ₹1,20,000
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            9.0%
          </span>
          <Sparkline color="#10b981" />
        </div>
      </div>

      {/* 5. Bed Occupancy */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <Bed className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Bed Occupancy</span>
          </div>

          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            78%
          </div>
        </div>

        <div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: "78%" }}
            ></div>
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            234 / 300 beds
          </div>
        </div>
      </div>

      {/* 6. Beds Available */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <Bed className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Beds Available</span>
          </div>

          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            66
          </div>
          <div className="text-[11px] font-medium text-slate-600 mb-2">
            ICU <span className="font-semibold text-slate-800">4</span> • General <span className="font-semibold text-slate-800">38</span> • Private <span className="font-semibold text-slate-800">24</span>
          </div>
        </div>

        <div>
          {/* Multi-segmented indicator */}
          <div className="w-full bg-slate-100 h-2 rounded-full flex overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: "8%" }} title="ICU: 4"></div>
            <div className="bg-teal-500 h-full" style={{ width: "57%" }} title="General: 38"></div>
            <div className="bg-slate-700 h-full" style={{ width: "35%" }} title="Private: 24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
