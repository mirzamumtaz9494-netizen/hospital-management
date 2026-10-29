"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Building2,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Activity,
  ArrowRight,
  Stethoscope,
  Printer,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "voucher";
  const uhid = searchParams.get("uhid") || "UHID-APEX-2026-000000";
  const name = searchParams.get("name") || "Patient Name";
  const age = searchParams.get("age") || "30";
  const gender = searchParams.get("gender") || "M";
  const phone = searchParams.get("phone") || "+91 98480 12345";
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const doc = searchParams.get("doc") || "Attending Medical Officer";
  const dept = searchParams.get("dept") || "General Medicine";

  // Diagnostic voucher specific fields
  const vch = searchParams.get("vch") || "EDV-2026-0000";
  const center = searchParams.get("center") || "Vijaya Diagnostic Centre";
  const centerAddress =
    searchParams.get("address") ||
    "Road No. 1, Opposite City Centre Mall, Banjara Hills, Hyderabad, Telangana 500034";
  const centerPhone = searchParams.get("cphone") || "+91 40 2342 0411";
  const tests = searchParams.get("tests") || "Specialized Diagnostic Investigation";
  const urgency = searchParams.get("urgency") || "Routine";

  // OPD specific fields
  const opId = searchParams.get("opId") || "OP-2026-001";
  const fee = searchParams.get("fee") || "500";

  const isVoucher = type === "voucher";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-3.5 sticky top-0 z-50">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-black text-sm">
              VS
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                VitalSync Digital Pass
              </span>
              <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider block">
                Official Clinical Verification
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            NABH VERIFIED
          </div>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h1 className="font-bold text-sm text-emerald-100">
                Authentic Hospital Document
              </h1>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Digitally certified by Apex Care Hospital clinical electronic medical record (EMR).
            </p>
          </div>
        </div>

        {/* Document Header Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Issuing Hospital
              </span>
              <h2 className="text-lg font-black text-white tracking-tight">
                Apex Care Hospital
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Specialty Healthcare & Trauma Centre • Hyderabad
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-teal-300">
                {isVoucher ? vch : opId}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Date: {date}</p>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Patient Identification
            </span>
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">Patient Name</span>
                <span className="font-bold text-white text-sm">{name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">Hospital UHID</span>
                <span className="font-mono font-bold text-teal-400">{uhid}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">Age / Sex</span>
                <span className="text-slate-200 font-medium">
                  {age} Yrs / {gender === "M" ? "Male" : gender === "F" ? "Female" : "Other"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">Registered Phone</span>
                <span className="text-slate-200 font-medium">{phone}</span>
              </div>
            </div>
          </div>

          {/* Clinical Authority */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block font-semibold">Attending Doctor</span>
              <span className="font-bold text-white">{doc}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-semibold">Department</span>
              <span className="text-slate-200 font-medium">{dept}</span>
            </div>
          </div>

          {/* Document-Specific Details */}
          {isVoucher ? (
            /* External Diagnostic Requisition */
            <div className="space-y-3 pt-1">
              {/* Partner Diagnostic Center Box */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span className="font-bold text-white text-sm">
                      Partner Diagnostic Center: {center}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    AUTHORIZED
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] space-y-1 pt-1 border-t border-teal-500/20">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{centerAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Booking Helpline: <strong className="text-white">{centerPhone}</strong></span>
                  </div>
                </div>
              </div>

              {/* Requisitioned Tests */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Requisitioned Investigation(s)
                </span>
                <p className="font-bold text-white text-sm text-teal-300">
                  {tests}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Priority: {urgency}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Institutional Care Agreement Tariff
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* OPD Consultation Token Details */
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Outpatient Consultation Pass
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">Token Status</span>
                  <span className="font-bold text-emerald-400">Consultation Active / Valid 7 Days</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Consultation Fee</span>
                  <span className="font-bold text-teal-300">₹{fee} (Paid)</span>
                </div>
              </div>
            </div>
          )}

          {/* Patient Instruction Reminder */}
          <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Please present this verified digital pass along with a valid government photo ID at the reception desk.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF Pass
            </button>
            <a
              href={`tel:${isVoucher ? centerPhone : "+919848012345"}`}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 text-center"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              Call Reception
            </a>
          </div>
        </div>

        {/* Back Link to Hospital Terminal */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition"
          >
            Access VitalSync Clinical Terminal <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 p-4 text-center text-[10px] text-slate-500">
        VitalSync HMS • National Digital Health Mission & NABH Quality Standard COP.2 Compliant
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 font-medium">Verifying Hospital Document...</p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
