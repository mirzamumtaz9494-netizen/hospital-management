"use client";

import React from "react";
import {
  X,
  Printer,
  Activity,
  ShieldCheck,
  TrendingUp,
  Award,
  Calendar,
  IndianRupee,
  Building,
} from "lucide-react";
import { SavedReportItem } from "@/types";

interface PrintExecutiveReportModalProps {
  isOpen: boolean;
  report: SavedReportItem | null;
  onClose: () => void;
}

export const PrintExecutiveReportModal: React.FC<PrintExecutiveReportModalProps> = ({
  isOpen,
  report,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[94vh] overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-800" />
            <span className="text-xs font-bold text-slate-800">
              Executive MIS Report • {report.code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Executive Document
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Sheet */}
        <div className="print-container overflow-y-auto p-8 sm:p-10 font-sans text-slate-900 bg-white space-y-6">
          {/* 1. Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                  CP
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                    CarePulse Multispecialty Hospital
                  </h1>
                  <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                    Office of the Chief Medical Officer &amp; Executive Management Board
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Metro Health City, Hyderabad • NABH 5th Edition Accredited • ISO 9001:2015
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-800 uppercase font-mono">
                {report.code}
              </span>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Generated: {report.lastGenerated}
              </p>
            </div>
          </div>

          {/* 2. Document Title Banner */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
              {report.title}
            </h2>
            <p className="text-xs text-slate-600">
              {report.description}
            </p>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1 font-mono">
              <span>Category: <strong className="text-slate-800">{report.category}</strong></span>
              <span>Cadence: <strong className="text-slate-800">{report.frequency}</strong></span>
              <span>Signatory: <strong className="text-slate-800">{report.generatedBy}</strong></span>
            </div>
          </div>

          {/* 3. Executive KPI Dashboard Grid */}
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
              <div className="text-[10px] text-slate-500 font-sans uppercase">Daily Gross Revenue</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">₹8,90,600</div>
              <div className="text-[10px] text-emerald-700 font-semibold font-sans">▲ 9.6% Overall Target</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
              <div className="text-[10px] text-slate-500 font-sans uppercase">Bed Occupancy Rate</div>
              <div className="text-lg font-black text-blue-800 mt-0.5">78.0%</div>
              <div className="text-[10px] text-slate-500 font-sans">234 Occupied / 58 Vacant</div>
            </div>

            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
              <div className="text-[10px] text-slate-500 font-sans uppercase">Average Length of Stay</div>
              <div className="text-lg font-black text-teal-800 mt-0.5">3.4 Days</div>
              <div className="text-[10px] text-emerald-700 font-sans">Within NABH Threshold</div>
            </div>
          </div>

          {/* 4. Stream Revenue Breakdown */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Consolidated Revenue Centers
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 font-bold uppercase text-[10px] text-slate-500">
                  <th className="py-2">Revenue Center</th>
                  <th className="py-2">Operational Volume</th>
                  <th className="py-2">Collection Mode Mix</th>
                  <th className="py-2 text-right">Gross Earnings (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2 font-sans font-semibold text-slate-900">Outpatient (OPD) Consultations</td>
                  <td className="py-2 text-slate-600 font-sans">142 Visits • 14 min wait</td>
                  <td className="py-2 text-slate-600 font-sans">UPI 52%, Cash 28%, Card 20%</td>
                  <td className="py-2 text-right font-bold text-slate-900">₹1,85,400</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-semibold text-slate-900">Inpatient (IPD) Beds &amp; Surgery</td>
                  <td className="py-2 text-slate-600 font-sans">234 Admitted • 10 Surgeries</td>
                  <td className="py-2 text-slate-600 font-sans">TPA Cashless 68%, Bank 32%</td>
                  <td className="py-2 text-right font-bold text-slate-900">₹5,20,000</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-semibold text-slate-900">Laboratory &amp; Diagnostics (LIS)</td>
                  <td className="py-2 text-slate-600 font-sans">186 Tests • 94.6% TAT</td>
                  <td className="py-2 text-slate-600 font-sans">Direct 45%, IPD 55%</td>
                  <td className="py-2 text-right font-bold text-slate-900">₹65,200</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-semibold text-slate-900">Pharmacy &amp; Drug Formulary</td>
                  <td className="py-2 text-slate-600 font-sans">148 Prescriptions Dispensed</td>
                  <td className="py-2 text-slate-600 font-sans">Retail 62%, IPD Indents 38%</td>
                  <td className="py-2 text-right font-bold text-slate-900">₹1,20,000</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold text-xs bg-slate-50">
                  <td className="py-2.5 font-sans">Total Hospital Day Gross</td>
                  <td className="py-2.5 font-sans" colSpan={2}>376 Total Patients Cared For</td>
                  <td className="py-2.5 text-right font-black text-sm text-teal-800">₹8,90,600</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 5. NABH Quality & Safety Compliance Notes */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
              Clinical Quality &amp; Governance Certification:
            </span>
            <p className="text-slate-700 italic">
              Certified that all clinical procedures, infection control protocols, and financial audits documented in this MIS report adhere to National Accreditation Board for Hospitals &amp; Healthcare Providers (NABH) 5th Edition standards.
            </p>
          </div>

          {/* 6. Signatures */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 items-end text-xs">
            <div>
              <div className="font-serif italic text-teal-800 text-sm font-bold">
                Finance &amp; Audit Desk
              </div>
              <div className="border-t border-slate-400 pt-1 mt-1 font-bold text-slate-900 text-xs">
                Chief Financial Controller
              </div>
              <div className="text-[10px] text-slate-500">
                CarePulse Hospital Accounts
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-teal-900 text-base font-bold">
                Dr. Bhargav
              </div>
              <div className="border-t border-slate-400 pt-1 mt-1 font-bold text-slate-900 text-xs">
                Dr. Bhargav, MBBS, MD
              </div>
              <div className="text-[10px] text-slate-500">
                Chief Medical Officer &amp; Management Board
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
