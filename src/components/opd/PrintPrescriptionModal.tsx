"use client";

import React from "react";
import { X, Printer, Activity, Stethoscope } from "lucide-react";
import { ConsultationEncounter } from "@/types";

interface PrintPrescriptionModalProps {
  encounter: ConsultationEncounter | null;
  onClose: () => void;
}

export const PrintPrescriptionModal: React.FC<PrintPrescriptionModalProps> = ({
  encounter,
  onClose,
}) => {
  if (!encounter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Controls (Hidden in print) */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800">
              Print Preview • Official Medical Prescription Letterhead
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Prescription
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="print-container p-8 sm:p-10 font-sans text-slate-900 bg-white">
          {/* Hospital Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-teal-700" />
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  CarePulse Multispecialty Hospital
                </h1>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Department of {encounter.department} • OPD Clinic Suite
              </p>
              <p className="text-[10px] text-slate-500">
                Plot 42, Healthcare City, Jubilee Hills, Hyderabad • Ph: +91 040 2345 6789
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900 text-sm">{encounter.doctor}</p>
              <p className="text-[10px] text-slate-500">MD, DM (Gold Medalist)</p>
              <p className="text-[10px] font-mono font-bold text-teal-800 mt-0.5">{encounter.opNo}</p>
            </div>
          </div>

          {/* Patient Demographics & Vitals */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 mb-5 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Patient Name</span>
                <span className="font-bold text-slate-900">{encounter.patientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">MR Number</span>
                <span className="font-mono font-bold text-slate-900">{encounter.mrId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Age / Gender</span>
                <span className="font-medium text-slate-800">{encounter.age} Y / {encounter.gender}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Encounter Date</span>
                <span className="font-medium text-slate-800">{encounter.date}</span>
              </div>
            </div>

            {/* Vitals */}
            <div className="mt-2.5 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-4 text-[11px] text-slate-700">
              <span><strong>BP:</strong> {encounter.vitals.bp} mmHg</span>
              <span><strong>Pulse:</strong> {encounter.vitals.pulse} bpm</span>
              <span><strong>Temp:</strong> {encounter.vitals.temp} °F</span>
              <span><strong>SpO2:</strong> {encounter.vitals.spo2}%</span>
              <span><strong>Weight:</strong> {encounter.vitals.weight} kg</span>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div className="mb-5 text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Clinical Diagnosis:</div>
            <div className="font-bold text-slate-900 bg-teal-50/50 p-2 rounded border border-teal-200/50">
              {encounter.diagnosis}
            </div>
            {encounter.chiefComplaints && (
              <p className="text-[11px] text-slate-600 mt-1 italic">
                Complaints: {encounter.chiefComplaints}
              </p>
            )}
          </div>

          {/* Rx Prescription Table */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-serif italic text-xl font-bold text-slate-900">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Prescription Medications:
              </span>
            </div>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Medicine Name</th>
                  <th className="py-2 px-3">Dosage</th>
                  <th className="py-2 px-3">Frequency</th>
                  <th className="py-2 px-3">Duration</th>
                  <th className="py-2 px-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {encounter.medicines.map((med, idx) => (
                  <tr key={med.id}>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{med.medicine}</td>
                    <td className="py-2 px-3 text-slate-700">{med.dosage}</td>
                    <td className="py-2 px-3 font-bold text-teal-800">{med.frequency}</td>
                    <td className="py-2 px-3 text-slate-700">{med.duration}</td>
                    <td className="py-2 px-3 text-slate-600 italic">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lab Investigations Ordered */}
          {encounter.labOrders.length > 0 && (
            <div className="mb-6 bg-slate-50 p-3 rounded border border-slate-300 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                Laboratory Investigations Advised:
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {encounter.labOrders.map((test, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-300 rounded font-semibold text-slate-800">
                    {test}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Note & Doctor Sign */}
          <div className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between text-xs">
            <div>
              <p className="font-bold text-slate-800">
                Next Review: After {encounter.followUpDays} days ({encounter.followUpDays <= 7 ? "Free Revisit Applicable" : "Routine Consultation"})
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Emergency: In case of acute chest discomfort or breathlessness, visit ER immediately.
              </p>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-900 mb-1"></div>
              <p className="font-bold text-slate-900">{encounter.doctor}</p>
              <p className="text-[10px] text-slate-500">Authorized Medical Practitioner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
