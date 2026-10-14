"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/Header";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { PrintSlipModal } from "@/components/PrintSlipModal";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { OpdQueueTab } from "@/components/opd/OpdQueueTab";
import { OpdAppointmentsTab } from "@/components/opd/OpdAppointmentsTab";
import { OpdConsultationsTab } from "@/components/opd/OpdConsultationsTab";
import { OpdFollowUpsTab } from "@/components/opd/OpdFollowUpsTab";
import { OpdBillingTab } from "@/components/opd/OpdBillingTab";
import { PrintPrescriptionModal } from "@/components/opd/PrintPrescriptionModal";
import { PrintOpBillModal } from "@/components/opd/PrintOpBillModal";
import {
  OpQueueItem,
  AllOpRecord,
  AppointmentItem,
  ConsultationEncounter,
  FollowUpItem,
  OpBillItem,
  Patient,
} from "@/types";
import {
  MOCK_OP_QUEUE,
  MOCK_ALL_OP_RECORDS,
  MOCK_APPOINTMENTS,
  MOCK_CONSULTATION_ENCOUNTER,
  MOCK_FOLLOW_UPS,
  MOCK_OP_BILLS,
} from "@/data/opdMockData";

export default function OutpatientPage() {
  const [activeTab, setActiveTab] = useState<
    "Queue" | "Appointments" | "Consultations" | "Follow-ups" | "OP Billing"
  >("Queue");

  // State for all tabs
  const [queue, setQueue] = useState<OpQueueItem[]>(MOCK_OP_QUEUE);
  const [allRecords, setAllRecords] = useState<AllOpRecord[]>(MOCK_ALL_OP_RECORDS);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(MOCK_APPOINTMENTS);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(MOCK_FOLLOW_UPS);
  const [bills, setBills] = useState<OpBillItem[]>(MOCK_OP_BILLS);

  // Modals & previews
  const [isOpModalOpen, setIsOpModalOpen] = useState(false);
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [printPatient, setPrintPatient] = useState<Patient | null>(null);
  const [prescriptionToPrint, setPrescriptionToPrint] = useState<ConsultationEncounter | null>(null);
  const [billToPrint, setBillToPrint] = useState<OpBillItem | null>(null);
  const [ipInitialPatient, setIpInitialPatient] = useState<Patient | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Top action: Call Next Waiting Patient
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
      setActiveTab("Consultations");
    } else {
      showToast("No patients currently waiting in queue.");
    }
  };

  // New OP created from modal
  const handleNewOpSuccess = (newPatient: Patient) => {
    const deptPrefix =
      newPatient.department === "Cardiology"
        ? "A"
        : newPatient.department === "Orthopedics"
        ? "C"
        : newPatient.department === "Gynecology"
        ? "D"
        : "B";
    const tokenNumber = Math.floor(19 + Math.random() * 20);
    const newToken = `${deptPrefix}-${String(tokenNumber).padStart(3, "0")}`;

    const newQueueItem: OpQueueItem = {
      id: String(Date.now()),
      token: newToken,
      name: newPatient.name,
      initials: newPatient.initials,
      age: newPatient.age,
      gender: newPatient.gender,
      mrId: newPatient.mrId,
      phone: newPatient.phone,
      department: newPatient.department,
      doctor: newPatient.attendingDoctor,
      visitType: "New",
      checkIn: "Just now",
      waitTime: "0 min",
      status: "Waiting",
      billAmount: newPatient.billAmount || 500,
    };

    const newRecord: AllOpRecord = {
      id: `rec-${Date.now()}`,
      opNo: newPatient.opIpId,
      name: newPatient.name,
      initials: newPatient.initials,
      age: newPatient.age,
      gender: newPatient.gender,
      mrId: newPatient.mrId,
      phone: newPatient.phone,
      visitDate: newPatient.admissionDate,
      department: newPatient.department,
      doctor: newPatient.attendingDoctor,
      visitType: "New",
      billAmount: newPatient.billAmount || 500,
      paymentStatus: "Paid",
      paymentMode: "UPI",
    };

    setQueue((prev) => [newQueueItem, ...prev]);
    setAllRecords((prev) => [newRecord, ...prev]);
    showToast(`OP Token ${newToken} registered! Opening printable consultation slip...`);
    setPrintPatient(newPatient);
  };

  // Appointment Check-In -> moves into Live Queue
  const handleAppointmentCheckIn = (apt: AppointmentItem) => {
    const deptPrefix = apt.department === "Cardiology" ? "A" : "B";
    const newToken = `${deptPrefix}-${String(Math.floor(25 + Math.random() * 30)).padStart(3, "0")}`;

    const newQueueItem: OpQueueItem = {
      id: String(Date.now()),
      token: newToken,
      name: apt.patientName,
      initials: apt.initials,
      age: apt.age,
      gender: apt.gender,
      mrId: apt.mrId,
      phone: apt.phone,
      department: apt.department,
      doctor: apt.doctor,
      visitType: apt.visitType,
      checkIn: "Just now",
      waitTime: "0 min",
      status: "Waiting",
      billAmount: 500,
    };

    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: "Completed" } : a))
    );
    setQueue((prev) => [newQueueItem, ...prev]);
    showToast(`Checked in ${apt.patientName}! Token ${newToken} added to live queue.`);
    setActiveTab("Queue");
  };

  // Follow-up Revisit Check-In -> moves into Live Queue
  const handleFollowUpCheckIn = (item: FollowUpItem) => {
    const newToken = `R-${String(Math.floor(10 + Math.random() * 30)).padStart(3, "0")}`;

    const newQueueItem: OpQueueItem = {
      id: String(Date.now()),
      token: newToken,
      name: item.name,
      initials: item.initials,
      age: item.age,
      gender: item.gender,
      mrId: item.mrId,
      phone: item.phone,
      department: item.department,
      doctor: item.doctor,
      visitType: "Follow-up",
      checkIn: "Just now",
      waitTime: "0 min",
      status: "Waiting",
      billAmount: item.isFreeRevisit ? 0 : 300,
    };

    setFollowUps((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: "Checked In" } : f))
    );
    setQueue((prev) => [newQueueItem, ...prev]);
    showToast(`Follow-up Check-in successful for ${item.name} (Token ${newToken})!`);
    setActiveTab("Queue");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeNav="OPD"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Breadcrumb + Title + Top Action Bar */}
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
              Monday, 12 Oct 2026 • Live outpatient clinical & administrative operations
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

        {/* 5 Primary Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-4 sm:gap-8 text-xs font-semibold overflow-x-auto">
          {(
            [
              { id: "Queue", label: "Queue", count: queue.filter((q) => q.status === "Waiting").length },
              { id: "Appointments", label: "Appointments", count: appointments.filter((a) => a.status === "Confirmed").length },
              { id: "Consultations", label: "Consultants", count: queue.filter((q) => q.status === "In Consultation").length },
              { id: "Follow-ups", label: "Follow-up", count: followUps.filter((f) => f.status === "Due Today").length },
              { id: "OP Billing", label: "OP Billing", count: bills.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3.5 transition flex items-center gap-2 relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-teal-800 font-black"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="text-sm tracking-tight">{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id
                    ? "bg-teal-800 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-800 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: QUEUE (Daily Queue & All OP Records) */}
        {activeTab === "Queue" && (
          <OpdQueueTab
            queue={queue}
            allRecords={allRecords}
            onCallIn={(item) => {
              setQueue((prev) =>
                prev.map((q) =>
                  q.id === item.id ? { ...q, status: "In Consultation" } : q
                )
              );
              showToast(`Patient ${item.name} called into consultation cabin!`);
              setActiveTab("Consultations");
            }}
            onOpenConsultation={(item) => {
              setActiveTab("Consultations");
            }}
            onPrintSlip={(patient) => setPrintPatient(patient)}
            onViewRecord={(rec) => {
              showToast(`Viewing complete file for ${rec.opNo} (${rec.name})`);
            }}
          />
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === "Appointments" && (
          <OpdAppointmentsTab
            appointments={appointments}
            onCheckInToQueue={handleAppointmentCheckIn}
            onBookSuccess={(newApt) => {
              setAppointments((prev) => [newApt, ...prev]);
              showToast(`Appointment ${newApt.aptNumber} booked for ${newApt.patientName}!`);
            }}
          />
        )}

        {/* TAB 3: CONSULTANTS / CONSULTATIONS */}
        {activeTab === "Consultations" && (
          <OpdConsultationsTab
            queue={queue}
            onCompleteConsultation={(enc) => {
              setQueue((prev) =>
                prev.map((q) =>
                  q.name === enc.patientName ? { ...q, status: "Completed" } : q
                )
              );
              showToast(`Consultation for ${enc.patientName} marked completed! Prescription ready.`);
              setPrescriptionToPrint(enc);
            }}
            onPrintPrescription={(enc) => setPrescriptionToPrint(enc)}
            onAdmitToIp={(patient) => {
              setIpInitialPatient(patient);
              setIsIpModalOpen(true);
            }}
          />
        )}

        {/* TAB 4: FOLLOW-UP */}
        {activeTab === "Follow-ups" && (
          <OpdFollowUpsTab
            followUps={followUps}
            onCheckInRevisit={handleFollowUpCheckIn}
            onSendReminder={(item) => {
              showToast(`Automated WhatsApp & SMS reminder sent to ${item.name} (${item.phone})!`);
            }}
          />
        )}

        {/* TAB 5: OP BILLING */}
        {activeTab === "OP Billing" && (
          <OpdBillingTab
            bills={bills}
            onPrintBill={(bill) => setBillToPrint(bill)}
            onCollectPayment={(updatedBill) => {
              setBills((prev) =>
                prev.map((b) => (b.id === updatedBill.id ? updatedBill : b))
              );
              showToast(`Payment collected for ${updatedBill.billNo}! Total paid: ₹${updatedBill.paidAmount}`);
              setBillToPrint(updatedBill);
            }}
          />
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 shadow-2xl px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          {toastMessage}
        </div>
      )}

      {/* Modals & Printable Sheets */}
      <CreateOpModal
        isOpen={isOpModalOpen}
        onClose={() => setIsOpModalOpen(false)}
        onSuccess={handleNewOpSuccess}
      />

      <CreateIpModal
        isOpen={isIpModalOpen}
        onClose={() => setIsIpModalOpen(false)}
        onSuccess={(admitted) => {
          showToast(`Patient ${admitted.name} admitted to ${admitted.wardName} (${admitted.bedNumber})!`);
        }}
        initialPatient={ipInitialPatient}
      />

      <PrintSlipModal
        patient={printPatient}
        onClose={() => setPrintPatient(null)}
      />

      <PrintPrescriptionModal
        encounter={prescriptionToPrint}
        onClose={() => setPrescriptionToPrint(null)}
      />

      <PrintOpBillModal
        bill={billToPrint}
        onClose={() => setBillToPrint(null)}
      />

      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={(id) => {
          if (id === "create_op") setIsOpModalOpen(true);
          else if (id === "create_ip") {
            setIpInitialPatient(null);
            setIsIpModalOpen(true);
          } else {
            showToast(`Action triggered: ${id}`);
          }
        }}
      />
    </div>
  );
}
