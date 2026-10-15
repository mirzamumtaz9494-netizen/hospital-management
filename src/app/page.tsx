"use client";

import React, { useState, useEffect } from "react";
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

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
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

        {/* High-Density Patient Records Table */}
        <PatientRegistryTable
          patients={patients}
          onViewPatient={(patient) => setSelectedPatient(patient)}
          onPrintSlip={(patient) => setPrintPatient(patient)}
          onAdmitPatient={(patient) => {
            setIpInitialPatient(patient);
            setIsCreateIpOpen(true);
          }}
        />
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
