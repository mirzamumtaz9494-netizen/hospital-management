"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ChevronsUpDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/Header";
import { CreateOpModal } from "@/components/CreateOpModal";
import { PrintSlipModal } from "@/components/PrintSlipModal";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { Patient } from "@/types";

interface QueueItem {
  id: string;
  token: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  mrId: string;
  department: string;
  doctor: string;
  visitType: "New" | "Follow-up";
  checkIn: string;
  waitTime: string;
  status: "Waiting" | "In Consultation" | "Completed";
}

const INITIAL_QUEUE: QueueItem[] = [
  {
    id: "1",
    token: "A-017",
    name: "Ramesh Kumar",
    initials: "RK",
    age: 54,
    gender: "M",
    mrId: "MR-10245",
    department: "Cardiology",
    doctor: "Dr. S. Reddy",
    visitType: "Follow-up",
    checkIn: "09:15 AM",
    waitTime: "12 min",
    status: "In Consultation",
  },
  {
    id: "2",
    token: "A-018",
    name: "Sunita Sharma",
    initials: "SS",
    age: 41,
    gender: "F",
    mrId: "MR-10311",
    department: "Cardiology",
    doctor: "Dr. S. Reddy",
    visitType: "New",
    checkIn: "09:28 AM",
    waitTime: "18 min",
    status: "Waiting",
  },
  {
    id: "3",
    token: "B-009",
    name: "Mohammed Irfan",
    initials: "MI",
    age: 32,
    gender: "M",
    mrId: "MR-10247",
    department: "General Medicine",
    doctor: "Dr. K. Sharma",
    visitType: "New",
    checkIn: "09:32 AM",
    waitTime: "9 min",
    status: "Waiting",
  },
  {
    id: "4",
    token: "B-008",
    name: "Kavya Reddy",
    initials: "KR",
    age: 26,
    gender: "F",
    mrId: "MR-10298",
    department: "General Medicine",
    doctor: "Dr. K. Sharma",
    visitType: "Follow-up",
    checkIn: "09:05 AM",
    waitTime: "-",
    status: "Completed",
  },
  {
    id: "5",
    token: "C-004",
    name: "Venkat Rao",
    initials: "VR",
    age: 63,
    gender: "M",
    mrId: "MR-10190",
    department: "Orthopedics",
    doctor: "Dr. A. Rao",
    visitType: "Follow-up",
    checkIn: "09:40 AM",
    waitTime: "22 min",
    status: "Waiting",
  },
  {
    id: "6",
    token: "D-011",
    name: "Anita Desai",
    initials: "AD",
    age: 35,
    gender: "F",
    mrId: "MR-10325",
    department: "Gynecology",
    doctor: "Dr. P. Nair",
    visitType: "New",
    checkIn: "08:55 AM",
    waitTime: "-",
    status: "Completed",
  },
  {
    id: "7",
    token: "E-006",
    name: "Rohit Gupta",
    initials: "RG",
    age: 8,
    gender: "M",
    mrId: "MR-10333",
    department: "Pediatrics",
    doctor: "Dr. M. Iyer",
    visitType: "New",
    checkIn: "09:50 AM",
    waitTime: "6 min",
    status: "Waiting",
  },
];

const AVATAR_COLORS: Record<string, string> = {
  RK: "bg-blue-100 text-blue-700",
  SS: "bg-orange-100 text-orange-700",
  MI: "bg-purple-100 text-purple-700",
  KR: "bg-rose-100 text-rose-700",
  VR: "bg-teal-100 text-teal-700",
  AD: "bg-pink-100 text-pink-700",
  RG: "bg-emerald-100 text-emerald-700",
};

export default function OutpatientPage() {
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [activeTab, setActiveTab] = useState<"Queue" | "Appointments" | "Consultations" | "Follow-ups" | "OP Billing">("Queue");
  const [statusFilter, setStatusFilter] = useState<"All" | "Waiting" | "In Consultation" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpModalOpen, setIsOpModalOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [printPatient, setPrintPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCallNext = () => {
    const nextWaiting = queue.find((q) => q.status === "Waiting");
    if (nextWaiting) {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === nextWaiting.id
            ? { ...item, status: "In Consultation" }
            : item
        )
      );
      showToast(`Token ${nextWaiting.token} (${nextWaiting.name}) called into ${nextWaiting.doctor}'s cabin!`);
    } else {
      showToast("No patients currently waiting in queue.");
    }
  };

  const handleNewOpSuccess = (newPatient: Patient) => {
    // Generate next token
    const tokenLetter = newPatient.department === "Cardiology" ? "A" : newPatient.department === "Orthopedics" ? "C" : "B";
    const tokenNumber = Math.floor(15 + Math.random() * 20);
    const newToken = `${tokenLetter}-${String(tokenNumber).padStart(3, "0")}`;

    const newQueueItem: QueueItem = {
      id: String(Date.now()),
      token: newToken,
      name: newPatient.name,
      initials: newPatient.initials,
      age: newPatient.age,
      gender: newPatient.gender,
      mrId: newPatient.mrId,
      department: newPatient.department,
      doctor: newPatient.attendingDoctor,
      visitType: "New",
      checkIn: "Just now",
      waitTime: "0 min",
      status: "Waiting",
    };

    setQueue((prev) => [newQueueItem, ...prev]);
    showToast(`OP Token ${newToken} generated! Opening print preview...`);
    setPrintPatient(newPatient);
  };

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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeNav="OPD"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Breadcrumb + Title + Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-teal-600 font-medium">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Outpatient (OPD)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Outpatient (OPD)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monday, 12 Oct 2026 • Live queue
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCallNext}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-teal-800 rounded-xl text-xs font-bold transition shadow-2xs hover:shadow"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              Call Next
            </button>
            <button
              onClick={() => setIsOpModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              + New OP Registration
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold">
          {(["Queue", "Appointments", "Consultations", "Follow-ups", "OP Billing"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 transition relative ${
                  activeTab === tab
                    ? "text-teal-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700 rounded-full"></span>
                )}
              </button>
            )
          )}
        </div>

        {/* 6 Mini Metric Cards */}
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

        {/* Main Content: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
          {/* Left Column: Live OP Queue Table (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Table Header & Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">
                Live OP Queue
              </h2>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                {/* Search */}
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

                {/* Filter Chips */}
                <button className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                  <span>Department</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                  <span>Doctor</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <button className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Filters</span>
                </button>

                {/* Status Segmented Buttons */}
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

            {/* Queue Table */}
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
                      {/* Token */}
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono text-sm">
                        {item.token}
                      </td>

                      {/* Patient Info */}
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

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {item.department}
                      </td>

                      {/* Doctor */}
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {item.doctor}
                      </td>

                      {/* Visit Type */}
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

                      {/* Check-in */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {item.checkIn}
                      </td>

                      {/* Wait Time */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {item.waitTime}
                      </td>

                      {/* Status */}
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

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => {
                              if (item.status === "Waiting") {
                                setQueue((prev) =>
                                  prev.map((q) =>
                                    q.id === item.id
                                      ? { ...q, status: "In Consultation" }
                                      : q
                                  )
                                );
                                showToast(`Calling ${item.name} (${item.token}) in...`);
                              } else if (item.status === "In Consultation") {
                                setQueue((prev) =>
                                  prev.map((q) =>
                                    q.id === item.id
                                      ? { ...q, status: "Completed" }
                                      : q
                                  )
                                );
                                showToast(`Consultation for ${item.name} completed!`);
                              } else {
                                // Print Bill
                                setPrintPatient({
                                  id: item.id,
                                  mrId: item.mrId,
                                  opIpId: item.token,
                                  type: "OP",
                                  name: item.name,
                                  initials: item.initials,
                                  age: item.age,
                                  gender: item.gender as any,
                                  phone: "9848022334",
                                  department: item.department,
                                  attendingDoctor: item.doctor,
                                  admissionDate: "12 Oct 2026",
                                  status: "Active",
                                  billAmount: 500,
                                });
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
                            onClick={() => {
                              setPrintPatient({
                                id: item.id,
                                mrId: item.mrId,
                                opIpId: item.token,
                                type: "OP",
                                name: item.name,
                                initials: item.initials,
                                age: item.age,
                                gender: item.gender as any,
                                phone: "9848022334",
                                department: item.department,
                                attendingDoctor: item.doctor,
                                admissionDate: "12 Oct 2026",
                                status: "Active",
                                billAmount: 500,
                              });
                            }}
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

            {/* Pagination Footer */}
            <div className="p-3.5 px-4 sm:px-5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <span className="font-semibold text-slate-700">1-7</span> of{" "}
                <span className="font-semibold text-slate-700">142</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                  &lt;
                </button>
                <button className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-300 font-bold text-teal-800 flex items-center justify-center">
                  1
                </button>
                <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                  2
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                  21
                </button>
                <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Doctors on Duty + Today's Appointments (1 col) */}
          <div className="space-y-5">
            {/* Doctors on Duty Card */}
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
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <button className="text-teal-700 hover:text-teal-800 font-semibold text-xs transition">
                  View all 46 doctors
                </button>
              </div>
            </div>

            {/* Today's Appointments Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                Today&apos;s Appointments
              </h3>
              <div className="space-y-3.5 text-xs">
                {[
                  { time: "10:00 AM", patient: "Ankit Rao", doctor: "Dr. K. Sharma", status: "Confirmed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { time: "10:30 AM", patient: "Meena Joshi", doctor: "Dr. S. Reddy", status: "Confirmed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { time: "11:00 AM", patient: "Farhan Ali", doctor: "Dr. P. Nair", status: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
                  { time: "11:30 AM", patient: "Divya Menon", doctor: "Dr. A. Rao", status: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
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
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <button className="text-teal-700 hover:text-teal-800 font-semibold text-xs transition">
                  View full schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 shadow-2xl px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          {toastMessage}
        </div>
      )}

      {/* Modals */}
      <CreateOpModal
        isOpen={isOpModalOpen}
        onClose={() => setIsOpModalOpen(false)}
        onSuccess={handleNewOpSuccess}
      />

      <PrintSlipModal
        patient={printPatient}
        onClose={() => setPrintPatient(null)}
      />

      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={(id) => {
          if (id === "create_op") setIsOpModalOpen(true);
          else showToast(`Action triggered: ${id}`);
        }}
      />
    </div>
  );
}
