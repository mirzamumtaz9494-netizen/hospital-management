"use client";

import React, { useState } from "react";
import {
  X,
  BedDouble,
  Building,
  CreditCard,
  UserCheck,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import { Patient } from "@/types";

interface CreateIpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPatient: Patient) => void;
  initialPatient?: Patient | null;
}

export const CreateIpModal: React.FC<CreateIpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPatient,
}) => {
  const [formData, setFormData] = useState({
    name: initialPatient?.name || "",
    age: initialPatient ? String(initialPatient.age) : "45",
    gender: (initialPatient?.gender || "M") as "M" | "F" | "Other",
    phone: initialPatient?.phone || "",
    department: initialPatient?.department || "General Surgery",
    attendingDoctor: initialPatient?.attendingDoctor || "Dr. A. Rao",
    wardName: "General Ward",
    bedNumber: "GEN-14",
    diagnosis: initialPatient?.diagnosis || "Acute Abdomen - Observation & Surgery",
    advancePaid: 10000,
    paymentMode: "UPI",
    isCritical: false,
  });

  if (!isOpen) return null;

  const wardsData = [
    { name: "ICU Ward", beds: ["ICU-02", "ICU-05", "ICU-06"] },
    { name: "General Ward", beds: ["GEN-14", "GEN-18", "GEN-22"] },
    { name: "Special Private Ward", beds: ["SP-03", "SP-07", "SP-09"] },
    { name: "Maternity Ward", beds: ["MAT-04", "MAT-08"] },
    { name: "Cardiac Care Unit (CCU)", beds: ["CCU-01", "CCU-03"] },
  ];

  const handleWardChange = (ward: string) => {
    const w = wardsData.find((item) => item.name === ward);
    setFormData((prev) => ({
      ...prev,
      wardName: ward,
      bedNumber: w?.beds[0] || "BED-01",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide the Patient Name and Phone number.");
      return;
    }

    const randomMrNum = initialPatient?.mrId
      ? initialPatient.mrId
      : `MR-${Math.floor(10260 + Math.random() * 800)}`;
    const ipId = `IP-${Math.floor(22045 + Math.random() * 800)}`;

    const initials = formData.name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const admittedPatient: Patient = {
      id: initialPatient ? initialPatient.id : String(Date.now()),
      mrId: randomMrNum,
      opIpId: ipId,
      type: "IP",
      name: formData.name,
      initials: initials || "IP",
      age: parseInt(formData.age, 10) || 45,
      gender: formData.gender,
      phone: formData.phone,
      department: formData.department,
      attendingDoctor: formData.attendingDoctor,
      admissionDate: "12 Oct 2026",
      status: formData.isCritical ? "Critical" : "Active",
      wardName: formData.wardName,
      bedNumber: formData.bedNumber,
      diagnosis: formData.diagnosis,
      billAmount: formData.advancePaid + 15000,
      advancePaid: formData.advancePaid,
    };

    onSuccess(admittedPatient);
    onClose();
  };

  const selectedWardObj = wardsData.find((w) => w.name === formData.wardName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inpatient (IP) Admission Desk
              </h3>
              <p className="text-xs text-slate-500">
                Assign ward, allocate bed & record advance admission deposit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Section 1: Patient Details */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              1. Patient Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Venkatesh Rao"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9988776655"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as "M" | "F" | "Other" })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Critical Triage</label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="critical_check"
                    checked={formData.isCritical}
                    onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="critical_check" className="text-rose-600 font-semibold cursor-pointer">
                    Flag as Critical ICU
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Ward & Bed Allocation */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              2. Ward & Bed Allocation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Select Ward
                </label>
                <select
                  value={formData.wardName}
                  onChange={(e) => handleWardChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {wardsData.map((w) => (
                    <option key={w.name} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Available Bed
                </label>
                <select
                  value={formData.bedNumber}
                  onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {(selectedWardObj?.beds || []).map((bed) => (
                    <option key={bed} value={bed}>
                      {bed} (Vacant & Ready)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Clinical & Advance Billing */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              3. Clinical Assignment & Advance Deposit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Attending Doctor
                </label>
                <select
                  value={formData.attendingDoctor}
                  onChange={(e) =>
                    setFormData({ ...formData, attendingDoctor: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Dr. S. Reddy">Dr. S. Reddy (Cardiology)</option>
                  <option value="Dr. A. Rao">Dr. A. Rao (Orthopedics/Surgery)</option>
                  <option value="Dr. K. Sharma">Dr. K. Sharma (Medicine)</option>
                  <option value="Dr. P. Nair">Dr. P. Nair (Obstetrics)</option>
                  <option value="Dr. V. Menon">Dr. V. Menon (Neurology)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Advance Deposit (₹)
                </label>
                <input
                  type="number"
                  value={formData.advancePaid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      advancePaid: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Payment Mode
                </label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMode: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="UPI">UPI / Bank Transfer</option>
                  <option value="Cash">Cash at Billing Desk</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="TPA">Insurance / TPA Cashless</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-medium mb-1">
                  Provisional Diagnosis / Reason for Admission
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="e.g. Acute Appendicitis, Planned Laparoscopic Surgery"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-slate-500 text-xs">
              Deposit:{" "}
              <span className="font-bold text-slate-900 text-sm">
                ₹{formData.advancePaid.toLocaleString()}
              </span>{" "}
              ({formData.paymentMode})
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-sm hover:shadow"
              >
                <BedDouble className="w-4 h-4" />
                Confirm IP Admission
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
