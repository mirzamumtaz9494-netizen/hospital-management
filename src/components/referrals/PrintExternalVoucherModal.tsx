"use client";

import React, { useRef, useState, useEffect } from "react";
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
  CheckCircle2,
} from "lucide-react";
import { ExternalDiagnosticOrder, ExternalDiagnosticCenter } from "@/types";
import { useTenant } from "@/context/TenantContext";
import { MOCK_EXTERNAL_DIAGNOSTIC_CENTRES } from "@/data/referralsMockData";
import {
  generateQrCodeDataUrl,
  createDiagnosticVoucherQrUrl,
} from "@/lib/qrService";
import { printElement } from "@/lib/printService";

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
  const [qrUrl, setQrUrl] = useState<string>("");

  // Resilient partner center resolution
  const resolvedCenter =
    center ||
    (order
      ? MOCK_EXTERNAL_DIAGNOSTIC_CENTRES.find(
          (c) =>
            c.id === order.destinationCenterId ||
            c.centerName.toLowerCase() === order.destinationCenterName?.toLowerCase()
        )
      : null) || {
      id: order?.destinationCenterId || "dc-fallback",
      centerName: order?.destinationCenterName || "Vijaya Diagnostic Centre",
      branch: "Banjara Hills Main Center",
      address: "Road No. 1, Opposite City Centre Mall, Banjara Hills, Hyderabad, Telangana 500034",
      phone: "+91 40 2342 0411",
      email: "b2b.banjara@vijayadiagnostic.com",
      accreditations: ["NABL", "NABH", "ISO 15189"],
      servicesOffered: [],
      settlementCycle: "Monthly" as const,
      creditTermsDays: 30,
      bankDetails: {
        accountName: order?.destinationCenterName || "Partner Diagnostics",
        accountNumber: "000000000000",
        ifscCode: "HDFC0000123",
        bankName: "HDFC Bank",
      },
      createdAt: order?.referralDate || new Date().toISOString(),
    };

  useEffect(() => {
    if (order) {
      const qrWebUrl = createDiagnosticVoucherQrUrl({
        voucherNumber: order.voucherNumber,
        uhid: order.uhid,
        patientName: order.patientName,
        patientAge: order.patientAge,
        patientGender: order.patientGender,
        patientPhone: order.patientPhone,
        referralDate: order.referralDate,
        destinationCenterName: resolvedCenter.centerName,
        centerAddress: resolvedCenter.address,
        centerPhone: resolvedCenter.phone,
        referringDoctor: order.referringDoctor,
        department: order.department,
        tests: order.selectedTests.map((t) => ({
          testName: t.testName,
          testCode: t.testCode,
        })),
        urgency: order.urgency,
      });
      generateQrCodeDataUrl(qrWebUrl)
        .then((url) => setQrUrl(url))
        .catch(() => {});
    }
  }, [order, resolvedCenter]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    printElement(printRef.current, `${order.voucherNumber} - External Diagnostic Voucher`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:static print:p-0 print:m-0 print:overflow-visible print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:static print:w-full print:max-w-none print:shadow-none print:border-none print:m-0 print:overflow-visible">
        {/* Modal Controls Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
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

        {/* Printable Sheet (print-container) */}
        <div
          ref={printRef}
          className="print-container p-6 sm:p-8 text-slate-900 space-y-5 print:p-4 print:space-y-4 font-sans bg-white"
        >
          {/* Hospital Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  {currentTenant.name || "APEX CARE HOSPITAL"}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 print:border-slate-800 print:text-black">
                  NABH ACCREDITED
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {currentTenant.tagline || "Multi-Specialty Healthcare & Trauma Centre"}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {currentTenant.city}, {currentTenant.state} • Ph: {currentTenant.contactPhone} • Email:{" "}
                {currentTenant.contactEmail}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {qrUrl && (
                <div className="border border-slate-300 p-1 rounded-lg bg-white shrink-0 print:border-slate-800">
                  <img src={qrUrl} alt="Voucher QR Code" className="w-14 h-14 object-contain" />
                </div>
              )}
              <div className="text-right">
                <div className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-slate-900 print:bg-white print:border-slate-800">
                  {order.voucherNumber}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Date: {order.referralDate}</p>
                {order.urgency !== "Routine" && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 print:border-slate-800 print:text-black">
                    PRIORITY: {order.urgency.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center print:bg-white print:border-slate-800">
            <h1 className="text-xs font-black uppercase tracking-widest text-slate-800 print:text-black">
              Official Diagnostic Referral & Investigation Requisition
            </h1>
            <p className="text-[11px] text-slate-500 print:text-slate-700 mt-0.5">
              Authorized Outbound Investigation Order under Institutional Care Agreement
            </p>
          </div>

          {/* Patient & Referring Doctor Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5 print:bg-white print:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Patient Demographics
              </span>
              <div className="font-bold text-slate-950 text-sm">{order.patientName}</div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-600">UHID:</span>{" "}
                <span className="font-mono font-bold text-teal-800 print:text-black">{order.uhid}</span>
              </div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-600">Age / Sex:</span> {order.patientAge} Yrs /{" "}
                {order.patientGender === "M" ? "Male" : order.patientGender === "F" ? "Female" : "Other"}
              </div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-600">Phone:</span> {order.patientPhone}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5 print:bg-white print:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Referring Clinician & Dept
              </span>
              <div className="font-bold text-slate-950 text-sm">{order.referringDoctor}</div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-600">Department:</span> {order.department}
              </div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-600">Hospital Unit:</span> {currentTenant.unitName}
              </div>
              <div className="text-slate-700">
                <span className="font-semibold text-slate-600">Order Status:</span>{" "}
                <span className="font-semibold text-emerald-700 print:text-black">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Target Diagnostic Partner Details (Clearly Highlighted for End User) */}
          <div className="p-4 bg-teal-50/70 border-2 border-teal-500/50 rounded-xl space-y-2 text-xs print:bg-white print:border-2 print:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700 print:text-black shrink-0" />
                <span className="font-black text-teal-950 print:text-black text-sm">
                  Partner Diagnostic Center: {resolvedCenter.centerName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 print:bg-white print:border-slate-800 print:text-black">
                AUTHORIZED PARTNER
              </span>
            </div>

            <div className="text-slate-700 print:text-black space-y-1 text-[11px] pt-1">
              <div className="flex items-start gap-1">
                <span className="font-bold text-slate-900 print:text-black shrink-0">Facility Address:</span>
                <span>{resolvedCenter.address}</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="font-bold text-slate-900 print:text-black">Helpline / Booking:</span>{" "}
                  <span className="font-semibold text-teal-800 print:text-black">{resolvedCenter.phone}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 print:text-black">Direct Desk Email:</span>{" "}
                  <span>{resolvedCenter.email}</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-900 print:text-black">Accreditations:</span>{" "}
                <span className="font-medium">
                  {resolvedCenter.accreditations?.join(", ") || "NABL, NABH, ISO 15189"}
                </span>
              </div>
            </div>
          </div>

          {/* Investigations Ordered Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Investigations Requisitioned:
            </span>
            <table className="w-full text-xs border border-slate-300 rounded-xl overflow-hidden print:border-slate-800">
              <thead className="bg-slate-100 text-slate-800 font-bold text-left print:bg-slate-200">
                <tr>
                  <th className="py-2.5 px-3 border-b border-slate-300 print:border-slate-800">#</th>
                  <th className="py-2.5 px-3 border-b border-slate-300 print:border-slate-800">Test Code</th>
                  <th className="py-2.5 px-3 border-b border-slate-300 print:border-slate-800">Investigation Name</th>
                  <th className="py-2.5 px-3 border-b border-slate-300 print:border-slate-800">Modality</th>
                  <th className="py-2.5 px-3 border-b border-slate-300 print:border-slate-800 text-right">Standard Tariff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 print:divide-slate-400">
                {order.selectedTests.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-800">{t.testCode}</td>
                    <td className="py-2 px-3 font-semibold text-slate-950">{t.testName}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 print:border-slate-800">
                        {t.modality}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{t.mrp.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-950 print:bg-slate-100 print:border-slate-800">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-right">
                    Total Estimated Investigation Tariff:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-sm text-teal-900 print:text-black">
                    ₹{order.totalMrp.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Clinical Indication & Instructions */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs print:bg-white print:border-slate-800">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 print:text-black shrink-0" />
              Provisional Clinical Indication / Notes:
            </div>
            <p className="text-slate-700 italic">
              "{order.clinicalIndication || "Clinical evaluation per attending specialist order."}"
            </p>
            <div className="pt-2 border-t border-slate-200 print:border-slate-400 text-[11px] text-slate-600 print:text-slate-800">
              <span className="font-bold text-slate-900">Patient Instructions:</span> Please present this official referral voucher at the reception of{" "}
              <strong>{resolvedCenter.centerName}</strong>. Carry a valid government photo ID. Fasting or scan-specific contrast preparation instructions communicated by the hospital must be strictly followed.
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-end justify-between text-xs">
            <div className="space-y-1">
              {/* Simulated High-Contrast Barcode */}
              <div className="font-mono text-[10px] tracking-widest text-slate-900 font-black">
                |||| | |||| ||| ||||| || |||| ||| |||| || |||||
              </div>
              <div className="font-mono font-bold text-slate-900 text-xs">
                *{order.voucherNumber}*
              </div>
              <p className="text-[10px] text-slate-500 print:text-slate-700">
                Direct digital report routing: reports@{currentTenant.contactEmail || "apexcare.com"}
              </p>
            </div>

            <div className="text-right space-y-6">
              <div className="h-6"></div>
              <div className="border-t border-slate-900 pt-1 text-center min-w-[170px]">
                <div className="font-bold text-slate-950 text-xs">{order.referringDoctor}</div>
                <div className="text-[10px] text-slate-600">Authorized Clinician Signature</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
