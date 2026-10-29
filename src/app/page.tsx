"use client";

import React, { useState, useEffect } from "react";
import { Lock, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { AlertBanner } from "@/components/AlertBanner";
import { MetricCards } from "@/components/MetricCards";
import { ModuleGrid } from "@/components/ModuleGrid";
import { PatientRegistryTable } from "@/components/PatientRegistryTable";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { PrintSlipModal } from "@/components/PrintSlipModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { MOCK_PATIENTS } from "@/data/mockData";
import { Patient } from "@/types";
import { useRole } from "@/context/RoleContext";
import { getAllLocalRecords } from "@/lib/offlineStore";
import { supabase } from "@/lib/supabase";
import {
  isCleanProductionMode,
  EVENT_NAME_DATABASE_RESET,
} from "@/lib/databaseResetService";
import {
  DoctorDashboardView,
  NurseDashboardView,
  CashierDashboardView,
  PharmacistDashboardView,
  LabTechDashboardView,
} from "@/components/RoleDashboardViews";

export default function DashboardPage() {
  const { roleConfig, currentRole, canAccessModule, lockSession } =
    useRole();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [printPatient, setPrintPatient] = useState<Patient | null>(null);
  const [isCreateOpOpen, setIsCreateOpOpen] = useState(false);
  const [isCreateIpOpen, setIsCreateIpOpen] = useState(false);
  const [ipInitialPatient, setIpInitialPatient] = useState<Patient | null>(null);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [notification, setNotification] = useState<string | null>(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuickMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  // Load patients from local IndexedDB and Supabase Cloud
  useEffect(() => {
    async function loadPatients() {
      const isClean = isCleanProductionMode();
      const loaded: Patient[] = [];

      // 1. From local IndexedDB
      try {
        const local = await getAllLocalRecords<Patient>("patients");
        if (local && local.length > 0) {
          loaded.push(...local);
        }
      } catch {}

      // 2. From Supabase Cloud
      try {
        if (supabase) {
          const { data: cloud } = await supabase
            .from("patients")
            .select("*, opd_tokens(*)")
            .order("created_at", { ascending: false })
            .limit(30);

          if (cloud) {
            cloud.forEach((cp, idx) => {
              const alreadyExists = loaded.some(
                (p) =>
                  p.mrId === cp.mr_id ||
                  p.uhid === cp.mr_id ||
                  p.name === cp.name
              );
              if (!alreadyExists) {
                const initials = (cp.name || "PT")
                  .split(" ")
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                const tokens = (cp.opd_tokens as any[]) || [];
                const latestToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;

                const doctorName = latestToken?.doctor_name || cp.attendingDoctor || "Dr. A. Rao";
                const department = latestToken?.department || cp.department || "General Medicine";
                const opToken = latestToken?.token_number
                  ? `OP-${latestToken.token_number}`
                  : `OP-${40180 + idx}`;
                const billAmt = latestToken?.consultation_fee || 500;

                loaded.push({
                  id: cp.id,
                  mrId: cp.mr_id,
                  uhid: cp.mr_id,
                  opIpId: opToken,
                  type: "OP",
                  name: cp.name,
                  initials: initials || "PT",
                  age: cp.age || 30,
                  gender: (cp.gender as any) || "M",
                  phone: cp.phone,
                  bloodGroup: cp.blood_group || "O+",
                  department: department,
                  attendingDoctor: doctorName,
                  admissionDate: "Today",
                  status: "Active",
                  billAmount: billAmt,
                  diagnosis: "Clinical Outpatient Consultation",
                });
              }
            });
          }
        }
      } catch {}

      if (isClean) {
        // Clean production slate: only show real patients entered by staff
        setPatients(loaded);
      } else {
        // Demo sandbox mode: combine mock patients with any local records
        const base = [...MOCK_PATIENTS];
        const existingIds = new Set(base.map((p) => p.mrId || p.uhid));
        const toAdd = loaded.filter((p) => !existingIds.has(p.mrId || p.uhid));
        setPatients([...toAdd, ...base]);
      }
    }

    loadPatients();

    const handleReset = () => {
      loadPatients();
    };

    window.addEventListener(EVENT_NAME_DATABASE_RESET, handleReset);
    return () => window.removeEventListener(EVENT_NAME_DATABASE_RESET, handleReset);
  }, []);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "create_op":
        setIsCreateOpOpen(true);
        break;
      case "create_ip":
        setIpInitialPatient(null);
        setIsCreateIpOpen(true);
        break;
      case "lab_billing":
        window.location.href = "/laboratory";
        break;
      case "pharmacy_billing":
        window.location.href = "/pharmacy";
        break;
      case "other_services":
        window.location.href = "/services";
        break;
      case "add_expenses":
        window.location.href = "/accounts";
        break;
      case "emergency_services":
        window.location.href = "/ipd";
        break;
      case "advance_payment":
        window.location.href = "/accounts";
        break;
      case "bill_settlement":
        window.location.href = "/accounts";
        break;
      case "doctor_roster":
        window.location.href = "/doctors";
        break;
      case "mis_reports":
        window.location.href = "/reports";
        break;
      case "hospital_settings":
        window.location.href = "/settings";
        break;
      default:
        showToast(`Action triggered: ${actionId}`);
    }
  };

  const handleOpSuccess = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`OP Consultation registered (${newPatient.opIpId})! Opening print preview...`);
    // Immediately open print preview for OPD slip!
    setPrintPatient(newPatient);
  };

  const handleIpSuccess = (admittedPatient: Patient) => {
    setPatients((prev) => [
      admittedPatient,
      ...prev.filter((p) => p.id !== admittedPatient.id),
    ]);
    showToast(`Patient ${admittedPatient.name} admitted to ${admittedPatient.wardName} (${admittedPatient.bedNumber})!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <Header
        onOpenQuickMenu={() => setQuickMenuOpen(true)}
        activeNav={activeNav}
      />

      {/* 2. Critical Alert Banner */}
      <AlertBanner />

      {/* 3. Main Dashboard Content */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-4 sm:space-y-5">
        {/* Active Role Clinical Desk Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={roleConfig.profile.avatar}
              alt={roleConfig.profile.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-500/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-800">
                  {roleConfig.profile.name}
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${roleConfig.profile.badgeColor}`}
                >
                  {roleConfig.profile.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {roleConfig.profile.department} •{" "}
                <span className="text-slate-400">
                  {roleConfig.profile.description}
                </span>
              </p>
            </div>
          </div>

          {/* Clinical Shift & Terminal Station Status */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">Station Active</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                • Counter 02 (NABH)
              </span>
            </div>

            <button
              onClick={() => lockSession()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Lock Clinical Terminal"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Lock Station</span>
            </button>

            <button
              onClick={() => setQuickMenuOpen(true)}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Actions</span>
              <span className="text-[10px] bg-teal-200/60 px-1 rounded font-mono hidden md:inline">
                ⌘K
              </span>
            </button>
          </div>
        </div>

        {/* Metric Cards (6 KPI Cards) */}
        <MetricCards />

        {/* 12 Core Category Navigation Tiles */}
        <ModuleGrid
          onSelectModule={(modId) => {
            if (modId === "opd") {
              window.location.href = "/opd";
            } else if (modId === "ipd" || modId === "wards") {
              window.location.href = "/ipd";
            } else if (modId === "lab") {
              window.location.href = "/laboratory";
            } else if (modId === "pharmacy") {
              window.location.href = "/pharmacy";
            } else if (modId === "reports") {
              window.location.href = "/reports";
            } else if (modId === "admin") {
              window.location.href = "/admin";
            } else if (modId === "settings") {
              window.location.href = "/settings";
            } else if (modId === "doctors") {
              window.location.href = "/doctors";
            } else if (modId === "services") {
              window.location.href = "/services";
            } else if (modId === "accounts") {
              window.location.href = "/accounts";
            } else if (modId === "patients") {
              const el = document.getElementById("patients");
              el?.scrollIntoView({ behavior: "smooth" });
            } else {
              showToast(`Loading ${modId.toUpperCase()} workspace...`);
            }
          }}
        />

        {/* High-Density Patient Records Table (Restricted to Front Desk & Super Admin) */}
        {canAccessModule("patients") ? (
          <PatientRegistryTable
            patients={patients}
            onViewPatient={(patient) => setSelectedPatient(patient)}
            onPrintSlip={(patient) => setPrintPatient(patient)}
            onAdmitPatient={(patient) => {
              setIpInitialPatient(patient);
              setIsCreateIpOpen(true);
            }}
          />
        ) : currentRole === "doctor" ? (
          <DoctorDashboardView />
        ) : currentRole === "nurse" ? (
          <NurseDashboardView />
        ) : currentRole === "cashier" ? (
          <CashierDashboardView />
        ) : currentRole === "pharmacist" ? (
          <PharmacistDashboardView />
        ) : currentRole === "lab_tech" ? (
          <LabTechDashboardView />
        ) : null}
      </main>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 shadow-2xl px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          {notification}
        </div>
      )}

      {/* Modals */}
      <QuickMenuModal
        isOpen={quickMenuOpen}
        onClose={() => setQuickMenuOpen(false)}
        onActionSelect={handleQuickAction}
      />

      <CreateOpModal
        isOpen={isCreateOpOpen}
        onClose={() => setIsCreateOpOpen(false)}
        onSuccess={handleOpSuccess}
      />

      <CreateIpModal
        isOpen={isCreateIpOpen}
        onClose={() => setIsCreateIpOpen(false)}
        onSuccess={handleIpSuccess}
        initialPatient={ipInitialPatient}
      />

      <PatientDetailsModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onPrintSlip={(patient) => {
          setSelectedPatient(null);
          setPrintPatient(patient);
        }}
      />

      <PrintSlipModal
        patient={printPatient}
        onClose={() => setPrintPatient(null)}
      />
    </div>
  );
}
