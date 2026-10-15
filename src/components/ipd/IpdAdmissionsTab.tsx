"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  Download,
  MoreHorizontal,
  Printer,
  ArrowRightLeft,
  FileText,
  LogOut,
  FileCheck,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { ActiveAdmission, DischargedPatient, AdmissionStatus, DischargeOutcome } from "@/types";
import { useRole } from "@/context/RoleContext";

interface IpdAdmissionsTabProps {
  activeAdmissions: ActiveAdmission[];
  dischargedPatients: DischargedPatient[];
  onViewPatient: (patient: ActiveAdmission | DischargedPatient) => void;
  onTransferBed: (admission: ActiveAdmission) => void;
  onDischargePatient: (admission: ActiveAdmission) => void;
  onOpenCertificates: (patient: ActiveAdmission | DischargedPatient, certType?: string) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  LD: "bg-blue-100 text-blue-700",
  SB: "bg-violet-100 text-violet-700",
  HP: "bg-rose-100 text-rose-700",
  PS: "bg-teal-100 text-teal-700",
  IQ: "bg-amber-100 text-amber-700",
  AI: "bg-cyan-100 text-cyan-700",
  SR: "bg-emerald-100 text-emerald-700",
  AV: "bg-purple-100 text-purple-700",
  MK: "bg-indigo-100 text-indigo-700",
  DK: "bg-orange-100 text-orange-700",
  RN: "bg-slate-200 text-slate-800",
  NK: "bg-pink-100 text-pink-700",
  GY: "bg-amber-100 text-amber-800",
  AM: "bg-teal-100 text-teal-800",
};

export const IpdAdmissionsTab: React.FC<IpdAdmissionsTabProps> = ({
  activeAdmissions,
  dischargedPatients,
  onViewPatient,
  onTransferBed,
  onDischargePatient,
  onOpenCertificates,
}) => {
  const { currentRole } = useRole();
  const [subView, setSubView] = useState<"active" | "discharged">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter active admissions
  const filteredActive = activeAdmissions.filter((adm) => {
    if (selectedWard !== "All" && adm.wardName !== selectedWard) return false;
    if (selectedDoctor !== "All" && adm.attendingDoctor !== selectedDoctor) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      adm.name.toLowerCase().includes(q) ||
      adm.ipNo.toLowerCase().includes(q) ||
      adm.mrId.toLowerCase().includes(q) ||
      adm.wardBed.toLowerCase().includes(q) ||
      adm.diagnosis.toLowerCase().includes(q) ||
      adm.attendingDoctor.toLowerCase().includes(q)
    );
  });

  // Filter discharged patients
  const filteredDischarged = dischargedPatients.filter((dis) => {
    if (selectedDoctor !== "All" && dis.attendingDoctor !== selectedDoctor) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dis.name.toLowerCase().includes(q) ||
      dis.ipNo.toLowerCase().includes(q) ||
      dis.mrId.toLowerCase().includes(q) ||
      dis.diagnosis.toLowerCase().includes(q) ||
      dis.attendingDoctor.toLowerCase().includes(q)
    );
  });

  const getAdmissionStatusBadge = (status: AdmissionStatus) => {
    switch (status) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Critical
          </span>
        );
      case "Under Observation":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Under Observation
          </span>
        );
      case "Stable":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Stable
          </span>
        );
      case "Ready for Discharge":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Ready for Discharge
          </span>
        );
    }
  };

  const getDischargeOutcomeBadge = (outcome: DischargeOutcome) => {
    switch (outcome) {
      case "Recovered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Recovered
          </span>
        );
      case "Referred":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            Referred
          </span>
        );
      case "LAMA":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            LAMA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {outcome}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-view Segmented Toggle (Matching Active-Admissions.jpg & user image) */}
      <div className="flex items-center justify-between pb-1">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setSubView("active")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              subView === "active"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active Admissions ({activeAdmissions.length})
          </button>
          <button
            onClick={() => setSubView("discharged")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              subView === "discharged"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Discharged Patients ({dischargedPatients.length})
          </button>
        </div>

        <button
          onClick={() => alert("Exporting Inpatient Registry to Excel...")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: ACTIVE ADMISSIONS (designs/Active-Admissions.jpg) */}
      {/* ========================================================================= */}
      {subView === "active" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Top Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900">
                Active Inpatient Admissions
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {filteredActive.length} Admitted Patients
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient, MR ID or IP No"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
              >
                <option value="All">All Wards</option>
                <option value="ICU Ward">ICU Ward</option>
                <option value="General Ward">General Ward</option>
                <option value="Special Private Ward">Special Private Ward</option>
              </select>

              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
              >
                <option value="All">All Doctors</option>
                <option value="Dr. A. Rao">Dr. A. Rao</option>
                <option value="Dr. V. Menon">Dr. V. Menon</option>
                <option value="Dr. S. Reddy">Dr. S. Reddy</option>
                <option value="Dr. P. Nair">Dr. P. Nair</option>
                <option value="Dr. K. Sharma">Dr. K. Sharma</option>
                <option value="Dr. M. Iyer">Dr. M. Iyer</option>
              </select>

              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">IP No ↑</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Ward / Bed</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Admitted On</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Bill So Far</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActive.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/70 transition group">
                    <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900">
                      {adm.ipNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            AVATAR_COLORS[adm.initials] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {adm.initials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-teal-700 transition">
                            {adm.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {adm.age} / {adm.gender}, {adm.mrId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                        {adm.wardBed}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={adm.diagnosis}>
                      {adm.diagnosis}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {adm.attendingDoctor}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {adm.admittedOn}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {adm.days}
                    </td>
                    <td className="py-3 px-4">
                      {getAdmissionStatusBadge(adm.status)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono text-xs">
                      ₹{adm.billSoFar.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end relative">
                        {adm.status === "Ready for Discharge" ? (
                          <button
                            onClick={() => onDischargePatient(adm)}
                            className="px-3 py-1 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition shadow-2xs"
                          >
                            Discharge
                          </button>
                        ) : (
                          <button
                            onClick={() => onViewPatient(adm)}
                            className="px-3 py-1 border border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-semibold rounded-xl text-xs transition"
                          >
                            View
                          </button>
                        )}

                        {/* More Menu Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdownId(openDropdownId === adm.id ? null : adm.id)
                            }
                            className="p-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>

                          {openDropdownId === adm.id && (
                            <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-30 text-left text-xs">
                              <button
                                onClick={() => {
                                  alert(`Printing Inpatient Admission Slip for ${adm.ipNo}...`);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-400" />
                                Print Admission Slip
                              </button>
                              <button
                                onClick={() => {
                                  onTransferBed(adm);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" />
                                Transfer Bed
                              </button>
                              <button
                                onClick={() => {
                                  onViewPatient(adm);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                View Patient File
                              </button>
                              <button
                                onClick={() => {
                                  onDischargePatient(adm);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-600 font-semibold border-t border-slate-100"
                              >
                                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                                Discharge Patient
                              </button>

                              {/* Certificates Sub-header */}
                              <div className="px-3.5 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100">
                                Certificates & Reports
                              </div>
                              <button
                                onClick={() => {
                                  onOpenCertificates(adm, "Discharge Summary");
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                Discharge Summary
                              </button>
                              {(currentRole === "cmo" ||
                                currentRole === "receptionist" ||
                                currentRole === "cashier") && (
                                <button
                                  onClick={() => {
                                    onOpenCertificates(adm, "Final Consolidated Bill");
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-3.5 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                                  Final Consolidated Bill
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 sm:px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-700">1-{filteredActive.length}</span> of{" "}
              <span className="font-semibold text-slate-700">234</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                &lt;
              </button>
              <button className="w-7 h-7 rounded-lg bg-teal-800 text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                34
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DISCHARGED PATIENTS (Matching user uploaded image) */}
      {/* ========================================================================= */}
      {subView === "discharged" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Top Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Discharged Patients Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Completed hospital admissions with verified outcomes, final billing settlements & certificates
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>01 Oct 2026 - 12 Oct 2026</span>
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="Obstetrics">Obstetrics</option>
                <option value="General Surgery">General Surgery</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Urology">Urology</option>
              </select>

              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
              >
                <option value="All">All Doctors</option>
                <option value="Dr. P. Nair">Dr. P. Nair</option>
                <option value="Dr. R. Bose">Dr. R. Bose</option>
                <option value="Dr. K. Sharma">Dr. K. Sharma</option>
                <option value="Dr. A. Rao">Dr. A. Rao</option>
                <option value="Dr. S. Reddy">Dr. S. Reddy</option>
              </select>

              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient, MR ID, OP No or phone"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">IP No ↑</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4">Attending Doctor ⇅</th>
                  <th className="py-3 px-4">Admitted ⇅</th>
                  <th className="py-3 px-4">Discharged ⇅</th>
                  <th className="py-3 px-4">Stay ⇅</th>
                  <th className="py-3 px-4">Outcome ⇅</th>
                  <th className="py-3 px-4">Final Bill</th>
                  <th className="py-3 px-4">Payment ⇅</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDischarged.map((dis) => (
                  <tr key={dis.id} className="hover:bg-slate-50/70 transition group">
                    <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900">
                      {dis.ipNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            AVATAR_COLORS[dis.initials] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {dis.initials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-teal-700 transition">
                            {dis.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {dis.age} / {dis.gender}, {dis.mrId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {dis.diagnosis}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {dis.attendingDoctor}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {dis.admittedDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {dis.dischargedDate}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {dis.stayDays} days
                    </td>
                    <td className="py-3 px-4">
                      {getDischargeOutcomeBadge(dis.outcome)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono text-xs">
                      ₹{dis.finalBill.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {dis.paymentStatus === "Paid" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Paid
                        </span>
                      )}
                      {dis.paymentStatus === "Partial" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Partial
                        </span>
                      )}
                      {dis.paymentStatus === "Unpaid" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          onClick={() => onOpenCertificates(dis, "Discharge Summary")}
                          className="px-3 py-1 bg-white border border-slate-300 hover:border-teal-700 text-slate-800 font-bold rounded-xl text-xs transition shadow-2xs hover:bg-slate-50"
                        >
                          Certificates
                        </button>
                        <button
                          onClick={() => onViewPatient(dis)}
                          className="p-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 sm:px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-700">1-{filteredDischarged.length}</span> of{" "}
              <span className="font-semibold text-slate-700">1,046</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="mr-2">page</span>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                &lt;
              </button>
              <button className="w-7 h-7 rounded-lg bg-teal-800 text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                150
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
