"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Building2,
  Stethoscope,
  Phone,
  FileText,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { InboundReferral, InboundReferralSource, ReferralPriority } from "@/types";
import { useOfflineSync } from "@/context/OfflineSyncContext";
import { generateUhid } from "@/lib/qrService";
import { useTenant } from "@/context/TenantContext";

interface NewInboundReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReferralCreated: (referral: InboundReferral) => void;
}

export const NewInboundReferralModal: React.FC<NewInboundReferralModalProps> = ({
  isOpen,
  onClose,
  onReferralCreated,
}) => {
  const { currentTenant } = useTenant();
  const { saveInboundReferralOfflineSafe } = useOfflineSync();

  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "M" as "M" | "F" | "Other",
    patientPhone: "",
    referringEntity: "External Doctor" as InboundReferralSource,
    referrerName: "",
    referrerContact: "",
    referrerRegNo: "",
    destinationDepartment: "General Medicine",
    intendedService: "Specialist Consultation & Workup",
    referralPriority: "Routine" as ReferralPriority,
    treatingDoctor: "Dr. Rao",
    clinicalNotes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientName.trim() || !formData.referrerName.trim()) {
      alert("Please provide the Patient Name and Referring Practitioner Name.");
      return;
    }

    const uhid = generateUhid(currentTenant.tenantCode || "APEX");
    const newReferral: InboundReferral = {
      id: `inb-${Date.now()}`,
      uhid,
      patientName: formData.patientName.trim(),
      patientAge: parseInt(formData.patientAge, 10) || 30,
      patientGender: formData.patientGender,
      patientPhone: formData.patientPhone.trim() || "0000000000",
      referringEntity: formData.referringEntity,
      referrerName: formData.referrerName.trim(),
      referrerContact: formData.referrerContact.trim() || "+91 90000 00000",
      referrerRegNo: formData.referrerRegNo.trim() || undefined,
      referralDate: new Date().toISOString().split("T")[0],
      destinationDepartment: formData.destinationDepartment,
      intendedService: formData.intendedService,
      referralPriority: formData.referralPriority,
      referralStatus: "Received",
      clinicalNotes: formData.clinicalNotes.trim() || "Referred for clinical evaluation.",
      treatingDoctor: formData.treatingDoctor,
      acknowledgementSent: false,
      createdAt: new Date().toISOString(),
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toLocaleString("en-IN", {
            dateStyle: "short",
            timeStyle: "short",
          }),
          action: "Inbound Referral Registered",
          performedBy: "Front Desk Triage Officer",
          notes: `Referred by ${formData.referrerName}`,
        },
      ],
    };

    saveInboundReferralOfflineSafe(newReferral);
    onReferralCreated(newReferral);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Register Inbound Patient Referral</h2>
              <p className="text-xs text-slate-400">
                Log external doctor, clinic, or hospital transfer with clinical audit trail
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {/* Section 1: Referring Practitioner Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                Referring Practitioner / Source Entity *
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                NMC Ethics Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Source Entity Type *
                </label>
                <select
                  value={formData.referringEntity}
                  onChange={(e) => setFormData({ ...formData, referringEntity: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                >
                  <option value="External Doctor">External Doctor (MBBS/MD)</option>
                  <option value="Clinic / Polyclinic">Clinic / Polyclinic</option>
                  <option value="Hospital / Nursing Home">Hospital / Nursing Home</option>
                  <option value="Community Health Worker (ASHA)">Community Health Worker (ASHA)</option>
                  <option value="Corporate / TPA">Corporate / TPA Partner</option>
                  <option value="Self / Walk-in">Self / Walk-in</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Doctor / Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.referrerName}
                  onChange={(e) => setFormData({ ...formData, referrerName: e.target.value })}
                  placeholder="e.g. Dr. M. K. Murthy, MBBS"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Medical Reg No. (Optional)
                </label>
                <input
                  type="text"
                  value={formData.referrerRegNo}
                  onChange={(e) => setFormData({ ...formData, referrerRegNo: e.target.value })}
                  placeholder="e.g. TSMC/2014/4892"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Referrer Contact / Phone
              </label>
              <input
                type="text"
                value={formData.referrerContact}
                onChange={(e) => setFormData({ ...formData, referrerContact: e.target.value })}
                placeholder="e.g. +91 98490 12345"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
              />
            </div>
          </div>

          {/* Section 2: Patient Demographics */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider block">
              Patient Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="e.g. Mohammad Arif"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  placeholder="35"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.patientGender}
                  onChange={(e) => setFormData({ ...formData, patientGender: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Patient Mobile Number
              </label>
              <input
                type="text"
                value={formData.patientPhone}
                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                placeholder="e.g. 98765 43210"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
              />
            </div>
          </div>

          {/* Section 3: Hospital Triage & Service Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Destination Department *
              </label>
              <select
                value={formData.destinationDepartment}
                onChange={(e) => setFormData({ ...formData, destinationDepartment: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="Gynecology">Gynecology</option>
                <option value="General Surgery">General Surgery</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Assigned Treating Doctor *
              </label>
              <select
                value={formData.treatingDoctor}
                onChange={(e) => setFormData({ ...formData, treatingDoctor: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
              >
                <option value="Dr. Rao">Dr. Rao</option>
                <option value="Dr. S. Reddy">Dr. S. Reddy</option>
                <option value="Dr. A. Rao">Dr. A. Rao</option>
                <option value="Dr. K. Sharma">Dr. K. Sharma</option>
                <option value="Dr. P. Nair">Dr. P. Nair</option>
                <option value="Dr. V. Menon">Dr. V. Menon</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Referral Clinical Priority *
              </label>
              <select
                value={formData.referralPriority}
                onChange={(e) => setFormData({ ...formData, referralPriority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-slate-900 text-xs"
              >
                <option value="Routine">Routine (Elective Outpatient)</option>
                <option value="Urgent">Urgent (Within 4 Hours)</option>
                <option value="Emergency">Emergency (Immediate ICU/Cath/OT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Clinical Summary / Notes from Referring Doctor
            </label>
            <textarea
              rows={3}
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
              placeholder="e.g. Patient referred for persistent pyrexia and elevated CRP. Suspected infective etiology."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
            ></textarea>
          </div>

          {/* Ethics Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Indian Medical Ethics Note:</strong> No referral commissions or financial kickbacks are permitted. An official NMC-compliant Clinical Acknowledgment & Care Transition Letter can be printed upon saving.
            </p>
          </div>

          {/* Action Buttons */}
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Save Referral & Generate Acknowledgment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
