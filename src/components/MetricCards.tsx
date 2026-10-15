"use client";

import React from "react";
import {
  IndianRupee,
  FlaskConical,
  Pill,
  Bed,
  ArrowUpRight,
  ArrowDownRight,
  Stethoscope,
  Users,
  Activity,
  AlertTriangle,
  UserCheck,
  UserPlus,
  Clock,
  ShieldCheck,
  FileText,
  FileCheck,
  CheckCircle2,
  Wallet,
  CreditCard,
  Receipt,
  Package,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";

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
  const { currentRole } = useRole();

  // 1. DOCTOR CLINICAL METRICS
  if (currentRole === "doctor") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Today Consultations</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            42 Patients
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 border border-blue-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              14 Waiting
            </span>
            <span className="text-[11px] text-slate-400 font-medium">28 Completed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <Bed className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">IP Patients Under Care</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            18 Inpatients
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-teal-50 text-teal-700 border border-teal-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              15 In Wards
            </span>
            <span className="text-[11px] text-amber-600 font-bold">3 in ICU</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Critical / ICU Alerts</span>
          </div>
          <div className="text-2xl font-bold text-rose-700 tracking-tight mb-2.5">
            6 Critical
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              2 Ventilator
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Stable: 4</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Pending Lab Reports</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            14 Reports
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              4 STAT / Urgent
            </span>
            <span className="text-[11px] text-slate-400 font-medium">10 Routine</span>
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
            <div className="text-[11px] font-medium text-slate-600 mb-2 truncate">
              ICU <span className="font-semibold text-slate-800">4</span> • Gen <span className="font-semibold text-slate-800">38</span> • Pvt <span className="font-semibold text-slate-800">24</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-2 rounded-full flex overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: "8%" }} title="ICU: 4"></div>
              <div className="bg-teal-500 h-full" style={{ width: "57%" }} title="General: 38"></div>
              <div className="bg-slate-700 h-full" style={{ width: "35%" }} title="Private: 24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. NURSE CLINICAL METRICS
  if (currentRole === "nurse") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Bed className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Ward Inpatients</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            64 Patients
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Floors 2 &amp; 3
            </span>
            <span className="text-[11px] text-slate-400 font-medium">8 Shifts Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Vitals Monitoring Due</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            12 Patients
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Q2H Interval
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Next: 14:00</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Critical / ICU Alerts</span>
          </div>
          <div className="text-2xl font-bold text-rose-700 tracking-tight mb-2.5">
            6 Critical
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              ICU Bed #4, #9
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Continuous ECG</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
              <Pill className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Nursing Drug Indents</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            8 Pending
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 border border-blue-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Central Pharmacy
            </span>
            <span className="text-[11px] text-slate-400 font-medium">IV Fluids &amp; Antibiotics</span>
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
            <div className="text-[11px] font-medium text-slate-600 mb-2 truncate">
              ICU <span className="font-semibold text-slate-800">4</span> • Gen <span className="font-semibold text-slate-800">38</span> • Pvt <span className="font-semibold text-slate-800">24</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-2 rounded-full flex overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: "8%" }} title="ICU: 4"></div>
              <div className="bg-teal-500 h-full" style={{ width: "57%" }} title="General: 38"></div>
              <div className="bg-slate-700 h-full" style={{ width: "35%" }} title="Private: 24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. RECEPTIONIST FRONT DESK METRICS
  if (currentRole === "receptionist") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">OP Registrations Today</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            142 Patients
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              8.4%
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Tokens Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">IP Admissions Today</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            18 Admitted
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 border border-blue-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              4 Emergency
            </span>
            <span className="text-[11px] text-slate-400 font-medium">14 Planned</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Waiting in Queue</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            23 Waiting
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Avg: 14 min
            </span>
            <span className="text-[11px] text-slate-400 font-medium">104 Consulted</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Doctors On Duty</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            46 Clinicians
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              24 Chambers
            </span>
            <span className="text-[11px] text-slate-400 font-medium">100% Present</span>
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
            <div className="text-[11px] font-medium text-slate-600 mb-2 truncate">
              ICU <span className="font-semibold text-slate-800">4</span> • Gen <span className="font-semibold text-slate-800">38</span> • Pvt <span className="font-semibold text-slate-800">24</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-2 rounded-full flex overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: "8%" }} title="ICU: 4"></div>
              <div className="bg-teal-500 h-full" style={{ width: "57%" }} title="General: 38"></div>
              <div className="bg-slate-700 h-full" style={{ width: "35%" }} title="Private: 24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. PHARMACIST METRICS
  if (currentRole === "pharmacist") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Prescriptions Dispensed</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            128 Orders
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              98.4% Fill Rate
            </span>
            <span className="text-[11px] text-slate-400 font-medium">12 Waiting</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Pharmacy Sales Today</span>
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

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Low Stock Formulations</span>
          </div>
          <div className="text-2xl font-bold text-rose-700 tracking-tight mb-2.5">
            14 Items
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Reorder Needed
            </span>
            <span className="text-[11px] text-slate-400 font-medium">3 Critical</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Narcotics Register</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            Audited OK
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Schedule X &amp; H1
            </span>
            <span className="text-[11px] text-slate-400 font-medium">100% Verified</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Package className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Inward GRN Batches</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            4 Received
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              QC Cleared
            </span>
            <span className="text-[11px] text-slate-400 font-medium">₹3,45,000</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Near Expiry Watch</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            3 Batches
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              &lt; 90 Days
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Return to vendor</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. LAB TECHNICIAN METRICS
  if (currentRole === "lab_tech") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-cyan-600">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Samples Accessioned</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            86 Today
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-teal-50 text-teal-700 border border-teal-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Phlebotomy
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Barcoded</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Tests In Progress</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            38 Running
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 border border-blue-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Analyzers Online
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Sysmex &amp; Cobas</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Critical / STAT Alerts</span>
          </div>
          <div className="text-2xl font-bold text-rose-700 tracking-tight mb-2.5">
            5 Panic Values
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Notified to MD
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Troponin &amp; K+</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Lab Diagnostic Sales</span>
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

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Pending Sign-offs</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            14 Reports
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Pathologist Desk
            </span>
            <span className="text-[11px] text-slate-400 font-medium">NABL Compliant</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Analyzer Calibration</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight mb-2.5">
            Passed QC
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              07:00 AM Run
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Zero Errors</span>
          </div>
        </div>
      </div>
    );
  }

  // 6. CASHIER BILLING METRICS
  if (currentRole === "cashier") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Cash In Vault / Counter</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            ₹2,45,000
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Day Book Active
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Reconciled</span>
          </div>
        </div>

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

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Today IP Collections</span>
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

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-cyan-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Discharge Settlements</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
            ₹3,40,000
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 border border-blue-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              6 Settled
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Receipts Issued</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
              <Receipt className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Expense Vouchers Paid</span>
          </div>
          <div className="text-2xl font-bold text-rose-700 tracking-tight mb-2.5">
            ₹24,500
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-700 border border-rose-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              5 Vouchers
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Petty Cash</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-600">Pending IP Balances</span>
          </div>
          <div className="text-2xl font-bold text-amber-700 tracking-tight mb-2.5">
            ₹1,12,000
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200/50 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              4 Due
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Discharge Gate</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. DEFAULT: CMO / SUPER ADMIN EXECUTIVE METRICS
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
          <div className="text-[11px] font-medium text-slate-600 mb-2 truncate">
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
