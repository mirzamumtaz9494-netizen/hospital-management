"use client";

import React, { useState } from "react";
import {
  Bed,
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  ArrowRightLeft,
  ChevronDown,
  Building,
  AlertCircle,
  Eye,
} from "lucide-react";
import { IpdBed, ActiveAdmission } from "@/types";
import { MOCK_IPD_METRICS } from "@/data/ipdMockData";

interface IpdBedMapTabProps {
  beds: IpdBed[];
  onSelectBedPatient: (bed: IpdBed) => void;
  onTransferBed: (bed: IpdBed) => void;
}

export const IpdBedMapTab: React.FC<IpdBedMapTabProps> = ({
  beds,
  onSelectBedPatient,
  onTransferBed,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("All");
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [activePopoverBedId, setActivePopoverBedId] = useState<string | null>("b-7"); // Default open on Lakshmi Devi (ICU-07) as shown in design!

  const filteredBeds = beds.filter((b) => {
    if (selectedWard !== "All" && b.ward !== selectedWard) return false;
    if (selectedFloor !== "All" && b.floor !== selectedFloor) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bedNumber.toLowerCase().includes(q) ||
      (b.patientName && b.patientName.toLowerCase().includes(q)) ||
      (b.mrId && b.mrId.toLowerCase().includes(q)) ||
      (b.doctor && b.doctor.toLowerCase().includes(q))
    );
  });

  const icuBeds = filteredBeds.filter((b) => b.ward === "ICU");
  const generalBeds = filteredBeds.filter((b) => b.ward === "General Ward");
  const privateBeds = filteredBeds.filter((b) => b.ward === "Private Rooms");

  return (
    <div className="space-y-5">
      {/* 6 Top Metric Cards (Matching Inpatient-Bed-Map-view.jpg) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Beds</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {MOCK_IPD_METRICS.totalBeds}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Occupied</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            {MOCK_IPD_METRICS.occupied}{" "}
            <span className="text-sm font-semibold text-slate-500">
              ({MOCK_IPD_METRICS.occupancyPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-teal-700 h-full rounded-full" style={{ width: "78%" }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Vacant</div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight">
            {MOCK_IPD_METRICS.vacant}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Cleaning</div>
          <div className="text-2xl font-black text-amber-700 tracking-tight">
            {MOCK_IPD_METRICS.cleaning}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Admissions Today</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {MOCK_IPD_METRICS.admissionsToday}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Discharges Today</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {MOCK_IPD_METRICS.dischargesToday}
          </div>
        </div>
      </div>

      {/* Main Bed Allocation Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-6">
        {/* Top Filter & Legend Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Bed Allocation
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bed or patient"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Ward Selector */}
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Wards</option>
              <option value="ICU">ICU</option>
              <option value="General Ward">General Ward</option>
              <option value="Private Rooms">Private Rooms</option>
            </select>

            {/* Floor Selector */}
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Floors</option>
              <option value="Floor 1">Floor 1</option>
              <option value="Floor 2">Floor 2</option>
              <option value="Floor 3">Floor 3</option>
            </select>

            {/* Legend pills */}
            <div className="flex items-center gap-3 pl-2 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-teal-800">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                Occupied 234
              </span>
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Vacant 58
              </span>
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Cleaning 8
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: ICU (36 / 40 occupied) */}
        {/* ========================================================================= */}
        {icuBeds.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-sm">ICU</span>
                <span className="text-xs font-medium text-slate-500">
                  36 / 40 occupied
                </span>
                <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                  <div className="bg-teal-700 h-full rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
              <button className="text-xs font-semibold text-teal-700 hover:text-teal-800">
                View all beds
              </button>
            </div>

            {/* ICU Beds Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
              {icuBeds.map((bed) => {
                const isSelected = activePopoverBedId === bed.id;
                return (
                  <div key={bed.id} className="relative">
                    <button
                      onClick={() =>
                        setActivePopoverBedId(isSelected ? null : bed.id)
                      }
                      className={`w-full p-2.5 rounded-xl border text-center transition flex flex-col justify-between h-20 group ${
                        bed.status === "Occupied"
                          ? "bg-teal-50/70 border-teal-200/90 hover:border-teal-600 hover:bg-teal-100/60"
                          : bed.status === "Cleaning"
                          ? "bg-amber-50/80 border-amber-200 hover:border-amber-500"
                          : "bg-white border-slate-200 hover:border-emerald-500"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-slate-900 text-xs font-mono">
                          {bed.bedNumber}
                        </span>
                        {bed.isCritical && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Critical Triage"></span>
                        )}
                      </div>

                      <div className="text-[11px] font-medium">
                        {bed.status === "Occupied" && (
                          <span className="text-teal-900 font-semibold truncate block">
                            <span className="text-slate-400 font-mono text-[9px] mr-1">{bed.patientInitials}</span>
                            Occupied
                          </span>
                        )}
                        {bed.status === "Vacant" && (
                          <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Vacant
                          </span>
                        )}
                        {bed.status === "Cleaning" && (
                          <span className="text-amber-800 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Cleaning
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Popover (Matching design) */}
                    {isSelected && bed.status === "Occupied" && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 z-30 text-left text-xs animate-in zoom-in-95">
                        <div className="font-bold text-slate-900 text-xs">
                          {bed.patientName || "Lakshmi Devi"} • {bed.patientAge || 67} / {bed.patientGender || "F"}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {bed.doctor || "Dr. A. Rao"} • {bed.department || "Orthopedics"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Admitted {bed.admittedDate || "10 Oct 2026"} • Day {bed.dayCount || 2}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectBedPatient(bed);
                              setActivePopoverBedId(null);
                            }}
                            className="flex-1 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-800 text-[11px] text-center"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              onTransferBed(bed);
                              setActivePopoverBedId(null);
                            }}
                            className="flex-1 py-1 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-[11px] text-center"
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: GENERAL WARD (142 / 180 occupied) */}
        {/* ========================================================================= */}
        {generalBeds.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-sm">General Ward</span>
                <span className="text-xs font-medium text-slate-500">
                  142 / 180 occupied
                </span>
                <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                  <div className="bg-teal-700 h-full rounded-full" style={{ width: "79%" }}></div>
                </div>
              </div>
              <button className="text-xs font-semibold text-teal-700 hover:text-teal-800">
                View all beds
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
              {generalBeds.map((bed) => {
                const isSelected = activePopoverBedId === bed.id;
                return (
                  <div key={bed.id} className="relative">
                    <button
                      onClick={() =>
                        setActivePopoverBedId(isSelected ? null : bed.id)
                      }
                      className={`w-full p-2.5 rounded-xl border text-center transition flex flex-col justify-between h-20 ${
                        bed.status === "Occupied"
                          ? "bg-teal-50/70 border-teal-200/90 hover:border-teal-600 hover:bg-teal-100/60"
                          : bed.status === "Cleaning"
                          ? "bg-amber-50/80 border-amber-200 hover:border-amber-500"
                          : "bg-white border-slate-200 hover:border-emerald-500"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-slate-900 text-xs font-mono">
                          {bed.bedNumber}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium">
                        {bed.status === "Occupied" && (
                          <span className="text-teal-900 font-semibold truncate block">
                            <span className="text-slate-400 font-mono text-[9px] mr-1">{bed.patientInitials}</span>
                            Occupied
                          </span>
                        )}
                        {bed.status === "Vacant" && (
                          <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Vacant
                          </span>
                        )}
                        {bed.status === "Cleaning" && (
                          <span className="text-amber-800 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Cleaning
                          </span>
                        )}
                      </div>
                    </button>

                    {isSelected && bed.status === "Occupied" && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 z-30 text-left text-xs animate-in zoom-in-95">
                        <div className="font-bold text-slate-900 text-xs">
                          {bed.patientName || "Admitted Patient"}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {bed.doctor || "Medical Officer"} • {bed.department || "General Ward"}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectBedPatient(bed);
                              setActivePopoverBedId(null);
                            }}
                            className="flex-1 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-800 text-[11px] text-center"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              onTransferBed(bed);
                              setActivePopoverBedId(null);
                            }}
                            className="flex-1 py-1 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-[11px] text-center"
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: PRIVATE ROOMS (56 / 80 occupied) */}
        {/* ========================================================================= */}
        {privateBeds.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-sm">Private Rooms</span>
                <span className="text-xs font-medium text-slate-500">
                  56 / 80 occupied
                </span>
                <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                  <div className="bg-teal-700 h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>
              <button className="text-xs font-semibold text-teal-700 hover:text-teal-800">
                View all beds
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
              {privateBeds.map((bed) => {
                const isSelected = activePopoverBedId === bed.id;
                return (
                  <div key={bed.id} className="relative">
                    <button
                      onClick={() =>
                        setActivePopoverBedId(isSelected ? null : bed.id)
                      }
                      className={`w-full p-2.5 rounded-xl border text-center transition flex flex-col justify-between h-20 ${
                        bed.status === "Occupied"
                          ? "bg-teal-50/70 border-teal-200/90 hover:border-teal-600 hover:bg-teal-100/60"
                          : bed.status === "Cleaning"
                          ? "bg-amber-50/80 border-amber-200 hover:border-amber-500"
                          : "bg-white border-slate-200 hover:border-emerald-500"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-slate-900 text-xs font-mono">
                          {bed.bedNumber}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium">
                        {bed.status === "Occupied" && (
                          <span className="text-teal-900 font-semibold truncate block">
                            <span className="text-slate-400 font-mono text-[9px] mr-1">{bed.patientInitials}</span>
                            Occupied
                          </span>
                        )}
                        {bed.status === "Vacant" && (
                          <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Vacant
                          </span>
                        )}
                        {bed.status === "Cleaning" && (
                          <span className="text-amber-800 font-semibold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Cleaning
                          </span>
                        )}
                      </div>
                    </button>

                    {isSelected && bed.status === "Occupied" && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 z-30 text-left text-xs animate-in zoom-in-95">
                        <div className="font-bold text-slate-900 text-xs">
                          {bed.patientName || "Private Room Patient"}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {bed.doctor || "Attending Consultant"}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectBedPatient(bed);
                              setActivePopoverBedId(null);
                            }}
                            className="flex-1 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-800 text-[11px] text-center"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              onTransferBed(bed);
                              setActivePopoverBedId(null);
                            }}
                            className="flex-1 py-1 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-[11px] text-center"
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
