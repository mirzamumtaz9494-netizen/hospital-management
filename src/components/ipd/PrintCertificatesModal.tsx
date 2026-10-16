"use client";

import React, { useState } from "react";
import { X, Printer, Activity, FileText, CheckCircle2, Award, AlertOctagon, HeartCrack, Baby, FileCheck } from "lucide-react";
import { ActiveAdmission, DischargedPatient } from "@/types";

interface PrintCertificatesModalProps {
  patient: ActiveAdmission | DischargedPatient | null;
  initialCert?: string;
  onClose: () => void;
}

export const PrintCertificatesModal: React.FC<PrintCertificatesModalProps> = ({
  patient,
  initialCert = "Discharge Summary",
  onClose,
}) => {
  const [activeCert, setActiveCert] = useState(initialCert);

  if (!patient) return null;

  const certificatesList = [
    { id: "Discharge Summary", icon: FileText },
    { id: "Final Consolidated Bill", icon: FileCheck },
    { id: "Emergency Certificate", icon: AlertOctagon },
    { id: "Medical Certificate", icon: Award },
    { id: "Essentiality Certificate", icon: CheckCircle2 },
    { id: "LAMA Certificate", icon: AlertOctagon },
    { id: "Death Certificate", icon: HeartCrack },
    { id: "Birth Certificate", icon: Baby },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[94vh] overflow-hidden flex flex-col">
        {/* Controls Bar (Hidden in Print) */}
        <div className="no-print p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-800" />
            <span className="text-xs font-bold text-slate-800">
              Official Hospital Certificates & Medical Documents
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Switcher Tabs (Hidden in Print) */}
        <div className="no-print bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          {certificatesList.map((c) => {
            const Icon = c.icon;
            const isSelected = activeCert === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCert(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  isSelected
                    ? "bg-teal-800 text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.id}</span>
              </button>
            );
          })}
        </div>

        {/* Printable Certificate Sheet (print-container) */}
        <div className="print-container flex-1 p-8 sm:p-12 overflow-y-auto font-sans text-slate-900 bg-white text-xs">
          {/* Hospital Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-teal-800" />
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  VitalSync Multispecialty Hospital
                </h1>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Accredited Tertiary Care & Trauma Center • Reg No: AP/HYD/MED/2026/094
              </p>
              <p className="text-[10px] text-slate-500">
                Plot 42, Healthcare City, Jubilee Hills, Hyderabad • Ph: +91 040 2345 6789
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block border border-slate-900 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
                {activeCert}
              </span>
              <p className="font-mono text-xs font-bold text-slate-900 mt-1">{patient.ipNo}</p>
              <p className="font-mono text-[10px] text-slate-500">{patient.mrId}</p>
            </div>
          </div>

          {/* Patient Details Header */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 mb-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Patient Name:</span>
                <span className="font-bold text-slate-900">{patient.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Age / Gender:</span>
                <span className="font-medium text-slate-800">{patient.age} Yrs / {patient.gender === "M" ? "Male" : "Female"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Attending Doctor:</span>
                <span className="font-semibold text-slate-900">{patient.attendingDoctor}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Admitted Date:</span>
                <span className="font-mono text-slate-800">
                  {"admittedOn" in patient ? patient.admittedOn : patient.admittedDate}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CERTIFICATE 1: DISCHARGE SUMMARY */}
          {/* ========================================================================= */}
          {activeCert === "Discharge Summary" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold uppercase tracking-wider text-slate-700 text-xs mb-1">
                  Final Clinical Diagnosis:
                </h3>
                <div className="p-2.5 bg-teal-50/50 border border-teal-200/60 rounded font-bold text-slate-900">
                  {patient.diagnosis}
                </div>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-slate-700 text-xs mb-1">
                  Treatment / Surgery Performed:
                </h3>
                <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed">
                  Patient was admitted with acute complaints. Successfully stabilized under intensive monitoring.
                  Medical management and surgical intervention performed under aseptic precautions. Vitals stable throughout stay.
                </p>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-slate-700 text-xs mb-1">
                  Condition at Discharge & Advice:
                </h3>
                <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed">
                  {"dischargeNotes" in patient
                    ? patient.dischargeNotes
                    : "Hemodynamically stable. Afebrile. Surgical wound healthy. Tolerating oral feeds well. Suture removal advised after 7 days."}
                </p>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-slate-700 text-xs mb-1">
                  Medications Prescribed on Discharge:
                </h3>
                <table className="w-full text-left border border-slate-300 text-xs">
                  <thead className="bg-slate-100 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="py-1.5 px-3">Medicine</th>
                      <th className="py-1.5 px-3">Dosage & Frequency</th>
                      <th className="py-1.5 px-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-2 px-3 font-semibold">Tab. Amoxicillin + Clavulanic Acid 625mg</td>
                      <td className="py-2 px-3">1 Tab - Twice daily after meals</td>
                      <td className="py-2 px-3">5 Days</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold">Tab. Pantoprazole 40mg</td>
                      <td className="py-2 px-3">1 Tab - Once daily before breakfast</td>
                      <td className="py-2 px-3">10 Days</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold">Tab. Paracetamol 650mg</td>
                      <td className="py-2 px-3">1 Tab - SOS (In case of fever/pain)</td>
                      <td className="py-2 px-3">5 Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CERTIFICATE 2: FINAL CONSOLIDATED BILL */}
          {/* ========================================================================= */}
          {activeCert === "Final Consolidated Bill" && (
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-slate-700 text-xs mb-1">
                Itemized Inpatient Charges Summary:
              </h3>
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead className="bg-slate-100 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Particulars / Departments</th>
                    <th className="py-2 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3">Room / Bed & Nursing Charges</td>
                    <td className="py-2 px-3 text-right font-mono">₹24,000.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Surgeon, Anesthetist & OT Charges</td>
                    <td className="py-2 px-3 text-right font-mono">₹45,000.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Doctor Inpatient Rounds & Specialist Consultations</td>
                    <td className="py-2 px-3 text-right font-mono">₹12,000.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Diagnostic Pathology & Radiology Investigations</td>
                    <td className="py-2 px-3 text-right font-mono">₹14,500.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Pharmacy Drugs & Surgical Consumables</td>
                    <td className="py-2 px-3 text-right font-mono">₹18,500.00</td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-slate-900 bg-slate-50 font-bold text-xs">
                  <tr>
                    <td className="py-2 px-3 text-right">Gross Invoiced Total:</td>
                    <td className="py-2 px-3 text-right font-mono">
                      ₹{("finalBill" in patient ? patient.finalBill : patient.billSoFar).toLocaleString()}.00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-3 text-right text-emerald-800">Less Advance Deposit Deducted:</td>
                    <td className="py-1 px-3 text-right font-mono text-emerald-800">
                      -₹{patient.advancePaid.toLocaleString()}.00
                    </td>
                  </tr>
                  <tr className="text-sm">
                    <td className="py-2 px-3 text-right">Net Settlement Balance:</td>
                    <td className="py-2 px-3 text-right font-mono text-teal-900">
                      ₹{Math.max(0, ("finalBill" in patient ? patient.finalBill : patient.billSoFar) - patient.advancePaid).toLocaleString()}.00
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CERTIFICATE 3: EMERGENCY CERTIFICATE */}
          {/* ========================================================================= */}
          {activeCert === "Emergency Certificate" && (
            <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-800">
              <p>
                This is to officially certify that <strong>{patient.name}</strong>, aged <strong>{patient.age}</strong> years, 
                was admitted into our Emergency / Intensive Care Department on an urgent emergency triage basis.
              </p>
              <p>
                <strong>Provisional Emergency Diagnosis:</strong> {patient.diagnosis}.
              </p>
              <p>
                Immediate life-saving emergency medical resuscitation, monitoring, and intravenous therapy were rendered. 
                This certificate is issued on medical grounds for official records / leave / insurance documentation.
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CERTIFICATE 4: MEDICAL / FITNESS CERTIFICATE */}
          {/* ========================================================================= */}
          {activeCert === "Medical Certificate" && (
            <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-800">
              <p>
                I, <strong>{patient.attendingDoctor}</strong>, after careful personal examination, hereby certify that 
                <strong> {patient.name}</strong> has been suffering from <strong>{patient.diagnosis}</strong> and was advised 
                inpatient hospitalization from{" "}
                <strong>{"admittedOn" in patient ? patient.admittedOn : patient.admittedDate}</strong>.
              </p>
              <p>
                The patient is advised rest for further period of <strong>7 (Seven) days</strong> for full recuperation and will 
                be fit to resume duty / normal activities thereafter.
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CERTIFICATE 5: ESSENTIALITY CERTIFICATE */}
          {/* ========================================================================= */}
          {activeCert === "Essentiality Certificate" && (
            <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-800">
              <p>
                Certified that <strong>{patient.name}</strong> was treated in this hospital as an inpatient for 
                <strong> {patient.diagnosis}</strong>.
              </p>
              <p>
                The medicines and investigations prescribed were absolutely essential for the recovery of the patient and did not 
                include any non-essential food supplements, tonics, or toiletries. The charges billed are in strict accordance with 
                approved hospital tariffs.
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CERTIFICATE 6: LAMA CERTIFICATE */}
          {/* ========================================================================= */}
          {activeCert === "LAMA Certificate" && (
            <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-800">
              <div className="p-3 bg-amber-50 border border-amber-300 rounded font-bold text-amber-900">
                NOTICE: LEFT AGAINST MEDICAL ADVICE (LAMA)
              </div>
              <p>
                I, the undersigned patient / guardian of <strong>{patient.name}</strong>, hereby declare that I am leaving 
                VitalSync Multispecialty Hospital at my own risk and against the advice of attending doctor{" "}
                <strong>{patient.attendingDoctor}</strong>.
              </p>
              <p>
                The medical risks, complications, and consequences of premature discharge have been fully explained to me. 
                The hospital and attending physicians are exonerated from all liabilities arising therefrom.
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CERTIFICATE 7: DEATH CERTIFICATE */}
          {/* ========================================================================= */}
          {activeCert === "Death Certificate" && (
            <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-800">
              <p>
                Certified that <strong>{patient.name}</strong>, aged <strong>{patient.age}</strong> years, 
                bearing IP No <strong>{patient.ipNo}</strong>, expired in this hospital.
              </p>
              <p><strong>Primary Cause of Death:</strong> Cardiorespiratory arrest due to {patient.diagnosis}.</p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CERTIFICATE 8: BIRTH CERTIFICATE */}
          {/* ========================================================================= */}
          {activeCert === "Birth Certificate" && (
            <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-800">
              <p>
                This is to certify that a healthy live child was born to mother <strong>{patient.name}</strong> in the Obstetrics 
                Delivery Suite of VitalSync Multispecialty Hospital.
              </p>
              <p><strong>Attending Obstetrician:</strong> {patient.attendingDoctor}</p>
            </div>
          )}

          {/* Doctor Signature & Hospital Seal */}
          <div className="mt-12 pt-6 border-t border-slate-300 flex items-end justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400">Document Generated: 12 Oct 2026 • VitalSync HMS</p>
              <p className="text-[10px] text-slate-400">Authenticated via Secure Medical Hash</p>
            </div>
            <div className="text-right">
              <div className="w-40 border-b border-slate-900 mb-1"></div>
              <p className="font-bold text-slate-900">{patient.attendingDoctor}</p>
              <p className="text-[10px] text-slate-500">Authorized Medical Superintendent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
