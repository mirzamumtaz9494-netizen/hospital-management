"use client";

import React, { useState } from "react";
import {
  Users,
  Hourglass,
  Stethoscope,
  CheckCircle,
  Clock,
  IndianRupee,
  PhoneCall,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Printer,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  MoreHorizontal,
  Eye,
  FileText,
} from "lucide-react";
import { OpQueueItem, AllOpRecord, Patient } from "@/types";

interface OpdQueueTabProps {
  queue: OpQueueItem[];
  allRecords: AllOpRecord[];
  onCallIn: (item: OpQueueItem) => void;
  onOpenConsultation: (item: OpQueueItem) => void;
  onPrintSlip: (patient: Patient) => void;
  onViewRecord: (record: AllOpRecord) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  RK: "bg-blue-100 text-blue-700",
  SS: "bg-orange-100 text-orange-700",
  MI: "bg-purple-100 text-purple-700",
  KR: "bg-rose-100 text-rose-700",
  VR: "bg-teal-100 text-teal-700",
  AD: "bg-pink-100 text-pink-700",
  RG: "bg-emerald-100 text-emerald-700",
  FA: "bg-indigo-100 text-indigo-700",
  MJ: "bg-amber-100 text-amber-700",
  DM: "bg-cyan-100 text-cyan-700",
  SB: "bg-violet-100 text-violet-700",
};

export const OpdQueueTab: React.FC<OpdQueueTabProps> = ({
  queue,
  allRecords,
  onCallIn,
  onOpenConsultation,
  onPrintSlip,
  onViewRecord,
}) => {
  const [subView, setSubView] = useState<"daily" | "all">("daily");
  const [statusFilter, setStatusFilter] = useState<"All" | "Waiting" | "In Consultation" | "Completed">("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<"All" | "Paid" | "Unpaid" | "Partial">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [dateRange, setDateRange] = useState("01 Oct 2026 - 12 Oct 2026");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.token.toLowerCase().includes(q) ||
      item.mrId.toLowerCase().includes(q) ||
      item.doctor.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q)
    );
  });

  // Filtered all records
  const filteredRecords = allRecords.filter((rec) => {
    if (paymentStatusFilter !== "All" && rec.paymentStatus !== paymentStatusFilter) return false;
    if (selectedDept !== "All" && rec.department !== selectedDept) return false;
    if (selectedDoctor !== "All" && rec.doctor !== selectedDoctor) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.name.toLowerCase().includes(q) ||
      rec.opNo.toLowerCase().includes(q) ||
      rec.mrId.toLowerCase().includes(q) ||
      rec.phone.includes(q) ||
      rec.doctor.toLowerCase().includes(q) ||
      rec.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Sub-view Toggle Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setSubView("daily")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              subView === "daily"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daily Queue
          </button>
          <button
            onClick={() => setSubView("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              subView === "all"
                ? "bg-teal-800 text-white shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All OP Records
          </button>
        </div>

        {subView === "all" && (
          <button
            onClick={() => alert("Exporting Outpatient Records to Excel / CSV...")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUBVIEW 1: DAILY QUEUE */}
      {/* ========================================================================= */}
      {subView === "daily" && (
        <div className="space-y-5">
          {/* 6 Mini KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                Total OP Visits Today
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">142</div>
              <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
                <ArrowUpRight className="w-3 h-3" /> 8.4%
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <Hourglass className="w-3.5 h-3.5 text-amber-500" />
                Waiting
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">23</div>
              <span className="text-slate-400 text-[10px]">Queue backlog</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                In Consultation
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">9</div>
              <span className="text-slate-400 text-[10px]">Active cabins</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Completed
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">104</div>
              <span className="text-slate-400 text-[10px]">Consulted</span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Avg. Wait Time
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">14 min</div>
              <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
                <ArrowDownRight className="w-3 h-3" /> 2 min
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                OP Revenue Today
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">₹1,85,400</div>
              <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
                <ArrowUpRight className="w-3 h-3" /> 8.4%
              </span>
            </div>
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
            {/* Left 3 cols: Live OP Queue Table */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-900">
                  Live OP Queue
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search patient, MR ID or token"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>

                  <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
                    {(["All", "Waiting", "In Consultation", "Completed"] as const).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                            statusFilter === st
                              ? "bg-white text-slate-900 shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Token ↑</th>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Department ⇅</th>
                      <th className="py-3 px-4">Doctor ⇅</th>
                      <th className="py-3 px-4">Visit Type ⇅</th>
                      <th className="py-3 px-4">Check-in</th>
                      <th className="py-3 px-4">Wait</th>
                      <th className="py-3 px-4">Status ⇅</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900 font-mono text-sm">
                          {item.token}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                                AVATAR_COLORS[item.initials] || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {item.initials}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {item.age} / {item.gender}, {item.mrId}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{item.department}</td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{item.doctor}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.visitType === "New"
                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {item.visitType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{item.checkIn}</td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{item.waitTime}</td>
                        <td className="py-3 px-4">
                          {item.status === "In Consultation" && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              In Consultation
                            </span>
                          )}
                          {item.status === "Waiting" && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Waiting
                            </span>
                          )}
                          {item.status === "Completed" && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Completed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => {
                                if (item.status === "Waiting") {
                                  onCallIn(item);
                                } else {
                                  onOpenConsultation(item);
                                }
                              }}
                              className="px-3 py-1 rounded-xl border border-slate-200 hover:border-teal-500 text-xs font-semibold text-slate-700 hover:text-teal-700 transition"
                            >
                              {item.status === "Waiting"
                                ? "Call In"
                                : item.status === "In Consultation"
                                ? "Open"
                                : "Bill"}
                            </button>
                            <button
                              onClick={() =>
                                onPrintSlip({
                                  id: item.id,
                                  mrId: item.mrId,
                                  opIpId: item.token,
                                  type: "OP",
                                  name: item.name,
                                  initials: item.initials,
                                  age: item.age,
                                  gender: item.gender,
                                  phone: item.phone,
                                  department: item.department,
                                  attendingDoctor: item.doctor,
                                  admissionDate: "12 Oct 2026",
                                  status: "Active",
                                  billAmount: item.billAmount || 500,
                                })
                              }
                              className="p-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
                              title="Print Token Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 col: Doctors on Duty + Today's Appointments */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
                <h3 className="font-bold text-slate-900 text-sm mb-3">
                  Doctors on Duty
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { initials: "RK", name: "Dr. S. Reddy", dept: "Cardiology", waiting: "9 waiting", dot: "bg-emerald-500" },
                    { initials: "MI", name: "Dr. K. Sharma", dept: "General Medicine", waiting: "6 waiting", dot: "bg-amber-500" },
                    { initials: "AV", name: "Dr. A. Rao", dept: "Orthopedics", waiting: "4 waiting", dot: "bg-amber-500" },
                    { initials: "DP", name: "Dr. P. Nair", dept: "Gynecology", waiting: "3 waiting", dot: "bg-emerald-500" },
                    { initials: "DR", name: "Dr. M. Iyer", dept: "Pediatrics", waiting: "1 waiting", dot: "bg-slate-400" },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                          {doc.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {doc.dept} • {doc.waiting}
                          </div>
                        </div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${doc.dot}`}></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
                <h3 className="font-bold text-slate-900 text-sm mb-3">
                  Today&apos;s Appointments
                </h3>
                <div className="space-y-3.5 text-xs">
                  {[
                    { time: "10:00 AM", patient: "Ankit Rao", doctor: "Dr. K. Sharma", status: "Confirmed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { time: "10:30 AM", patient: "Meena Joshi", doctor: "Dr. S. Reddy", status: "Confirmed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { time: "11:00 AM", patient: "Farhan Ali", doctor: "Dr. P. Nair", status: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
                  ].map((apt, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-500">{apt.time}</span>
                          <span className="font-bold text-slate-900">{apt.patient}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {apt.doctor}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${apt.color}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBVIEW 2: ALL OP RECORDS (Matching designs/All-OP-Records-screen-Design.jpg) */}
      {/* ========================================================================= */}
      {subView === "all" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Top Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Outpatient Records
                </h2>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-700">Total Bills ₹5,300</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Paid ₹3,400</span>
                  <span>•</span>
                  <span className="text-amber-700 font-semibold">Unpaid ₹1,800</span>
                  <span>•</span>
                  <span className="text-blue-700 font-semibold">Partial ₹900</span>
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Date Picker Button */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{dateRange}</span>
                </div>

                {/* Department Dropdown */}
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="All">All Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                </select>

                {/* Doctor Dropdown */}
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="All">All Doctors</option>
                  <option value="Dr. S. Reddy">Dr. S. Reddy</option>
                  <option value="Dr. K. Sharma">Dr. K. Sharma</option>
                  <option value="Dr. A. Rao">Dr. A. Rao</option>
                  <option value="Dr. P. Nair">Dr. P. Nair</option>
                  <option value="Dr. M. Iyer">Dr. M. Iyer</option>
                  <option value="Dr. V. Menon">Dr. V. Menon</option>
                </select>

                {/* Payment Status Dropdown */}
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="All">Payment: All</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                </select>

                {/* Search Input */}
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
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">OP No ↑</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Visit Date ⇅</th>
                  <th className="py-3 px-4">Department ⇅</th>
                  <th className="py-3 px-4">Doctor ⇅</th>
                  <th className="py-3 px-4">Visit Type ⇅</th>
                  <th className="py-3 px-4">Bill Amount ⇅</th>
                  <th className="py-3 px-4">Payment ⇅</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition group">
                    <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900 text-xs">
                      {rec.opNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            AVATAR_COLORS[rec.initials] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {rec.initials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-teal-700 transition">
                            {rec.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {rec.age} / {rec.gender}, {rec.mrId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{rec.visitDate}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{rec.department}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{rec.doctor}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.visitType === "New"
                            ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {rec.visitType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{rec.billAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {rec.paymentStatus === "Paid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Paid
                        </span>
                      )}
                      {rec.paymentStatus === "Unpaid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Unpaid
                        </span>
                      )}
                      {rec.paymentStatus === "Partial" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Partial
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end relative">
                        <button
                          onClick={() => onViewRecord(rec)}
                          className="px-3 py-1 rounded-xl border border-slate-200 hover:border-teal-500 text-xs font-semibold text-slate-700 hover:text-teal-700 transition"
                        >
                          View
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdownId(openDropdownId === rec.id ? null : rec.id)
                            }
                            className="p-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                          {openDropdownId === rec.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-left text-xs">
                              <button
                                onClick={() => {
                                  onViewRecord(rec);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                View Full OP Record
                              </button>
                              <button
                                onClick={() => {
                                  onPrintSlip({
                                    id: rec.id,
                                    mrId: rec.mrId,
                                    opIpId: rec.opNo,
                                    type: "OP",
                                    name: rec.name,
                                    initials: rec.initials,
                                    age: rec.age,
                                    gender: rec.gender,
                                    phone: rec.phone,
                                    department: rec.department,
                                    attendingDoctor: rec.doctor,
                                    admissionDate: rec.visitDate,
                                    status: "Active",
                                    billAmount: rec.billAmount,
                                  });
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-400" />
                                Print Consultation Slip
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Printing Official OPD Bill for ${rec.opNo}...`);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                Print Bill Receipt
                              </button>
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
              Showing <span className="font-semibold text-slate-700">1-{filteredRecords.length}</span> of{" "}
              <span className="font-semibold text-slate-700">1,284</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                &lt;
              </button>
              <button className="w-7 h-7 rounded-lg bg-teal-800 text-white font-bold flex items-center justify-center shadow-2xs">
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
                184
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
