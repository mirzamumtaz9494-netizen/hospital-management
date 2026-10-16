"use client";

import React from "react";
import { X, Printer, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";

interface PrintAuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintAuditCertificateModal: React.FC<
  PrintAuditCertificateModalProps
> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800">
              Audit &amp; Statutory Compliance Certificate Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0 print:m-0 font-serif">
          {/* Hospital Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-900 text-white flex items-center justify-center font-sans font-black text-xl">
                CP
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  VitalSync MULTISPECIALTY HOSPITAL &amp; RESEARCH CENTRE
                </h1>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
                  NABH Accredited Tertiary Healthcare Facility • Registration No: CEA-REG-DIST-0145
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Plot 14, Health City, Metro Bypass Road • Tel: +91 40 2345 6789 • compliance@VitalSync.hms
                </p>
              </div>
            </div>

            <div className="text-right font-sans">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold uppercase tracking-wider">
                CERTIFIED COMPLIANT
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                REF: AUD-CERT-2026-Q3
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-6">
            <h2 className="text-lg font-black tracking-wider uppercase text-slate-900 underline decoration-teal-600 underline-offset-8">
              ANNUAL SYSTEM SECURITY &amp; STATUTORY AUDIT ATTESTATION
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-3">
              Issued pursuant to NABH 5th Edition Standard MUM.5, AERB Radiation Safety Guidelines, and HIPAA Security Rule CFR 164.312
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-800">
            <p>
              This is to solemnly attest and certify that the Information Technology, Role-Based Access Control (RBAC), and Biomedical Equipment Management Systems at <strong>VitalSync Multispecialty Hospital</strong> have been subjected to periodic administrative and technical audit verification for the period ending <strong>15th October 2026</strong>.
            </p>

            {/* Audit Checklist Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden my-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3">Audit Domain</th>
                    <th className="py-2 px-3">Statutory Standard</th>
                    <th className="py-2 px-3">Finding / Verification Result</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3 font-semibold">User Authentication</td>
                    <td className="py-2 px-3">HIPAA / NABH</td>
                    <td className="py-2 px-3">92.4% Two-Factor (MFA) enforcement across all 148 clinical staff accounts.</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">Controlled Substance Access</td>
                    <td className="py-2 px-3">NDPS Act / CDSCO</td>
                    <td className="py-2 px-3">Dual-key authorization required for Schedule H1 &amp; Narcotic lockbox issues.</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">Diagnostic Sign-off Privileging</td>
                    <td className="py-2 px-3">NABL ISO 15189</td>
                    <td className="py-2 px-3">Only accredited Chief Biochemist &amp; Pathologists possess digital result release.</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">Biomedical Equipment AMC</td>
                    <td className="py-2 px-3">AERB / NABH FMS.5</td>
                    <td className="py-2 px-3">All 8 critical Class A assets covered under active OEM preventive maintenance.</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">PASSED</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">Immutable Audit Trail</td>
                    <td className="py-2 px-3">CERT-In / HIPAA</td>
                    <td className="py-2 px-3">Write-once SHA-256 cryptographic logging active for all admin &amp; financial actions.</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">PASSED</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-[11px] text-slate-600">
              <span className="font-bold text-slate-900">Digital Audit Seal (SHA-256):</span> 7a9f8b1c4e20d3f88921e56b9c02d1a3e4f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
            </div>

            {/* Signature Block */}
            <div className="grid grid-cols-2 gap-12 pt-10 mt-8 border-t border-slate-300">
              <div className="text-center">
                <div className="font-serif italic text-base mb-1 font-bold">Vikram Sethi</div>
                <div className="w-40 border-b border-slate-400 mx-auto mb-1"></div>
                <div className="font-bold text-slate-900 text-xs">Vikram Sethi</div>
                <div className="text-[11px] text-slate-500">Chief Information Security Officer (CISO)</div>
                <div className="text-[10px] text-slate-400">VitalSync HMS Network Infrastructure</div>
              </div>

              <div className="text-center">
                <div className="font-serif italic text-base mb-1 font-bold">Dr. Arvind Swaminathan</div>
                <div className="w-40 border-b border-slate-400 mx-auto mb-1"></div>
                <div className="font-bold text-slate-900 text-xs">Dr. Arvind Swaminathan, MD</div>
                <div className="text-[11px] text-slate-500">Medical Director &amp; Chairman</div>
                <div className="text-[10px] text-slate-400">Hospital Clinical Governance Committee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
