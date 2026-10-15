"use client";

import React from "react";
import {
  X,
  Printer,
  Activity,
  Award,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";
import { LabOrder, LabParameterResult } from "@/types";
import { MOCK_LAB_CATALOG } from "@/data/labMockData";

interface PrintLabReportModalProps {
  order: LabOrder | null;
  onClose: () => void;
}

export const PrintLabReportModal: React.FC<PrintLabReportModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[94vh] overflow-hidden flex flex-col">
        {/* Modal Controls Bar (Hidden in Print) */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-teal-800" />
            <span className="text-xs font-bold text-slate-800">
              Diagnostic Laboratory Investigation Report • NABL MC-2941
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Sheet */}
        <div className="print-container overflow-y-auto p-8 sm:p-10 font-sans text-slate-900 bg-white space-y-6">
          {/* 1. Hospital & Diagnostic Laboratory Header */}
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
                    Department of Laboratory Medicine & Molecular Diagnostics
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Metro Health City, Road No. 12, Banjara Hills, Hyderabad • 24/7 Diagnostics Desk: +91 40 6822 9900
              </p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                NABL Accredited • MC-2941
              </div>
              <p className="text-[9px] text-slate-400 mt-1">
                ISO 15189:2012 Certified Lab
              </p>
            </div>
          </div>

          {/* 2. Patient Demographics & Specimen Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
            <div className="space-y-1">
              <div>
                <span className="text-slate-500 text-[11px]">Patient Name:</span>{" "}
                <strong className="text-slate-900 font-bold text-sm">
                  {order.patientName}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Age / Gender:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {order.age} Years / {order.gender === "M" ? "Male" : order.gender === "F" ? "Female" : "Other"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Patient MR ID:</span>{" "}
                <span className="font-mono font-bold text-slate-900">{order.mrId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">OP/IP Ref No:</span>{" "}
                <span className="font-mono text-slate-700">{order.opIpNo}</span>
                {order.wardBed && (
                  <span className="ml-2 font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded text-[10px]">
                    {order.wardBed}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div>
                <span className="text-slate-500 text-[11px]">Lab Order No:</span>{" "}
                <strong className="font-mono text-slate-900 font-bold">
                  {order.orderNo}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Specimen Barcode:</span>{" "}
                <span className="font-mono font-bold text-slate-800">{order.barcode}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Referring Doctor:</span>{" "}
                <span className="font-semibold text-slate-800">{order.referringDoctor}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Collection Time:</span>{" "}
                <span className="font-mono text-slate-700">
                  {order.orderDate} {order.sampleCollectedAt || order.orderTime}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Diagnostic Test Results Sections */}
          <div className="space-y-6">
            {order.tests.map((test) => {
              const catItem = MOCK_LAB_CATALOG.find((c) => c.code === test.testCode);
              const testParams = test.results || (catItem ? catItem.parameters.map((p) => ({
                parameterId: p.id,
                parameterName: p.name,
                unit: p.unit,
                normalRange: p.normalRange,
                value: String(p.defaultValue || "-"),
                flag: "Normal" as const,
              })) : []);

              return (
                <div key={test.id} className="space-y-2">
                  {/* Test Section Header */}
                  <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
                    <div>
                      <span className="font-black text-slate-900 text-sm uppercase tracking-wide">
                        {test.testName}
                      </span>
                      <span className="ml-2 text-[10px] font-mono text-slate-500">
                        [{test.department}]
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Method: Automated Chemiluminescence / Flow Cytometry
                    </span>
                  </div>

                  {/* Results Table */}
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-2 px-2">Investigation Parameter</th>
                        <th className="py-2 px-2">Observed Value</th>
                        <th className="py-2 px-2">Unit</th>
                        <th className="py-2 px-2">Biological Ref. Interval</th>
                        <th className="py-2 px-2 text-right">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {testParams.map((param, pIdx) => {
                        const isAbnormal =
                          param.flag === "High" ||
                          param.flag === "Low" ||
                          param.flag === "Critical";

                        return (
                          <tr
                            key={pIdx}
                            className={
                              param.flag === "Critical"
                                ? "bg-rose-50/80 font-bold"
                                : isAbnormal
                                ? "bg-amber-50/50 font-semibold"
                                : ""
                            }
                          >
                            <td className="py-2 px-2 font-sans font-semibold text-slate-900">
                              {param.parameterName}
                            </td>

                            <td
                              className={`py-2 px-2 text-sm ${
                                param.flag === "Critical"
                                  ? "text-rose-700 font-black"
                                  : isAbnormal
                                  ? "text-amber-800 font-black"
                                  : "text-slate-900 font-bold"
                              }`}
                            >
                              {param.value}
                            </td>

                            <td className="py-2 px-2 text-slate-500 text-[11px]">
                              {param.unit || "-"}
                            </td>

                            <td className="py-2 px-2 text-slate-600 text-[11px]">
                              {param.normalRange}
                            </td>

                            <td className="py-2 px-2 text-right font-sans">
                              {param.flag === "Critical" && (
                                <span className="font-bold text-rose-700 text-[10px] border border-rose-400 bg-rose-100 px-1.5 py-0.2 rounded">
                                  CRITICAL ALERT
                                </span>
                              )}
                              {param.flag === "High" && (
                                <span className="font-bold text-amber-800 text-[10px]">
                                  HIGH ▲
                                </span>
                              )}
                              {param.flag === "Low" && (
                                <span className="font-bold text-sky-800 text-[10px]">
                                  LOW ▼
                                </span>
                              )}
                              {param.flag === "Normal" && (
                                <span className="text-slate-400 text-[10px]">
                                  Normal
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* 4. Clinical Remarks / Notes */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block mb-1">
              Pathologist Comments & Clinical Interpretation:
            </span>
            <p className="text-slate-700 italic">
              {order.clinicalNotes ||
                "Clinical correlation advised. Critical values (if any) have been immediately communicated to the attending consultant. Repeat testing suggested after 48-72 hours if clinically warranted."}
            </p>
          </div>

          {/* 5. Dual Electronic Digital Signatures */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-3 items-end text-xs">
            {/* Technologist */}
            <div>
              <div className="font-serif italic text-teal-800 text-sm font-bold">
                Priya M.
              </div>
              <div className="border-t border-slate-400 pt-1 mt-1 font-bold text-slate-900">
                Priya M., M.Sc MLT
              </div>
              <div className="text-[10px] text-slate-500">
                Senior Medical Lab Technologist
              </div>
            </div>

            {/* QR Code Verification */}
            <div className="text-center">
              <div className="w-16 h-16 border border-slate-300 rounded-lg mx-auto flex items-center justify-center p-1 bg-white">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-1">
                Scan to Verify Online
              </div>
            </div>

            {/* Pathologist */}
            <div className="text-right">
              <div className="font-serif italic text-teal-900 text-base font-bold">
                Dr. Bhargav
              </div>
              <div className="border-t border-slate-400 pt-1 mt-1 font-bold text-slate-900">
                Dr. Bhargav, MD (Pathology)
              </div>
              <div className="text-[10px] text-slate-500">
                Chief Medical Officer & Consultant Pathologist
              </div>
              <div className="text-[9px] text-slate-400 font-mono">
                Reg No: KMC-58291
              </div>
            </div>
          </div>

          {/* 6. Legal & Quality Disclaimer */}
          <div className="border-t border-slate-100 pt-3 text-center text-[9px] text-slate-400">
            *** End of Diagnostic Investigation Report • CarePulse Central Clinical Laboratory ***
            <br />
            This report is authenticated electronically and requires no physical ink signature. For queries, contact laboratory@carepulse.hospital
          </div>
        </div>
      </div>
    </div>
  );
};
