"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { DepartmentRevenueItem } from "@/types";
import { MOCK_DEPARTMENT_REVENUE } from "@/data/reportsMockData";

interface FinancialReportsTabProps {
  departmentRevenue?: DepartmentRevenueItem[];
  onPrintSummary: () => void;
}

export const FinancialReportsTab: React.FC<FinancialReportsTabProps> = ({
  departmentRevenue = MOCK_DEPARTMENT_REVENUE,
  onPrintSummary,
}) => {
  const [dateRange, setDateRange] = useState("Today (12 Oct 2026)");

  const totalOpd = departmentRevenue.reduce((a, b) => a + b.opdRevenue, 0);
  const totalIpd = departmentRevenue.reduce((a, b) => a + b.ipdRevenue, 0);
  const totalLab = departmentRevenue.reduce((a, b) => a + b.labRevenue, 0);
  const totalPharmacy = departmentRevenue.reduce((a, b) => a + b.pharmacyRevenue, 0);
  const grandTotal = totalOpd + totalIpd + totalLab + totalPharmacy;

  return (
    <div className="space-y-5">
      {/* 4 Core Stream Revenue KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>OPD Consultation</span>
            <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.2 rounded">
              20.8%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalOpd.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">
            ▲ 8.4% vs last week
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>IPD Admissions &amp; Beds</span>
            <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded">
              58.4%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalIpd.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            ▲ 12.1% (78% Bed Occupancy)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Laboratory Diagnostics</span>
            <span className="text-[10px] text-violet-700 font-bold bg-violet-50 px-1.5 py-0.2 rounded">
              7.3%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalLab.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-violet-700 font-semibold mt-1">
            ▲ 5.2% (186 Tests Today)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Pharmacy &amp; Formulary</span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
              13.5%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalPharmacy.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            ▲ 9.0% (148 Prescriptions)
          </div>
        </div>
      </div>

      {/* Department-wise Revenue Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Specialty Department-wise Revenue Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Cross-functional earnings across consultations, inpatient admissions, diagnostics, and dispensaries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Today (12 Oct 2026)">Today (12 Oct 2026)</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Current Month (Oct 2026)">Current Month (Oct 2026)</option>
              <option value="Q3 FY2026">Q3 FY2026</option>
            </select>

            <button
              onClick={onPrintSummary}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Executive MIS Print
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Specialty Department</th>
                <th className="py-3 px-4">OPD Revenue</th>
                <th className="py-3 px-4">IPD Revenue</th>
                <th className="py-3 px-4">Lab Revenue</th>
                <th className="py-3 px-4">Pharmacy</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Patients Served</th>
                <th className="py-3 px-4 text-right">YoY Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {departmentRevenue.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                    {dept.department}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    ₹{dept.opdRevenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    ₹{dept.ipdRevenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    ₹{dept.labRevenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    ₹{dept.pharmacyRevenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-xs">
                    ₹{dept.totalRevenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-slate-700">
                    {dept.patientCount} Patients
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                      +{dept.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-mono font-bold text-xs">
                <td className="py-3.5 px-4 font-sans">Hospital Total Gross</td>
                <td className="py-3.5 px-4">₹{totalOpd.toLocaleString("en-IN")}</td>
                <td className="py-3.5 px-4">₹{totalIpd.toLocaleString("en-IN")}</td>
                <td className="py-3.5 px-4">₹{totalLab.toLocaleString("en-IN")}</td>
                <td className="py-3.5 px-4">₹{totalPharmacy.toLocaleString("en-IN")}</td>
                <td className="py-3.5 px-4 text-teal-300 font-black text-sm">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </td>
                <td className="py-3.5 px-4 font-sans">376 Patients Today</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-sans font-bold">
                  ▲ 9.6% Overall
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payment Modes Breakdown Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          Payment Modes Collection Distribution
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-slate-500 text-[11px]">UPI &amp; Digital Payments</div>
            <div className="font-mono text-base font-black text-slate-900 mt-1">₹3,92,000</div>
            <div className="text-[10px] text-teal-800 font-semibold mt-0.5">44.0% of collections</div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-slate-500 text-[11px]">TPA &amp; Cashless Insurance</div>
            <div className="font-mono text-base font-black text-slate-900 mt-1">₹3,12,000</div>
            <div className="text-[10px] text-blue-700 font-semibold mt-0.5">35.0% of collections</div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-slate-500 text-[11px]">Credit &amp; Debit Cards</div>
            <div className="font-mono text-base font-black text-slate-900 mt-1">₹1,18,000</div>
            <div className="text-[10px] text-violet-700 font-semibold mt-0.5">13.2% of collections</div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="text-slate-500 text-[11px]">Cash Counters</div>
            <div className="font-mono text-base font-black text-slate-900 mt-1">₹68,600</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">7.8% of collections</div>
          </div>
        </div>
      </div>
    </div>
  );
};
