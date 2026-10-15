"use client";

import React, { useState } from "react";
import {
  Bed,
  Users,
  Activity,
  Clock,
  HeartCrack,
  Calendar,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { HospitalCensusStats } from "@/types";
import { MOCK_CENSUS_TRENDS } from "@/data/reportsMockData";

interface ClinicalReportsTabProps {
  censusTrends?: HospitalCensusStats[];
}

export const ClinicalReportsTab: React.FC<ClinicalReportsTabProps> = ({
  censusTrends = MOCK_CENSUS_TRENDS,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const topMorbidity = [
    { code: "I10", condition: "Essential (Primary) Hypertension", cases: 142, avgStay: "2.1d", dept: "Cardiology" },
    { code: "E11", condition: "Type 2 Diabetes Mellitus with Complications", cases: 98, avgStay: "2.8d", dept: "General Medicine" },
    { code: "A90", condition: "Dengue Fever / Thrombocytopenia", cases: 74, avgStay: "4.2d", dept: "General Medicine" },
    { code: "J20", condition: "Acute Bronchitis & Respiratory Infections", cases: 68, avgStay: "3.1d", dept: "Pulmonology" },
    { code: "S82", condition: "Fracture of Lower Limb (ORIF Surgical)", cases: 52, avgStay: "4.6d", dept: "Orthopedics" },
    { code: "K80", condition: "Cholelithiasis (Laparoscopic Cholecystectomy)", cases: 38, avgStay: "2.4d", dept: "General Surgery" },
  ];

  return (
    <div className="space-y-5">
      {/* 4 Clinical Performance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Bed Occupancy Rate</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">78.0%</div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">
            234 / 300 Operational Beds
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Average Length of Stay (ALOS)</div>
          <div className="text-2xl font-black text-blue-700 tracking-tight">3.4 Days</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            NABH Standard &lt; 4.5 Days
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Emergency Triage Time</div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">8.2 Min</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Door-to-Doctor Evaluation
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">In-Hospital Mortality</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">0.0%</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            0 Deaths Recorded Today
          </div>
        </div>
      </div>

      {/* 7-Day Inpatient Census & Utilization Log */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              7-Day Inpatient Census &amp; Bed Utilization Trend
            </h3>
            <p className="text-xs text-slate-500">
              Daily admissions, discharges, bed state, surgical complex workload, and ER footfall
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Census
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Admissions</th>
                <th className="py-3 px-4">Discharges</th>
                <th className="py-3 px-4">Occupied Beds</th>
                <th className="py-3 px-4">Occupancy Rate</th>
                <th className="py-3 px-4">Surgeries</th>
                <th className="py-3 px-4">OP Visits</th>
                <th className="py-3 px-4 text-right">ALOS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {censusTrends.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                    {c.date}
                  </td>
                  <td className="py-3.5 px-4 text-teal-800 font-bold">+{c.totalAdmissions}</td>
                  <td className="py-3.5 px-4 text-blue-700 font-bold">-{c.totalDischarges}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{c.occupiedBeds} / 300</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.occupancyRate}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full"
                          style={{ width: `${c.occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{c.surgeriesConducted} OTs</td>
                  <td className="py-3.5 px-4 text-slate-700">{c.opdVisits}</td>
                  <td className="py-3.5 px-4 text-right text-slate-800 font-bold">{c.avgLengthOfStay}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Morbidity & Disease Classification (ICD-10) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          Top Inpatient Morbidity &amp; Diagnosis Profile (ICD-10)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topMorbidity.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    ICD-10: {item.code}
                  </span>
                  <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {item.dept}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-xs mt-2 line-clamp-1">
                  {item.condition}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 font-mono">
                <span className="text-slate-500 font-sans text-[11px]">Treated Cases:</span>
                <span className="font-bold text-slate-900">{item.cases}</span>
                <span className="text-slate-500 font-sans text-[11px] ml-2">Avg Stay:</span>
                <span className="font-bold text-teal-800">{item.avgStay}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
