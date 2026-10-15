"use client";

import React from "react";
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Download,
  Printer,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";

export const LabAnalyticsTab: React.FC = () => {
  const labDisciplines = [
    { name: "Hematology & Coagulation", tests: 78, revenue: 35100, tatAvg: "1.4 hrs", tatCompliance: 96.2 },
    { name: "Clinical Biochemistry", tests: 64, revenue: 51200, tatAvg: "2.8 hrs", tatCompliance: 93.8 },
    { name: "Serology & Immunology", tests: 24, revenue: 22800, tatAvg: "3.2 hrs", tatCompliance: 95.0 },
    { name: "Clinical Pathology & Urine", tests: 12, revenue: 3000, tatAvg: "1.1 hrs", tatCompliance: 98.4 },
    { name: "Digital Radiology & X-Ray", tests: 8, revenue: 4000, tatAvg: "0.8 hrs", tatCompliance: 97.5 },
  ];

  const criticalAlertsLog = [
    { time: "08:45 AM", patient: "Lakshmi Devi (67/F, ICU-07)", test: "hs-Troponin I (74.8 ng/L)", doctor: "Dr. A. Rao", notifiedIn: "6 mins", status: "Acknowledged" },
    { time: "09:30 AM", patient: "Imran Qureshi (47/M, G-105)", test: "Platelet Count (28,000 /cumm)", doctor: "Dr. K. Sharma", notifiedIn: "8 mins", status: "Acknowledged" },
    { time: "11:15 AM", patient: "Gopal Yadav (66/M, P-206)", test: "Serum Potassium (6.2 mmol/L)", doctor: "Dr. S. Reddy", notifiedIn: "5 mins", status: "Acknowledged" },
    { time: "02:10 PM", patient: "Savitri Rao (72/F, G-118)", test: "Blood Urea (98 mg/dL) & Creatinine (3.4)", doctor: "Dr. K. Sharma", notifiedIn: "9 mins", status: "Acknowledged" },
    { time: "03:40 PM", patient: "Baby of Anita (3d/F, NICU-02)", test: "Total Bilirubin (19.4 mg/dL)", doctor: "Dr. M. Iyer", notifiedIn: "4 mins", status: "Acknowledged" },
  ];

  return (
    <div className="space-y-5">
      {/* 4 Diagnostic Performance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Tests Conducted</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">186</div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">
            ▲ 12.4% Diagnostic Growth
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">TAT Target Compliance</div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">94.6%</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            NABL MC-2941 Target &gt;90%
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Critical Values Notified</div>
          <div className="text-2xl font-black text-rose-600 tracking-tight flex items-center gap-1.5">
            5 Alerts
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">
            100% Notified &lt; 15 mins
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Auto-Analyzer Uptime</div>
          <div className="text-2xl font-black text-blue-700 tracking-tight">99.8%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Daily Levey-Jennings QC Pass
          </div>
        </div>
      </div>

      {/* Discipline Volume Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Laboratory Discipline Workload &amp; Revenue Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Departmental investigation volume, mean turnaround time, and billing distribution
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Diagnostic Discipline</th>
                <th className="py-3 px-4">Tests Executed</th>
                <th className="py-3 px-4">Discipline Revenue</th>
                <th className="py-3 px-4">Mean Turnaround</th>
                <th className="py-3 px-4 text-right">TAT Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {labDisciplines.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                    {d.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{d.tests}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    ₹{d.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{d.tatAvg}</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {d.tatCompliance}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Value Alert Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          Critical Value Notification Audit Log (NABL Mandate MC-2941)
        </h4>

        <div className="divide-y divide-slate-100 text-xs">
          {criticalAlertsLog.map((log, idx) => (
            <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-slate-400 text-[11px] mr-2">{log.time}</span>
                <strong className="text-slate-900">{log.patient}</strong>
                <div className="text-[11px] text-rose-700 font-bold mt-0.5">
                  Critical Finding: {log.test}
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div className="text-[11px] text-slate-600">
                  Communicated to: <strong className="text-slate-800">{log.doctor}</strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {log.notifiedIn} • {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
