"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Building2,
  Calendar,
  User,
  Stethoscope,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { ExternalDiagnosticOrder, ExternalDiagnosticCenter } from "@/types";
import { useTenant } from "@/context/TenantContext";

interface PrintExternalVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ExternalDiagnosticOrder | null;
  center?: ExternalDiagnosticCenter | null;
}

export const PrintExternalVoucherModal: React.FC<PrintExternalVoucherModalProps> = ({
  isOpen,
  onClose,
  order,
  center,
}) => {
  const { currentTenant } = useTenant();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">External Diagnostic Referral Slip</h2>
              <p className="text-[11px] text-slate-400">Voucher: {order.voucherNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Voucher
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div ref={printRef} className="p-6 sm:p-8 text-slate-800 space-y-6 print:p-4 print:space-y-4">
          {/* Hospital Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-950">
                  {currentTenant.name || "APEX CARE HOSPITAL"}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  NABH ACCREDITED
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{currentTenant.tagline || "Multi-Specialty Healthcare & Trauma Centre"}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {currentTenant.city}, {currentTenant.state} • Ph: {currentTenant.contactPhone}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-slate-800">
                {order.voucherNumber}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Date: {order.referralDate}</p>
              {order.urgency !== "Routine" && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  PRIORITY: {order.urgency.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <h1 className="text-xs font-bold uppercase tracking-widest text-slate-700">
              Official Diagnostic Referral & Investigation Requisition
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Authorized Outbound Investigation Order under Institutional Care Agreement
            </p>
          </div>

          {/* Patient & Referring Doctor Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Patient Demographics
              </span>
              <div className="font-bold text-slate-900 text-sm">{order.patientName}</div>
              <div className="text-slate-600">
                <span className="font-semibold">UHID:</span> <span className="font-mono font-bold text-teal-700">{order.uhid}</span>
              </div>
              <div className="text-slate-600">
                <span className="font-semibold">Age / Sex:</span> {order.patientAge} Yrs / {order.patientGender === "M" ? "Male" : order.patientGender === "F" ? "Female" : "Other"}
              </div>
              <div className="text-slate-600">
                <span className="font-semibold">Phone:</span> {order.patientPhone}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Referring Clinician & Dept
              </span>
              <div className="font-bold text-slate-900 text-sm">{order.referringDoctor}</div>
              <div className="text-slate-600">
                <span className="font-semibold">Department:</span> {order.department}
              </div>
              <div className="text-slate-600">
                <span className="font-semibold">Hospital Unit:</span> {currentTenant.unitName}
              </div>
              <div className="text-slate-600">
                <span className="font-semibold">Order Status:</span>{" "}
                <span className="font-semibold text-emerald-700">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Target Diagnostic Partner Details */}
          <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span className="font-bold text-teal-950 text-sm">
                  Partner Diagnostic Center: {order.destinationCenterName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                AUTHORIZED PARTNER
              </span>
            </div>
            {center && (
              <div className="text-slate-600 space-y-0.5 text-[11px] pt-1">
                <div><span className="font-semibold text-slate-700">Address:</span> {center.address}</div>
                <div><span className="font-semibold text-slate-700">Helpline / Booking:</span> {center.phone} • {center.email}</div>
                <div><span className="font-semibold text-slate-700">Accreditations:</span> {center.accreditations.join(", ")}</div>
              </div>
            )}
          </div>

          {/* Investigations Ordered Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Investigations Requisitioned:
            </span>
            <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-semibold text-left">
                <tr>
                  <th className="py-2.5 px-3 border-b border-slate-200">#</th>
                  <th className="py-2.5 px-3 border-b border-slate-200">Test Code</th>
                  <th className="py-2.5 px-3 border-b border-slate-200">Investigation Name</th>
                  <th className="py-2.5 px-3 border-b border-slate-200">Modality</th>
                  <th className="py-2.5 px-3 border-b border-slate-200 text-right">Standard Tariff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.selectedTests.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-700">{t.testCode}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{t.testName}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {t.modality}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                      ₹{t.mrp.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-right">
                    Total Estimated Investigation Tariff:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-sm text-teal-800">
                    ₹{order.totalMrp.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Clinical Indication & Instructions */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Provisional Clinical Indication / Notes:
            </div>
            <p className="text-slate-600 italic">
              "{order.clinicalIndication || "Clinical evaluation per attending specialist order."}"
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Patient Instructions:</span> Please carry this original referral slip along with valid photo ID. Fasting or special contrast preparation as communicated by the hospital desk must be strictly observed.
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="space-y-1">
              {/* Simulated Barcode */}
              <div className="font-mono text-[9px] tracking-widest text-slate-400">||| | |||| ||| ||||| || |||| ||| ||||</div>
              <div className="font-mono font-bold text-slate-800 text-[11px]">
                *{order.voucherNumber}*
              </div>
              <p className="text-[10px] text-slate-400">
                Direct digital report routing: reports@{currentTenant.contactEmail || "apexcare.com"}
              </p>
            </div>

            <div className="text-right space-y-8">
              <div className="h-8"></div>
              <div className="border-t border-slate-400 pt-1 text-center min-w-[160px]">
                <div className="font-bold text-slate-900 text-xs">{order.referringDoctor}</div>
                <div className="text-[10px] text-slate-500">Authorized Clinician Signature</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
