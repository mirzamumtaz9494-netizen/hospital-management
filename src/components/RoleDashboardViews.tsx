"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Bed,
  Users,
  Activity,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FlaskConical,
  Pill,
  Wallet,
  CreditCard,
  Receipt,
  ArrowRight,
  ExternalLink,
  Search,
} from "lucide-react";
import { MOCK_OP_QUEUE } from "@/data/opdMockData";
import { MOCK_ACTIVE_ADMISSIONS } from "@/data/ipdMockData";
import { MOCK_HOSPITAL_SERVICES } from "@/data/servicesMockData";

/* ========================================================================= */
/* 1. DOCTOR DASHBOARD VIEW */
/* ========================================================================= */
export const DoctorDashboardView: React.FC = () => {
  const [subView, setSubView] = useState<"op_queue" | "ip_rounds">("op_queue");
  const [search, setSearch] = useState("");

  const opQueue = MOCK_OP_QUEUE.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.token.toLowerCase().includes(search.toLowerCase()) ||
      item.mrId.toLowerCase().includes(search.toLowerCase())
  );

  const ipPatients = MOCK_ACTIVE_ADMISSIONS.filter(
    (adm) =>
      adm.name.toLowerCase().includes(search.toLowerCase()) ||
      adm.wardBed.toLowerCase().includes(search.toLowerCase()) ||
      adm.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Doctor&apos;s Clinical Workstation
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Live Clinic
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Assigned outpatient consultations queue &amp; inpatient ward rounds
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setSubView("op_queue")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                subView === "op_queue"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OP Queue ({opQueue.length})
            </button>
            <button
              onClick={() => setSubView("ip_rounds")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                subView === "ip_rounds"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              IP Rounds ({ipPatients.length})
            </button>
          </div>

          <Link
            href={subView === "op_queue" ? "/opd" : "/ipd"}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <span>Open {subView === "op_queue" ? "OPD Clinic" : "IPD Wards"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-3.5 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              subView === "op_queue"
                ? "Search token, patient or MR ID..."
                : "Search bed, patient or diagnosis..."
            }
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium hidden md:inline">
          Showing {subView === "op_queue" ? opQueue.length : ipPatients.length} active clinical records
        </span>
      </div>

      {/* Content: OP Queue Table */}
      {subView === "op_queue" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Department / Doctor</th>
                <th className="py-3 px-4">Check-in / Wait</th>
                <th className="py-3 px-4">Vital Signs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Consultation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {opQueue.slice(0, 6).map((item) => (
                <tr key={item.id} className="hover:bg-teal-50/20 transition">
                  <td className="py-3 px-4 font-mono font-black text-teal-800">
                    {item.token}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.age}y / {item.gender} • <span className="font-mono">{item.mrId}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    <div>{item.department}</div>
                    <div className="text-[11px] text-slate-400">{item.doctor}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    <div>{item.checkIn}</div>
                    <div className="text-[10px] text-slate-400">{item.waitTime}</div>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600 font-medium">
                    {item.vitalSummary || "BP 120/80 • SpO2 99%"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "In Consultation"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : item.status === "Waiting"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "In Consultation"
                            ? "bg-blue-600"
                            : item.status === "Waiting"
                            ? "bg-amber-500"
                            : "bg-emerald-600"
                        }`}
                      ></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/opd"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold transition shadow-2xs"
                    >
                      <Stethoscope className="w-3 h-3" />
                      <span>{item.status === "Waiting" ? "Call In" : "Consult"}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content: IP Rounds Table */}
      {subView === "ip_rounds" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Ward / Bed</th>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Primary Diagnosis</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Admitted / Days</th>
                <th className="py-3 px-4">Clinical Status</th>
                <th className="py-3 px-4 text-right">Rounds Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ipPatients.slice(0, 6).map((adm) => (
                <tr key={adm.id} className="hover:bg-teal-50/20 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {adm.wardBed}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{adm.wardName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{adm.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {adm.age}y / {adm.gender} • <span className="font-mono">{adm.ipNo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 max-w-[200px] truncate">
                    {adm.diagnosis}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {adm.attendingDoctor}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    <div>{adm.admittedOn}</div>
                    <div className="text-[10px] text-slate-400">Day {adm.days}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        adm.status === "Critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
                          : adm.status === "Ready for Discharge"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {adm.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/ipd"
                      className="inline-flex items-center gap-1 px-3 py-1 border border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-semibold transition"
                    >
                      <Bed className="w-3 h-3 text-teal-600" />
                      <span>Chart</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium">
          CarePulse Hospital HMS • Electronic Health Record (EHR) Module
        </span>
        <Link
          href={subView === "op_queue" ? "/opd" : "/ipd"}
          className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 hover:underline"
        >
          <span>View All Records in {subView === "op_queue" ? "OPD" : "IPD"}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. NURSE DASHBOARD VIEW */
/* ========================================================================= */
export const NurseDashboardView: React.FC = () => {
  const activeBeds = MOCK_ACTIVE_ADMISSIONS.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Ward Nursing Station &amp; Bed Roster
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Shift Duty Active
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Inpatient vitals schedule, medication rounds, and nursing shift handovers
            </p>
          </div>
        </div>

        <Link
          href="/ipd"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <span>Bed Management Grid</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Bed #</th>
              <th className="py-3 px-4">Patient Name &amp; IP No</th>
              <th className="py-3 px-4">Ward / Floor</th>
              <th className="py-3 px-4">Attending Clinician</th>
              <th className="py-3 px-4">Diagnosis</th>
              <th className="py-3 px-4">Vitals Monitoring</th>
              <th className="py-3 px-4 text-right">Nurse Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeBeds.map((adm) => (
              <tr key={adm.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-4 font-mono font-black text-slate-900">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">{adm.wardBed}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{adm.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{adm.ipNo}</div>
                </td>
                <td className="py-3 px-4 font-medium text-slate-700">{adm.wardName}</td>
                <td className="py-3 px-4 font-medium text-slate-800">{adm.attendingDoctor}</td>
                <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{adm.diagnosis}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Activity className="w-3 h-3 text-emerald-600" />
                    Logged at 11:30 AM
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href="/ipd"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:border-teal-500 text-teal-800 font-semibold rounded-lg text-xs transition"
                  >
                    <span>Vitals / Chart</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Ward Floors 1, 2 &amp; 3 • ICU Station</span>
        <Link href="/ipd" className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1">
          <span>Full Bed Roster</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. CASHIER DASHBOARD VIEW */
/* ========================================================================= */
export const CashierDashboardView: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Billing Cash Counter &amp; Collections Ledger
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Register Open
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              OP consultation bills, IP discharge settlement receipts, and petty cash expense vouchers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/accounts"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <span>Day Book Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Cashier Action Cards */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/30">
        <Link
          href="/accounts"
          className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-teal-500 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-800 group-hover:text-teal-800">
              IP Discharge Billing
            </span>
            <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </div>
          <p className="text-[11px] text-slate-500">
            Final discharge bill clearance, itemized tariff statement, settlement print
          </p>
        </Link>

        <Link
          href="/opd"
          className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-teal-500 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-800 group-hover:text-teal-800">
              OP Consultation Receipts
            </span>
            <Receipt className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </div>
          <p className="text-[11px] text-slate-500">
            Outpatient tokens, consultant fee collection, duplicate receipt reissue
          </p>
        </Link>

        <Link
          href="/accounts"
          className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-teal-500 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-800 group-hover:text-teal-800">
              Day Book &amp; Cash Balancing
            </span>
            <Wallet className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </div>
          <p className="text-[11px] text-slate-500">
            Cash in vault reconciliation, UPI/card gateway logs, daily deposit report
          </p>
        </Link>
      </div>

      <div className="p-3 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
        <span>Counter 01 • Main Hospital Lobby</span>
        <Link href="/accounts" className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1">
          <span>Go to Accounts</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 4. PHARMACIST DASHBOARD VIEW */
/* ========================================================================= */
export const PharmacistDashboardView: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Central Pharmacy Dispensing Desk
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                POS Active
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Doctor e-prescriptions, outpatient medicine POS, and inventory stock control
            </p>
          </div>
        </div>

        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <span>Open Pharmacy POS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-6 text-center text-slate-500">
        <p className="text-xs mb-3">
          12 prescriptions currently awaiting fulfillment at the retail counter.
        </p>
        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <Pill className="w-4 h-4" />
          <span>Launch Dispensing Counter</span>
        </Link>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 5. LAB TECH DASHBOARD VIEW */
/* ========================================================================= */
export const LabTechDashboardView: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Diagnostic Laboratory &amp; Analyzer Station
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                NABL Accredited
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Sample accessioning, analyzer telemetry, diagnostic reports entry, and pathologist sign-off
            </p>
          </div>
        </div>

        <Link
          href="/laboratory"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <span>Open Lab Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-6 text-center text-slate-500">
        <p className="text-xs mb-3">
          38 blood and pathology specimens currently running on automated analyzers.
        </p>
        <Link
          href="/laboratory"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <FlaskConical className="w-4 h-4" />
          <span>Launch Analyzer Accessioning</span>
        </Link>
      </div>
    </div>
  );
};
