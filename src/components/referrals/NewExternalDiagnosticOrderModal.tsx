"use client";

import React, { useState } from "react";
import {
  X,
  FilePlus,
  Building2,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Search,
  DollarSign,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ExternalDiagnosticCenter,
  ExternalDiagnosticOrder,
  ExternalDiagnosticTestItem,
  Patient,
} from "@/types";
import { useOfflineSync } from "@/context/OfflineSyncContext";
import { useTenant } from "@/context/TenantContext";

interface NewExternalDiagnosticOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  centers: ExternalDiagnosticCenter[];
  activePatients: Patient[];
  onOrderCreated: (order: ExternalDiagnosticOrder) => void;
}

export const NewExternalDiagnosticOrderModal: React.FC<NewExternalDiagnosticOrderModalProps> = ({
  isOpen,
  onClose,
  centers,
  activePatients,
  onOrderCreated,
}) => {
  const { currentTenant } = useTenant();
  const { saveExternalDiagnosticOrderOfflineSafe } = useOfflineSync();

  const [selectedPatientUhid, setSelectedPatientUhid] = useState(
    activePatients[0]?.uhid || activePatients[0]?.mrId || ""
  );
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id || "");
  const [selectedTests, setSelectedTests] = useState<ExternalDiagnosticTestItem[]>([]);
  const [referringDoctor, setReferringDoctor] = useState("Dr. Rao");
  const [department, setDepartment] = useState("General Medicine");
  const [clinicalIndication, setClinicalIndication] = useState("");
  const [urgency, setUrgency] = useState<"Routine" | "Urgent" | "Stat Emergency">("Routine");

  if (!isOpen) return null;

  const activeCenter = centers.find((c) => c.id === selectedCenterId) || centers[0];

  const handleCenterChange = (centerId: string) => {
    setSelectedCenterId(centerId);
    setSelectedTests([]); // Reset tests when center changes
  };

  const handleToggleTest = (test: ExternalDiagnosticTestItem) => {
    const exists = selectedTests.some((t) => t.testCode === test.testCode);
    if (exists) {
      setSelectedTests((prev) => prev.filter((t) => t.testCode !== test.testCode));
    } else {
      setSelectedTests((prev) => [...prev, test]);
    }
  };

  const totalMrp = selectedTests.reduce((sum, t) => sum + t.standardMrp, 0);
  const totalAgreed = selectedTests.reduce((sum, t) => sum + t.hospitalAgreedRate, 0);
  const totalShare = selectedTests.reduce((sum, t) => sum + t.hospitalShare, 0);

  // Filter patients
  const currentPatient =
    activePatients.find((p) => p.uhid === selectedPatientUhid || p.mrId === selectedPatientUhid) ||
    activePatients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPatient) {
      alert("Please select a patient.");
      return;
    }

    if (selectedTests.length === 0) {
      alert("Please select at least one diagnostic test/investigation.");
      return;
    }

    const randomVoucherNum = `EDV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: ExternalDiagnosticOrder = {
      id: `ord-${Date.now()}`,
      voucherNumber: randomVoucherNum,
      patientId: currentPatient.id,
      uhid: currentPatient.uhid || currentPatient.mrId,
      patientName: currentPatient.name,
      patientAge: currentPatient.age,
      patientGender: currentPatient.gender,
      patientPhone: currentPatient.phone,
      referringDoctor,
      department,
      destinationCenterId: activeCenter.id,
      destinationCenterName: activeCenter.centerName,
      selectedTests: selectedTests.map((t) => ({
        testCode: t.testCode,
        testName: t.testName,
        modality: t.modality,
        mrp: t.standardMrp,
        hospitalAgreedRate: t.hospitalAgreedRate,
        hospitalShare: t.hospitalShare,
      })),
      totalMrp,
      hospitalPayable: totalAgreed,
      hospitalReceivableShare: totalShare,
      referralDate: new Date().toISOString().split("T")[0],
      clinicalIndication: clinicalIndication.trim() || "Attending specialist referral for high-field investigation.",
      urgency,
      status: "Voucher Issued",
      paymentStatus: "Pending Center Invoice",
      createdAt: new Date().toISOString(),
    };

    saveExternalDiagnosticOrderOfflineSafe(newOrder);
    onOrderCreated(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Issue External Diagnostic Referral Voucher</h2>
              <p className="text-xs text-slate-400">
                Outbound MRI, CT, & Advanced Pathology with B2B Revenue Tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          {/* Section 1: Patient Selection */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-teal-600" />
                1. Select Patient
              </span>
              <span className="text-[11px] text-slate-500">
                {activePatients.length} Hospital Patients Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Choose Patient (From Live Queue / Census)
                </label>
                <select
                  value={selectedPatientUhid}
                  onChange={(e) => setSelectedPatientUhid(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                >
                  {activePatients.map((p) => (
                    <option key={p.id} value={p.uhid || p.mrId}>
                      {p.name} ({p.uhid || p.mrId}) • {p.age}y/{p.gender}
                    </option>
                  ))}
                </select>
              </div>

              {currentPatient && (
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] space-y-0.5">
                  <div className="font-bold text-slate-900">{currentPatient.name}</div>
                  <div className="text-slate-500">
                    UHID: <span className="font-mono text-teal-700 font-semibold">{currentPatient.uhid || currentPatient.mrId}</span> • Phone: {currentPatient.phone}
                  </div>
                  <div className="text-slate-500">
                    Dept: {currentPatient.department || "General Medicine"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Partner Diagnostic Center & Clinician */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                2. Target Partner Diagnostic Center *
              </label>
              <select
                value={selectedCenterId}
                onChange={(e) => handleCenterChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.centerName} ({c.partnershipTerms.sharePercentage}% B2B Share)
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Agreement: {activeCenter.partnershipTerms.sharePercentage}% institutional rebate on invoice
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Referring Clinician & Dept *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={referringDoctor}
                  onChange={(e) => setReferringDoctor(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                >
                  <option value="Dr. Rao">Dr. Rao</option>
                  <option value="Dr. S. Reddy">Dr. S. Reddy</option>
                  <option value="Dr. A. Rao">Dr. A. Rao</option>
                  <option value="Dr. K. Sharma">Dr. K. Sharma</option>
                  <option value="Dr. P. Nair">Dr. P. Nair</option>
                  <option value="Dr. V. Menon">Dr. V. Menon</option>
                </select>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Gynecology">Gynecology</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Select Tests from Partner Catalog */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                3. Select Investigation(s) from {activeCenter.centerName}:
              </span>
              <span className="text-[11px] font-semibold text-teal-700">
                {selectedTests.length} Selected
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto bg-slate-50/50">
              {activeCenter.serviceCatalog.map((t) => {
                const isSelected = selectedTests.some((item) => item.testCode === t.testCode);
                return (
                  <div
                    key={t.testCode}
                    onClick={() => handleToggleTest(t)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition ${
                      isSelected ? "bg-teal-50/80 border-l-4 border-l-teal-600" : "hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent div
                        className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{t.testName}</div>
                        <div className="text-[10px] text-slate-500">
                          Code: <span className="font-mono">{t.testCode}</span> • Modality: {t.modality}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-900">₹{t.standardMrp.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Hospital Share: ₹{t.hospitalShare.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Clinical Indication & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Clinical Indication / Reason for Investigation *
              </label>
              <input
                type="text"
                required
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                placeholder="e.g. Unstable angina, suspected coronary artery disease"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Investigation Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
              >
                <option value="Routine">Routine (Within 48h)</option>
                <option value="Urgent">Urgent (Within 12h)</option>
                <option value="Stat Emergency">Stat Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          {/* Financial Summary Card */}
          <div className="p-4 bg-teal-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                Referral Financial Reconcilation
              </div>
              <div className="text-xs text-teal-100 mt-0.5">
                B2B Center Invoice: ₹{totalAgreed.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-teal-200">Total Patient MRP: ₹{totalMrp.toLocaleString("en-IN")}</div>
              <div className="text-base font-black text-white">
                Hospital Share: +₹{totalShare.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedTests.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              Generate Barcoded Voucher & Print
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
