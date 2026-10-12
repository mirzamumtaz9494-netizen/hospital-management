"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const AlertBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="w-full flex justify-center py-2.5 px-4">
      <div className="inline-flex items-center justify-between gap-4 sm:gap-8 bg-white/95 border border-slate-200/90 shadow-sm rounded-full px-5 py-1.5 text-xs font-medium text-slate-700 transition hover:shadow">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Critical Patients */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">3</span>
            <span className="text-slate-600">critical patients</span>
          </div>

          {/* Lab Reports Pending */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-800">5</span>
            <span className="text-slate-600">lab reports pending</span>
          </div>

          {/* Pharmacy Low Stock */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span className="font-semibold text-slate-800">2</span>
            <span className="text-slate-600">pharmacy items low in stock</span>
          </div>
        </div>

        {/* Toggle Chevron */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-600 p-0.5 transition"
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
