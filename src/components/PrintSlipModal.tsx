"use client";

import React, { useState, useEffect } from "react";
import { X, Printer, Activity, QrCode } from "lucide-react";
import { Patient } from "@/types";
import { generateQrCodeDataUrl, createPatientQrPayload } from "@/lib/qrService";

interface PrintSlipModalProps {
  patient: Patient | null;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  patient,
  onClose,
}) => {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (patient) {
      const uhid = patient.uhid || patient.mrId;
      const payload = createPatientQrPayload({
        uhid: uhid,
        tenantCode: "APEX",
      });
      generateQrCodeDataUrl(payload).then((url) => setQrUrl(url));
    }
  }, [patient]);

  if (!patient) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-800">
              Print Preview • Official Hospital Document
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Document
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (print-container) */}
        <div className="print-container p-8 sm:p-10 font-sans text-slate-900 bg-white">
          {/* Hospital Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-teal-600" />
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  VitalSync Multispecialty Hospital
                </h1>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Plot 42, Healthcare City, Jubilee Hills, Hyderabad - 500033
              </p>
              <p className="text-[10px] text-slate-500">
                Ph: +91 040 2345 6789 • Emergency Helpline: 108 • Reg No: AP/HYD/MED/2026/094
              </p>
            </div>
            <div className="flex items-center gap-3">
              {qrUrl && (
                <div className="border border-slate-300 p-1 rounded-lg bg-white shrink-0">
                  <img src={qrUrl} alt="Patient QR Code" className="w-16 h-16 object-contain" />
                </div>
              )}
              <div className="text-right">
                <span className="inline-block border border-slate-900 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider">
                  OPD Slip
                </span>
                <p className="font-mono text-xs font-bold text-slate-800 mt-1">
                  {patient.opIpId}
                </p>
                <p className="font-mono text-[10px] text-slate-500 font-bold">
                  {patient.uhid || patient.mrId}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 mb-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">MR Number</span>
                <span className="font-mono font-bold text-slate-900">{patient.mrId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient Name</span>
                <span className="font-bold text-slate-900">{patient.name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Age / Gender</span>
                <span className="font-medium text-slate-800">{patient.age} Y / {patient.gender === "M" ? "Male" : "Female"}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Contact Phone</span>
                <span className="font-medium text-slate-800">{patient.phone}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Department</span>
                <span className="font-semibold text-slate-900">{patient.department}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Consultant Doctor</span>
                <span className="font-semibold text-slate-900">{patient.attendingDoctor}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Visit Date</span>
                <span className="font-medium text-slate-800">{patient.admissionDate}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Consultation Fee</span>
                <span className="font-bold text-teal-700">₹{patient.billAmount || 500} (Paid)</span>
              </div>
            </div>
          </div>

          {/* Doctor Clinical Notes Blank Section */}
          <div className="border border-slate-300 rounded-lg p-5 min-h-[300px] mb-8 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4 text-xs font-bold text-slate-700">
              <span className="text-lg font-serif italic font-bold">℞ Clinical Evaluation & Prescription:</span>
              <span className="text-[10px] font-normal text-slate-400">Vitals: BP: ____/____ | Pulse: ____ | Temp: ____ | SpO2: ____%</span>
            </div>

            <div className="space-y-6 pt-4 text-slate-400 text-xs font-light">
              <p>Diagnosis: {patient.diagnosis || "________________________________________________"}</p>
              <div className="h-44"></div>
            </div>

            {/* Doctor Signature line */}
            <div className="absolute bottom-4 right-6 text-right">
              <div className="w-40 border-b border-slate-900 mb-1"></div>
              <p className="text-[11px] font-bold text-slate-900">{patient.attendingDoctor}</p>
              <p className="text-[10px] text-slate-500">Authorized Medical Officer</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400">
            <span>Valid for 7 days consultation revisit. Please bring this slip on next visit.</span>
            <span>Computer Generated Slip • VitalSync HMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
