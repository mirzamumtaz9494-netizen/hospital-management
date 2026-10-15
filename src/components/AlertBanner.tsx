"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const AlertBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="w-full max-w-full overflow-hidden flex justify-center py-2 px-3 sm:px-4">
      <div className="w-full sm:w-auto inline-flex items-center justify-between gap-2 sm:gap-6 bg-white/95 border border-slate-200/90 shadow-2xs rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-1.5 text-xs font-medium text-slate-700 transition hover:shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-6 text-[11px] sm:text-xs">
          {/* Critical Patients */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">3</span>
            <span className="text-slate-600 hidden sm:inline">critical patients</span>
            <span className="text-slate-600 sm:hidden">critical</span>
          </div>

          {/* Lab Reports Pending */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-800">5</span>
            <span className="text-slate-600 hidden sm:inline">lab reports pending</span>
            <span className="text-slate-600 sm:hidden">lab pending</span>
          </div>

          {/* Pharmacy Low Stock */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span className="font-semibold text-slate-800">2</span>
            <span className="text-slate-600 hidden sm:inline">pharmacy items low</span>
            <span className="text-slate-600 sm:hidden">low stock</span>
          </div>
        </div>

        {/* Toggle Chevron */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-600 p-0.5 transition shrink-0 ml-1"
          aria-label="Toggle alert banner"
        >
          {collapsed ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
