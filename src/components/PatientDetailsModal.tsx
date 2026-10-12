"use client";

import React from "react";
import {
  X,
  Printer,
  Calendar,
  Phone,
  User,
  Stethoscope,
  Building,
  CreditCard,
  FileCheck,
} from "lucide-react";
import { Patient } from "@/types";

interface PatientDetailsModalProps {
  patient: Patient | null;
  onClose: () => void;
  onPrintSlip: (patient: Patient) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  onClose,
  onPrintSlip,
}) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-700 font-bold text-sm">
              {patient.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {patient.name}
                </h3>
                <span className="font-mono text-xs text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full font-semibold">
                  {patient.mrId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.age} Yrs • {patient.gender === "M" ? "Male" : "Female"} • {patient.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Clinical Case Card */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Department</span>
              <p className="font-semibold text-slate-800 mt-0.5">{patient.department}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Attending Doctor</span>
              <p className="font-semibold text-slate-800 mt-0.5">{patient.attendingDoctor}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Visit Type</span>
              <p className="font-semibold text-slate-800 mt-0.5">{patient.type === "IP" ? "Inpatient (IP)" : "Outpatient (OP)"}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">OP/IP Token</span>
              <p className="font-mono font-semibold text-slate-800 mt-0.5">{patient.opIpId}</p>
            </div>
            {patient.bedNumber && (
              <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Assigned Bed:</span>
                <span className="font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                  {patient.wardName} — Bed {patient.bedNumber}
                </span>
              </div>
            )}
          </div>

          {/* Diagnosis & Notes */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-teal-600" />
              Provisional Clinical Diagnosis
            </h4>
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium">
              {patient.diagnosis || "Consultation in progress. Standard clinical evaluation."}
            </div>
          </div>

          {/* Billing Snapshot */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Total Billed</span>
              <div className="text-lg font-bold text-white">
                ₹{patient.billAmount?.toLocaleString() || "0"}
              </div>
            </div>
            {patient.advancePaid && (
              <div className="text-right">
                <span className="text-[11px] text-emerald-400">Advance Paid</span>
                <div className="text-lg font-bold text-emerald-400">
                  ₹{patient.advancePaid.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onPrintSlip(patient)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Consultation Slip
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
