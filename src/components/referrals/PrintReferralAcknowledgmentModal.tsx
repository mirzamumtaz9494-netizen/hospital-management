"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Building2,
  Calendar,
  User,
  Stethoscope,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { InboundReferral } from "@/types";
import { useTenant } from "@/context/TenantContext";

interface PrintReferralAcknowledgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: InboundReferral | null;
}

export const PrintReferralAcknowledgmentModal: React.FC<PrintReferralAcknowledgmentModalProps> = ({
  isOpen,
  onClose,
  referral,
}) => {
  const { currentTenant } = useTenant();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !referral) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:static print:p-0 print:m-0 print:overflow-visible print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:static print:w-full print:max-w-none print:shadow-none print:border-none print:m-0 print:overflow-visible">
        {/* Controls */}
        <div className="no-print flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Clinical Referral Acknowledgment</h2>
              <p className="text-[11px] text-slate-400">NMC Medical Ethics & NABH Standard Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Letter
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Letter */}
        <div ref={printRef} className="print-container p-8 sm:p-10 text-slate-800 space-y-6 print:p-6 print:space-y-4 font-sans bg-white">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-950">
                {currentTenant.name || "APEX CARE HOSPITAL"}
              </div>
              <p className="text-xs text-slate-600 font-medium">Department of Clinical Referral & Continuity of Care</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {currentTenant.city}, {currentTenant.state} • Phone: {currentTenant.contactPhone} • Email: {currentTenant.contactEmail}
              </p>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                REF-ACK-2026-{referral.id.slice(-4)}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Recipient Referring Doctor */}
          <div className="text-xs space-y-1">
            <div className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">To,</div>
            <div className="font-bold text-slate-900 text-sm">{referral.referrerName}</div>
            {referral.referrerRegNo && (
              <div className="text-slate-600 font-mono text-[11px]">Reg No: {referral.referrerRegNo}</div>
            )}
            <div className="text-slate-600">{referral.referringEntity} • Contact: {referral.referrerContact}</div>
          </div>

          {/* Subject Line */}
          <div className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">
            <span className="font-bold">Subject:</span> Clinical Acknowledgment & Care Transition for Patient:{" "}
            <span className="text-teal-700 font-bold">{referral.patientName}</span> (UHID:{" "}
            <span className="font-mono">{referral.uhid}</span>)
          </div>

          {/* Letter Body */}
          <div className="text-xs leading-relaxed text-slate-700 space-y-3">
            <p>Dear Colleague,</p>
            <p>
              Thank you for referring your patient, <strong className="text-slate-900">{referral.patientName}</strong>, {referral.patientAge} years, {referral.patientGender === "M" ? "Male" : "Female"}, to our hospital on <strong>{referral.referralDate}</strong> for <strong>{referral.intendedService}</strong> under the <strong>Department of {referral.destinationDepartment}</strong>.
            </p>
            <p>
              We are pleased to inform you that the patient has been received by our clinical triage team and is currently under the specialized care of <strong className="text-slate-900">{referral.treatingDoctor}</strong>.
            </p>
          </div>

          {/* Clinical Case Summary Box */}
          <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span>Clinical Triage & Status Summary</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                STATUS: {referral.referralStatus.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
              <div><span className="font-semibold text-slate-600">Referred Department:</span> {referral.destinationDepartment}</div>
              <div><span className="font-semibold text-slate-600">Attending Specialist:</span> {referral.treatingDoctor}</div>
              <div><span className="font-semibold text-slate-600">Referral Priority:</span> {referral.referralPriority}</div>
              <div><span className="font-semibold text-slate-600">Patient Mobile:</span> {referral.patientPhone}</div>
            </div>
            <div className="pt-2 text-[11px] text-slate-600 border-t border-slate-200">
              <span className="font-semibold text-slate-700">Initial Clinical Assessment / Notes:</span>
              <p className="mt-0.5 italic text-slate-800">"{referral.clinicalNotes}"</p>
            </div>
          </div>

          {/* Ethical Statement & Continuity of Care */}
          <div className="text-xs leading-relaxed text-slate-600 space-y-2">
            <p>
              In accordance with National Medical Commission (NMC) professional conduct guidelines and hospital continuity of care protocols, a complete discharge summary and diagnostic workup will be forwarded to your clinic upon completion of treatment so that you may continue primary care oversight.
            </p>
            <p>
              Should you require any urgent clinical updates regarding this patient, please feel free to contact our medical coordinator at <strong>{currentTenant.contactPhone}</strong>.
            </p>
          </div>

          {/* Signoff */}
          <div className="pt-8 flex items-end justify-between text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                NMC Ethical Protocol Compliant
              </div>
              <p className="text-[10px] text-slate-400">Zero fee-splitting • Verified clinical correspondence</p>
            </div>
            <div className="text-center min-w-[180px] border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">{referral.treatingDoctor}</div>
              <div className="text-[10px] text-slate-500">Department of {referral.destinationDepartment}</div>
              <div className="text-[10px] text-slate-400">{currentTenant.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
