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
import { MOCK_PATIENTS } from "@/data/mockData";
import { Patient } from "@/types";

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [printPatient, setPrintPatient] = useState<Patient | null>(null);
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
        showToast("Opening Outpatient (OP) Intake Form...");
        break;
      case "create_ip":
        showToast("Opening Inpatient (IP) Admission Desk...");
        break;
      case "lab_billing":
        showToast("Opening Laboratory Diagnostic Billing...");
        break;
      case "pharmacy_billing":
        showToast("Opening Pharmacy Point of Sale...");
        break;
      case "emergency_services":
        showToast("Emergency Triage mode activated!");
        break;
      default:
        showToast(`Action triggered: ${actionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <Header
        onOpenQuickMenu={() => setQuickMenuOpen(true)}
        activeNav={activeNav}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          showToast(`Navigating to ${nav} module...`);
        }}
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
            showToast(`Loading ${modId.toUpperCase()} workspace...`);
          }}
        />

        {/* High-Density Patient Records Table */}
        <PatientRegistryTable
          patients={patients}
          onViewPatient={(patient) => setSelectedPatient(patient)}
          onPrintSlip={(patient) => setPrintPatient(patient)}
          onAdmitPatient={(patient) => {
            showToast(`Admitting patient ${patient.name} (${patient.mrId}) to Inpatient Ward...`);
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
