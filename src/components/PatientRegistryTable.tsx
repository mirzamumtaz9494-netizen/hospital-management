"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
  FileText,
  Printer,
  UserCheck,
  Edit,
  Eye,
  PlusCircle,
  X,
} from "lucide-react";
import { Patient, PatientStatus } from "@/types";

interface PatientRegistryTableProps {
  patients: Patient[];
  onViewPatient: (patient: Patient) => void;
  onPrintSlip: (patient: Patient) => void;
  onAdmitPatient?: (patient: Patient) => void;
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
];

export const PatientRegistryTable: React.FC<PatientRegistryTableProps> = ({
  patients,
  onViewPatient,
  onPrintSlip,
  onAdmitPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "discharged">("active");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Patient>("mrId");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter patients based on search and tab
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Tab filter
      if (activeTab === "active" && patient.status === "Discharged") return false;
      if (activeTab === "discharged" && patient.status !== "Discharged") return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(q) ||
        patient.mrId.toLowerCase().includes(q) ||
        patient.opIpId.toLowerCase().includes(q) ||
        patient.department.toLowerCase().includes(q) ||
        patient.attendingDoctor.toLowerCase().includes(q) ||
        patient.phone.includes(q)
      );
    });
  }, [patients, activeTab, searchQuery]);

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Critical
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        );
      case "Discharged":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300/60">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Discharged
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="patients">
      {/* Table Top Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Patient Registry
          </h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredPatients.length} records
          </span>
        </div>

        {/* Right Controls: Search + Filters + Tab Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Instant Search Input */}
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Instant search..."
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>

          {/* Segmented Active/Discharged Tabs */}
          <div className="inline-flex p-1 bg-slate-100 border border-slate-200/70 rounded-xl">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === "active"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active Patients
            </button>
            <button
              onClick={() => setActiveTab("discharged")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === "discharged"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Discharged Patients
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                  <span>Patient MR ID</span>
                  <ChevronUp className="w-3.5 h-3.5 text-teal-600" />
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                  <span>OP/IP ID</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                  <span>Department</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                  <span>Attending Doctor</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                  <span>Admission Date</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {patients.length === 0
                        ? "Clean Production Slate — Ready for Live Admissions"
                        : "No patient records match your filter"}
                    </div>
                    <p className="text-xs text-slate-500">
                      {patients.length === 0
                        ? "Test data has been purged. Click 'Register OP' or 'Register IP' above to register your first real hospital patient."
                        : "Try adjusting your search query or switching tabs."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient, idx) => {
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* MR ID */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <button
                        onClick={() => onViewPatient(patient)}
                        className="text-teal-600 hover:text-teal-700 font-semibold underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition"
                      >
                        {patient.mrId}
                      </button>
                    </td>

                    {/* OP/IP ID */}
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                      {patient.opIpId}
                    </td>

                    {/* Patient Name + Initials Avatar + Age/Gender */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${avatarColor}`}
                        >
                          {patient.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition">
                            {patient.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            {patient.age} / {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {patient.department}
                    </td>

                    {/* Attending Doctor */}
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {patient.attendingDoctor}
                    </td>

                    {/* Admission Date */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {patient.admissionDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(patient.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end relative">
                        {/* Context Action Button (View / Admit / Report) */}
                        <button
                          onClick={() => {
                            if (patient.status === "Pending") {
                              onAdmitPatient?.(patient);
                            } else if (patient.status === "Discharged") {
                              onPrintSlip(patient);
                            } else {
                              onViewPatient(patient);
                            }
                          }}
                          className="px-3.5 py-1 rounded-xl border border-slate-200 hover:border-teal-500 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50/50 transition shadow-2xs"
                        >
                          {patient.status === "Pending"
                            ? "Admit"
                            : patient.status === "Discharged"
                            ? "Report"
                            : "View"}
                        </button>

                        {/* More Actions Dropdown Button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === patient.id ? null : patient.id
                              )
                            }
                            className="p-1 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Action Menu Dropdown */}
                          {openDropdownId === patient.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30 text-left text-xs">
                              <button
                                onClick={() => {
                                  onViewPatient(patient);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                Patient Full File
                              </button>
                              <button
                                onClick={() => {
                                  onPrintSlip(patient);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-400" />
                                Print Consultation Slip
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Generating IP History for ${patient.name}...`);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                Patient IP History
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Initiating new Consultation for ${patient.name}...`);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
                              >
                                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                                New OP Consultation
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-4 sm:px-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{filteredPatients.length > 0 ? `1-${filteredPatients.length}` : "0"}</span> of{" "}
          <span className="font-semibold text-slate-700">{patients.length}</span> patients
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          >
            &lt;
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-300 font-semibold text-teal-700 flex items-center justify-center"
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center"
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center"
          >
            3
          </button>
          <span className="px-1 text-slate-400">...</span>
          <button
            onClick={() => setCurrentPage(50)}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center"
          >
            50
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
