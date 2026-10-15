"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Stethoscope,
  Search,
  Filter,
  Plus,
  Download,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  User,
  X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { MOCK_DOCTORS_DIRECTORY } from "@/data/doctorsMockData";
import { DoctorProfileItem } from "@/types";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfileItem[]>(
    MOCK_DOCTORS_DIRECTORY
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] =
    useState<DoctorProfileItem | null>(null);

  // New Doctor Form State
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newQual, setNewQual] = useState("MD, DM");
  const [newDept, setNewDept] = useState("Cardiology & Cath Lab");
  const [newDesignation, setNewDesignation] = useState("Senior Consultant");
  const [newRoom, setNewRoom] = useState("OPD Suite 205");
  const [newFee, setNewFee] = useState(700);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const departments = [
    "All",
    "Cardiology & Cath Lab",
    "Orthopedics & Joint Replacement",
    "Neurology & Neurosurgery",
    "General Medicine",
    "Pediatrics & Neonatal Care",
    "Obstetrics & Gynecology",
    "Emergency & Trauma Resuscitation",
    "Radiology & Imaging Sciences",
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.opRoom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDeptFilter === "All" || doc.department.includes(selectedDeptFilter);
    const matchesStatus =
      selectedStatusFilter === "All" || doc.status === selectedStatusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorName) return;

    const newDoc: DoctorProfileItem = {
      id: `doc-${Date.now()}`,
      name: newDoctorName.startsWith("Dr.") ? newDoctorName : `Dr. ${newDoctorName}`,
      qualifications: newQual,
      designation: newDesignation,
      department: newDept,
      experienceYears: 10,
      opRoom: newRoom,
      consultationFee: Number(newFee) || 600,
      phone: "+91 98000 00000",
      email: `${newDoctorName.toLowerCase().replace(/[^a-z]/g, "")}@carepulse.hms`,
      status: "On Duty",
      timings: "09:00 AM - 02:00 PM",
      days: "Monday - Saturday",
      rating: 4.8,
      activePatientsToday: 0,
    };

    setDoctors((prev) => [newDoc, ...prev]);
    setIsAddDoctorModalOpen(false);
    showToast(`${newDoc.name} registered and allocated to ${newDoc.opRoom}!`);

    // Reset
    setNewDoctorName("");
  };

  const handleQuickAction = (actionId: string) => {
    setIsQuickMenuOpen(false);
    switch (actionId) {
      case "create_op":
        setIsNewOpModalOpen(true);
        break;
      case "create_ip":
        setIsNewIpModalOpen(true);
        break;
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeNav="Doctors"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link href="/" className="hover:text-slate-600 transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-bold">Medical Staff</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Doctors Profile Directory &amp; Duty Schedules
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 mr-1" />
                46 on Duty
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultant physician credentials, OPD chamber schedules, live consultation queues, and booking slots
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                showToast("Exporting hospital doctors duty roster (PDF/Excel)...");
                setTimeout(() => {
                  showToast("Downloaded carepulse-doctors-roster-2026.csv");
                }, 1200);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Roster
            </button>

            <button
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Doctor
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Clinicians on Duty
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              46 Doctors
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700 font-bold">100% attendance</span> across 4 shifts
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                OPD Suites Active
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              24 Chambers
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-blue-700 font-bold">Floors 1, 2, 3 &amp; 4</span> OPD plazas
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Surgeons in OT Now
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              6 in OT
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-purple-700 font-bold">OT Complex 1 to 4</span> active
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Patient Consultations Today
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              142 Today
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-700 font-bold">OP Token Registry</span> in progress
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctors by name, qualifications, OPD room, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Specialties" : d}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="On Duty">On Duty</option>
                <option value="Available">Available</option>
                <option value="In OT">In OT</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </div>
        </div>

        {/* Doctors Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => {
            const initials = doc.name
              .replace("Dr. ", "")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar + Status + Star */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {doc.avatarUrl ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={doc.avatarUrl}
                              alt={doc.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-800 font-bold flex items-center justify-center text-sm border border-teal-200">
                            {initials}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                            doc.status === "On Duty"
                              ? "bg-emerald-500"
                              : doc.status === "In OT"
                              ? "bg-purple-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {doc.name}
                        </h3>
                        <p className="text-[11px] text-teal-700 font-semibold">
                          {doc.qualifications}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  {/* Specialty & Designation */}
                  <div className="space-y-1 mb-3">
                    <div className="text-xs font-semibold text-slate-800">
                      {doc.designation}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {doc.department} • {doc.experienceYears} Years Exp.
                    </div>
                  </div>

                  {/* Schedule & Room Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 font-mono">
                        {doc.opRoom}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.timings} ({doc.days})</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Fee & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      OP Fee
                    </span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      ₹{doc.consultationFee}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsNewOpModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Book OP
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Register Doctor Modal */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Register Consultant Doctor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Allocate OPD chamber &amp; duty roster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doctor Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sneha Reddy"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MD (Medicine), DM"
                    value={newQual}
                    onChange={(e) => setNewQual(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Cardiology & Cath Lab">Cardiology &amp; Cath Lab</option>
                    <option value="Orthopedics & Joint Replacement">Orthopedics &amp; Joint</option>
                    <option value="Neurology & Neurosurgery">Neurology &amp; Neuro</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics & Neonatal Care">Pediatrics &amp; NICU</option>
                    <option value="Obstetrics & Gynecology">Obstetrics &amp; Gyn</option>
                    <option value="Emergency & Trauma Resuscitation">Emergency Trauma</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Consultation Room *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OPD Chamber 208"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    required
                    value={newFee}
                    onChange={(e) => setNewFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Clinical Action Tray Modals */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={handleQuickAction}
      />

      <CreateOpModal
        isOpen={isNewOpModalOpen}
        onClose={() => setIsNewOpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewOpModalOpen(false);
          showToast(`OP consultation generated for ${patient.name}`);
        }}
      />

      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewIpModalOpen(false);
          showToast(`IP admission registered for ${patient.name}`);
        }}
      />
    </div>
  );
}
