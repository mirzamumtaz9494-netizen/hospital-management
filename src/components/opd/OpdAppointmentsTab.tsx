"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Hourglass,
  XCircle,
  Plus,
  Search,
  Filter,
  UserCheck,
  ChevronDown,
  Printer,
  CalendarCheck,
  Phone,
  UserPlus,
  X,
} from "lucide-react";
import { AppointmentItem } from "@/types";

interface OpdAppointmentsTabProps {
  appointments: AppointmentItem[];
  onCheckInToQueue: (apt: AppointmentItem) => void;
  onBookSuccess: (newApt: AppointmentItem) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  AR: "bg-blue-100 text-blue-700",
  MJ: "bg-amber-100 text-amber-700",
  FA: "bg-indigo-100 text-indigo-700",
  DM: "bg-cyan-100 text-cyan-700",
  SS: "bg-orange-100 text-orange-700",
  PP: "bg-pink-100 text-pink-700",
  RV: "bg-violet-100 text-violet-700",
};

export const OpdAppointmentsTab: React.FC<OpdAppointmentsTabProps> = ({
  appointments,
  onCheckInToQueue,
  onBookSuccess,
}) => {
  const [statusFilter, setStatusFilter] = useState<"All" | "Confirmed" | "Pending" | "Completed">("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New appointment form state
  const [newAptData, setNewAptData] = useState({
    patientName: "",
    age: "35",
    gender: "M" as "M" | "F" | "Other",
    phone: "",
    department: "Cardiology",
    doctor: "Dr. S. Reddy",
    date: "12 Oct 2026",
    timeSlot: "11:30 AM",
    visitType: "New" as "New" | "Follow-up",
    reason: "",
  });

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== "All" && apt.status !== statusFilter) return false;
    if (selectedDoctor !== "All" && apt.doctor !== selectedDoctor) return false;
    if (selectedDept !== "All" && apt.department !== selectedDept) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(q) ||
      apt.aptNumber.toLowerCase().includes(q) ||
      apt.mrId.toLowerCase().includes(q) ||
      apt.phone.includes(q) ||
      apt.doctor.toLowerCase().includes(q) ||
      apt.reason.toLowerCase().includes(q)
    );
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptData.patientName.trim() || !newAptData.phone.trim()) {
      alert("Please provide the Patient Name and Phone Number.");
      return;
    }

    const initials = newAptData.patientName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const createdApt: AppointmentItem = {
      id: String(Date.now()),
      aptNumber: `APT-${Math.floor(910 + Math.random() * 80)}`,
      patientName: newAptData.patientName,
      initials: initials || "PT",
      age: parseInt(newAptData.age, 10) || 35,
      gender: newAptData.gender,
      mrId: `MR-${Math.floor(10380 + Math.random() * 80)}`,
      phone: newAptData.phone,
      department: newAptData.department,
      doctor: newAptData.doctor,
      date: newAptData.date,
      timeSlot: newAptData.timeSlot,
      visitType: newAptData.visitType,
      status: "Confirmed",
      reason: newAptData.reason || "Scheduled Consultation",
    };

    onBookSuccess(createdApt);
    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* 4 Mini KPI Cards for Appointments */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <CalendarCheck className="w-4 h-4 text-teal-600" />
            Total Scheduled Today
          </div>
          <div className="text-2xl font-bold text-slate-900">24</div>
          <span className="text-[11px] text-slate-500">Across 6 OPD departments</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Confirmed
          </div>
          <div className="text-2xl font-bold text-emerald-700">18</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Patients verified by reception</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Hourglass className="w-4 h-4 text-amber-500" />
            Pending Confirmation
          </div>
          <div className="text-2xl font-bold text-amber-700">4</div>
          <span className="text-[11px] text-amber-600 font-semibold">Awaiting patient response</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            Completed Consults
          </div>
          <div className="text-2xl font-bold text-blue-700">2</div>
          <span className="text-[11px] text-slate-500">Seen by attending doctors</span>
        </div>
      </div>

      {/* Main Appointments Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Top Filter & Action Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Today&apos;s OPD Appointments
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              {filteredAppointments.length} Booked
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, APT No or phone"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Doctor Filter */}
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Doctors</option>
              <option value="Dr. S. Reddy">Dr. S. Reddy</option>
              <option value="Dr. K. Sharma">Dr. K. Sharma</option>
              <option value="Dr. A. Rao">Dr. A. Rao</option>
              <option value="Dr. P. Nair">Dr. P. Nair</option>
              <option value="Dr. M. Iyer">Dr. M. Iyer</option>
              <option value="Dr. V. Menon">Dr. V. Menon</option>
            </select>

            {/* Status Segmented */}
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              {(["All", "Confirmed", "Pending", "Completed"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    statusFilter === st
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Book Appointment CTA */}
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Apt No ↑</th>
                <th className="py-3 px-4">Time Slot ⇅</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Department & Doctor</th>
                <th className="py-3 px-4">Visit Type</th>
                <th className="py-3 px-4">Reason for Visit</th>
                <th className="py-3 px-4">Status ⇅</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition group">
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-slate-900">
                    {apt.aptNumber}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {apt.timeSlot}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          AVATAR_COLORS[apt.initials] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {apt.initials}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block group-hover:text-teal-700 transition">
                          {apt.patientName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {apt.age} / {apt.gender}, {apt.mrId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {apt.phone}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{apt.doctor}</div>
                    <div className="text-[10px] text-slate-500">{apt.department}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        apt.visitType === "New"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {apt.visitType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={apt.reason}>
                    {apt.reason}
                  </td>
                  <td className="py-3 px-4">
                    {apt.status === "Confirmed" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Confirmed
                      </span>
                    )}
                    {apt.status === "Pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pending
                      </span>
                    )}
                    {apt.status === "Completed" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {apt.status !== "Completed" && (
                        <button
                          onClick={() => onCheckInToQueue(apt)}
                          className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-bold rounded-xl text-xs transition shadow-2xs"
                        >
                          Check-In
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Appointment details for ${apt.aptNumber} (${apt.patientName})`)}
                        className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-700 font-bold">
                  <Calendar className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Book Outpatient Appointment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Schedule doctor consultation slot & send SMS reminder
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">
                    Patient Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAptData.patientName}
                    onChange={(e) =>
                      setNewAptData({ ...newAptData, patientName: e.target.value })
                    }
                    placeholder="e.g. Ankit Rao"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newAptData.phone}
                    onChange={(e) =>
                      setNewAptData({ ...newAptData, phone: e.target.value })
                    }
                    placeholder="e.g. 9848123987"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Age / Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newAptData.age}
                      onChange={(e) =>
                        setNewAptData({ ...newAptData, age: e.target.value })
                      }
                      className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white"
                    />
                    <select
                      value={newAptData.gender}
                      onChange={(e) =>
                        setNewAptData({
                          ...newAptData,
                          gender: e.target.value as "M" | "F" | "Other",
                        })
                      }
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 font-medium focus:bg-white"
                    >
                      <option value="M">Male (M)</option>
                      <option value="F">Female (F)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Department</label>
                  <select
                    value={newAptData.department}
                    onChange={(e) =>
                      setNewAptData({ ...newAptData, department: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Doctor</label>
                  <select
                    value={newAptData.doctor}
                    onChange={(e) =>
                      setNewAptData({ ...newAptData, doctor: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white"
                  >
                    <option value="Dr. S. Reddy">Dr. S. Reddy</option>
                    <option value="Dr. K. Sharma">Dr. K. Sharma</option>
                    <option value="Dr. A. Rao">Dr. A. Rao</option>
                    <option value="Dr. P. Nair">Dr. P. Nair</option>
                    <option value="Dr. M. Iyer">Dr. M. Iyer</option>
                    <option value="Dr. V. Menon">Dr. V. Menon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Appointment Date</label>
                  <input
                    type="text"
                    value={newAptData.date}
                    onChange={(e) =>
                      setNewAptData({ ...newAptData, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Available Time Slot</label>
                  <select
                    value={newAptData.timeSlot}
                    onChange={(e) =>
                      setNewAptData({ ...newAptData, timeSlot: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold text-teal-800 focus:bg-white"
                  >
                    <option value="10:00 AM">10:00 AM (Available)</option>
                    <option value="10:30 AM">10:30 AM (Available)</option>
                    <option value="11:00 AM">11:00 AM (Available)</option>
                    <option value="11:30 AM">11:30 AM (Available)</option>
                    <option value="12:00 PM">12:00 PM (Available)</option>
                    <option value="02:30 PM">02:30 PM (Available)</option>
                    <option value="03:00 PM">03:00 PM (Available)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">
                    Chief Complaint / Reason for Appointment
                  </label>
                  <input
                    type="text"
                    value={newAptData.reason}
                    onChange={(e) =>
                      setNewAptData({ ...newAptData, reason: e.target.value })
                    }
                    placeholder="e.g. Chest pain evaluation, BP checkup..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
