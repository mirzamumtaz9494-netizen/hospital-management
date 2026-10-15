"use client";

import React from "react";
import {
  Pill,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  PieChart,
} from "lucide-react";

export const PharmacyReportsTab: React.FC = () => {
  const abcCategories = [
    { class: "Category A (High Value)", count: 84, valueShare: "71.4%", stockValue: "₹4,12,000", examples: "Meronem 1g, Inj Heparin, Augmentin 625" },
    { class: "Category B (Medium Value)", count: 186, valueShare: "20.2%", stockValue: "₹1,16,500", examples: "Telma 40, Asthalin Inhaler, Pantocid IV" },
    { class: "Category C (Bulk Fast Moving)", count: 570, valueShare: "8.4%", stockValue: "₹48,500", examples: "Dolo 650, Pan 40, Glycomet 500 SR, IV Normal Saline" },
  ];

  const nearExpiryLedger = [
    { medicine: "Meronem 1g Injection", batch: "MER-994", expiry: "11/2026", stock: 22, unitCost: 1420, riskValue: 31240, action: "Priority Shift to ICU" },
    { medicine: "Inj. Ondansetron 4mg", batch: "OND-02", expiry: "12/2026", stock: 45, unitCost: 28, riskValue: 1260, action: "Ward Dispense" },
    { medicine: "Azithral 500 Tablet", batch: "AZI-812", expiry: "02/2027", stock: 12, unitCost: 95, riskValue: 1140, action: "Discount / Return" },
  ];

  return (
    <div className="space-y-5">
      {/* 4 Pharmacy Inventory KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Formulary Valuation</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">₹5,77,000</div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">
            840 Active SKUs in Stock
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Near Expiry Risk (90 Days)</div>
          <div className="text-2xl font-black text-purple-700 tracking-tight">₹33,640</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            FEFO Protocol Active
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Stock-out Incidents</div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">0</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% Emergency Drug Availability
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Antibiotic Stewardship</div>
          <div className="text-2xl font-black text-blue-700 tracking-tight">88.2%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            WHO AWaRe Compliance
          </div>
        </div>
      </div>

      {/* ABC Pareto Inventory Classification Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Formulary ABC Pareto Inventory Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Value-based inventory control to optimize working capital and minimize holding costs
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export ABC Analysis
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Product SKUs</th>
                <th className="py-3 px-4">Capital Share</th>
                <th className="py-3 px-4">Total Stock Value</th>
                <th className="py-3 px-4">Representative Key Formulations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {abcCategories.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {cat.class}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{cat.count} SKUs</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-teal-800">{cat.valueShare}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">{cat.stockValue}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">{cat.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Near-Expiry Risk Valuation Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-purple-700" />
          Near-Expiry Risk Ledger (Expiring within 90 Days)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-sans font-bold uppercase text-[10px]">
                <th className="py-2 px-3">Medicine Description</th>
                <th className="py-2 px-3">Batch No</th>
                <th className="py-2 px-3">Expiry Date</th>
                <th className="py-2 px-3">Stock Qty</th>
                <th className="py-2 px-3">Unit Cost</th>
                <th className="py-2 px-3">At-Risk Value</th>
                <th className="py-2 px-3 text-right">Depletion Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nearExpiryLedger.map((row, idx) => (
                <tr key={idx} className="hover:bg-purple-50/20">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{row.medicine}</td>
                  <td className="py-2.5 px-3 text-slate-700">{row.batch}</td>
                  <td className="py-2.5 px-3 text-purple-700 font-bold">{row.expiry}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-bold">{row.stock}</td>
                  <td className="py-2.5 px-3 text-slate-600">₹{row.unitCost}</td>
                  <td className="py-2.5 px-3 font-black text-rose-700">₹{row.riskValue.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      {row.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
