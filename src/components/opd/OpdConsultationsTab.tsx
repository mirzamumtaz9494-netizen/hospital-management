"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Plus,
  Trash2,
  Printer,
  CheckCircle,
  Clock,
  User,
  FlaskConical,
  FileText,
  AlertCircle,
  BedDouble,
  ChevronDown,
} from "lucide-react";
import { ConsultationEncounter, PrescriptionMedicine, OpQueueItem, Patient } from "@/types";
import { MOCK_CONSULTATION_ENCOUNTER } from "@/data/opdMockData";

interface OpdConsultationsTabProps {
  queue: OpQueueItem[];
  onCompleteConsultation: (encounter: ConsultationEncounter) => void;
  onPrintPrescription: (encounter: ConsultationEncounter) => void;
  onAdmitToIp: (patient: Patient) => void;
}

export const OpdConsultationsTab: React.FC<OpdConsultationsTabProps> = ({
  queue,
  onCompleteConsultation,
  onPrintPrescription,
  onAdmitToIp,
}) => {
  const [encounter, setEncounter] = useState<ConsultationEncounter>(MOCK_CONSULTATION_ENCOUNTER);
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. S. Reddy");

  // New medicine row input
  const [newMed, setNewMed] = useState<PrescriptionMedicine>({
    id: "",
    medicine: "",
    dosage: "1 Tab",
    frequency: "1-0-1",
    duration: "10 Days",
    instructions: "After meals",
  });

  const availableLabTests = [
    "Lipid Profile (Fast)",
    "2D Echocardiography",
    "Serum Creatinine",
    "HbA1c",
    "Complete Blood Picture (CBP)",
    "12-Lead ECG",
    "Chest X-Ray PA",
    "Random Blood Sugar (RBS)",
    "Thyroid Profile (T3, T4, TSH)",
    "Urine Routine & Micro",
  ];

  const handleAddMedicine = () => {
    if (!newMed.medicine.trim()) return;
    setEncounter((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { ...newMed, id: `med-${Date.now()}` },
      ],
    }));
    setNewMed({
      id: "",
      medicine: "",
      dosage: "1 Tab",
      frequency: "1-0-1",
      duration: "10 Days",
      instructions: "After meals",
    });
  };

  const handleRemoveMedicine = (id: string) => {
    setEncounter((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((m) => m.id !== id),
    }));
  };

  const toggleLabTest = (test: string) => {
    setEncounter((prev) => {
      const exists = prev.labOrders.includes(test);
      return {
        ...prev,
        labOrders: exists
          ? prev.labOrders.filter((t) => t !== test)
          : [...prev.labOrders, test],
      };
    });
  };

  // Patients waiting for selected doctor
  const waitingForDoc = queue.filter(
    (q) => q.doctor === selectedDoctor && q.status === "Waiting"
  );

  return (
    <div className="space-y-5">
      {/* Top Banner: Doctor Consultation Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Stethoscope className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Doctor Consultation Workspace
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Cabin Active • Room 102
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clinical encounter notes, vital signs, digital e-prescription & diagnostic ordering
            </p>
          </div>
        </div>

        {/* Doctor Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Attending Specialist:</span>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="Dr. S. Reddy">Dr. S. Reddy (Cardiology)</option>
            <option value="Dr. K. Sharma">Dr. K. Sharma (General Medicine)</option>
            <option value="Dr. A. Rao">Dr. A. Rao (Orthopedics)</option>
            <option value="Dr. P. Nair">Dr. P. Nair (Gynecology)</option>
            <option value="Dr. M. Iyer">Dr. M. Iyer (Pediatrics)</option>
            <option value="Dr. V. Menon">Dr. V. Menon (Neurology)</option>
          </select>
        </div>
      </div>

      {/* Main Consultation Desk Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        {/* Left 3 cols: Active Clinical Case File */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-5 space-y-6">
          {/* Active Patient Details Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200 text-sm">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">
                    {encounter.patientName}
                  </span>
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                    {encounter.opNo}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {encounter.mrId}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {encounter.age} Yrs / {encounter.gender === "M" ? "Male" : "Female"} • {encounter.department} • Token A-017
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onAdmitToIp({
                    id: encounter.patientId,
                    mrId: encounter.mrId,
                    opIpId: encounter.opNo,
                    type: "OP",
                    name: encounter.patientName,
                    initials: "RK",
                    age: encounter.age,
                    gender: encounter.gender,
                    phone: "9848022334",
                    department: encounter.department,
                    attendingDoctor: encounter.doctor,
                    admissionDate: encounter.date,
                    status: "Active",
                    diagnosis: encounter.diagnosis,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition"
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Admit to Inpatient (IPD)</span>
              </button>
            </div>
          </div>

          {/* Vitals Recording Strip */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Patient Vital Signs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Blood Pressure</span>
                <input
                  type="text"
                  value={encounter.vitals.bp}
                  onChange={(e) =>
                    setEncounter({
                      ...encounter,
                      vitals: { ...encounter.vitals, bp: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 text-xs mt-1"
                />
                <span className="text-[10px] text-slate-400">mmHg</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Pulse Rate</span>
                <input
                  type="text"
                  value={encounter.vitals.pulse}
                  onChange={(e) =>
                    setEncounter({
                      ...encounter,
                      vitals: { ...encounter.vitals, pulse: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 text-xs mt-1"
                />
                <span className="text-[10px] text-slate-400">bpm</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Temperature</span>
                <input
                  type="text"
                  value={encounter.vitals.temp}
                  onChange={(e) =>
                    setEncounter({
                      ...encounter,
                      vitals: { ...encounter.vitals, temp: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 text-xs mt-1"
                />
                <span className="text-[10px] text-slate-400">°F</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Oxygen (SpO2)</span>
                <input
                  type="text"
                  value={encounter.vitals.spo2}
                  onChange={(e) =>
                    setEncounter({
                      ...encounter,
                      vitals: { ...encounter.vitals, spo2: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 text-xs mt-1"
                />
                <span className="text-[10px] text-slate-400">% on Room Air</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Weight</span>
                <input
                  type="text"
                  value={encounter.vitals.weight}
                  onChange={(e) =>
                    setEncounter({
                      ...encounter,
                      vitals: { ...encounter.vitals, weight: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 text-xs mt-1"
                />
                <span className="text-[10px] text-slate-400">kg</span>
              </div>
            </div>
          </div>

          {/* Chief Complaints & Clinical Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Chief Complaints & Symptoms
              </label>
              <textarea
                rows={3}
                value={encounter.chiefComplaints}
                onChange={(e) =>
                  setEncounter({ ...encounter, chiefComplaints: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Provisional Diagnosis & Findings
              </label>
              <textarea
                rows={3}
                value={encounter.diagnosis}
                onChange={(e) =>
                  setEncounter({ ...encounter, diagnosis: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* Rx Prescription Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="font-serif italic text-base text-teal-800 font-bold">℞</span>
                Prescription Medications ({encounter.medicines.length})
              </h3>
            </div>

            {/* Existing medicines list */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Medicine Name</th>
                    <th className="py-2 px-3">Dosage</th>
                    <th className="py-2 px-3">Frequency</th>
                    <th className="py-2 px-3">Duration</th>
                    <th className="py-2 px-3">Instructions</th>
                    <th className="py-2 px-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {encounter.medicines.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{med.medicine}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{med.dosage}</td>
                      <td className="py-2.5 px-3 text-teal-800 font-bold">{med.frequency}</td>
                      <td className="py-2.5 px-3 text-slate-700">{med.duration}</td>
                      <td className="py-2.5 px-3 text-slate-500 italic">{med.instructions}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleRemoveMedicine(med.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add medicine row input */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="Medicine Name (e.g. Tab. Pan 40mg)"
                value={newMed.medicine}
                onChange={(e) => setNewMed({ ...newMed, medicine: e.target.value })}
                className="flex-1 min-w-[160px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
              />
              <input
                type="text"
                placeholder="Dosage (1 Tab)"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="w-24 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
              <select
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium"
              >
                <option value="1-0-0">1-0-0 (Morning)</option>
                <option value="1-0-1">1-0-1 (Morning & Night)</option>
                <option value="1-1-1">1-1-1 (TID)</option>
                <option value="0-0-1">0-0-1 (Bedtime)</option>
                <option value="SOS">SOS (When needed)</option>
              </select>
              <input
                type="text"
                placeholder="Duration (e.g. 5 Days)"
                value={newMed.duration}
                onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                className="w-24 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
              <input
                type="text"
                placeholder="Instructions (After food)"
                value={newMed.instructions}
                onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                className="flex-1 min-w-[120px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
              <button
                type="button"
                onClick={handleAddMedicine}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-lg shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Diagnostic & Laboratory Orders */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
              Prescribe Diagnostic & Laboratory Tests
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableLabTests.map((test) => {
                const isSelected = encounter.labOrders.includes(test);
                return (
                  <button
                    key={test}
                    type="button"
                    onClick={() => toggleLabTest(test)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? "bg-teal-800 text-white border-teal-800 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {test}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Next Follow-up:</span>
              <select
                value={encounter.followUpDays}
                onChange={(e) =>
                  setEncounter({
                    ...encounter,
                    followUpDays: parseInt(e.target.value, 10),
                  })
                }
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800"
              >
                <option value={7}>After 7 Days (Free Revisit)</option>
                <option value={14}>After 14 Days</option>
                <option value={30}>After 1 Month</option>
                <option value={0}>No Follow-up Required</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPrintPrescription(encounter)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs transition shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-teal-700" />
                Print Prescription Letterhead
              </button>
              <button
                type="button"
                onClick={() => onCompleteConsultation(encounter)}
                className="flex items-center gap-1.5 px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Complete Consultation
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 col: Waiting Queue for this doctor */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Next in Queue
              </h3>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {waitingForDoc.length} Waiting
              </span>
            </div>

            {waitingForDoc.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No patients currently waiting for {selectedDoctor}.
              </p>
            ) : (
              <div className="space-y-2.5 text-xs">
                {waitingForDoc.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 transition cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setEncounter({
                        ...encounter,
                        patientId: p.id,
                        patientName: p.name,
                        mrId: p.mrId,
                        opNo: p.token,
                        age: p.age,
                        gender: p.gender,
                        chiefComplaints: "General OPD consultation & clinical review.",
                        diagnosis: "Clinical evaluation pending.",
                      });
                    }}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-500">
                        Token {p.token} • {p.age}/{p.gender}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                      Load Case
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-2">
              Recent Encounters
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: "Kavya Reddy", token: "B-008", time: "09:05 AM", diag: "Viral Fever" },
                { name: "Anita Desai", token: "D-011", time: "08:55 AM", diag: "Antenatal Checkup" },
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-500">{item.diag} • {item.token}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
