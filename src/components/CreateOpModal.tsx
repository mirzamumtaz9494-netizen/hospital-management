"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Search,
  Stethoscope,
  Printer,
  CreditCard,
  Building,
  CheckCircle2,
} from "lucide-react";
import { Patient } from "@/types";

interface CreateOpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPatient: Patient) => void;
}

export const CreateOpModal: React.FC<CreateOpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [patientType, setPatientType] = useState<"new" | "existing">("new");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "M" as "M" | "F" | "Other",
    phone: "",
    bloodGroup: "O+",
    department: "General Medicine",
    attendingDoctor: "Dr. K. Sharma",
    visitType: "New" as "New" | "Follow-up",
    consultationFee: 500,
    paymentMode: "UPI",
    notes: "",
  });

  if (!isOpen) return null;

  const doctorListByDept: Record<string, string[]> = {
    "General Medicine": ["Dr. K. Sharma", "Dr. A. Rao"],
    Cardiology: ["Dr. S. Reddy", "Dr. V. Menon"],
    Orthopedics: ["Dr. A. Rao"],
    Gynecology: ["Dr. P. Nair"],
    Pediatrics: ["Dr. M. Iyer"],
    Neurology: ["Dr. V. Menon"],
  };

  const handleDepartmentChange = (dept: string) => {
    const docs = doctorListByDept[dept] || ["Dr. K. Sharma"];
    setFormData((prev) => ({
      ...prev,
      department: dept,
      attendingDoctor: docs[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide the Patient's Full Name and Mobile Number.");
      return;
    }

    // Generate random realistic IDs
    const randomMrNum = Math.floor(10250 + Math.random() * 900);
    const randomOpNum = Math.floor(40120 + Math.random() * 900);
    const mrId = `MR-${randomMrNum}`;
    const opIpId = `OP-${randomOpNum}`;

    const initials = formData.name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newPatient: Patient = {
      id: String(Date.now()),
      mrId,
      opIpId,
      type: "OP",
      name: formData.name,
      initials: initials || "PT",
      age: parseInt(formData.age, 10) || 30,
      gender: formData.gender,
      phone: formData.phone,
      department: formData.department,
      attendingDoctor: formData.attendingDoctor,
      admissionDate: "12 Oct 2026",
      status: "Active",
      billAmount: formData.consultationFee,
      diagnosis: formData.notes || "Initial Consultation & Clinical Triage",
    };

    onSuccess(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                New Outpatient (OP) Registration
              </h3>
              <p className="text-xs text-slate-500">
                Generate OPD consultation token, doctor ticket & fee receipt
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
          {/* Patient Type Segmented Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/70 max-w-xs">
            <button
              type="button"
              onClick={() => setPatientType("new")}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                patientType === "new"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              New Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setPatientType("existing");
                // Pre-fill sample existing patient for demo
                setFormData((prev) => ({
                  ...prev,
                  name: "Suresh Babu",
                  age: "61",
                  gender: "M",
                  phone: "9121045678",
                }));
              }}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                patientType === "existing"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Existing (Lookup MR ID)
            </button>
          </div>

          {/* Section 1: Demographics */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              1. Patient Demographics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
                  placeholder="e.g. 9848022334"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 54"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as "M" | "F" | "Other" })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Department & Doctor Assignment */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              2. Clinical Assignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {Object.keys(doctorListByDept).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Attending Doctor
                </label>
                <select
                  value={formData.attendingDoctor}
                  onChange={(e) =>
                    setFormData({ ...formData, attendingDoctor: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {(doctorListByDept[formData.department] || []).map((doc) => (
                    <option key={doc} value={doc}>
                      {doc} (On Duty)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Billing & Consultation Fee */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              3. Consultation Fee & Payment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Visit Type
                </label>
                <select
                  value={formData.visitType}
                  onChange={(e) => {
                    const v = e.target.value as "New" | "Follow-up";
                    setFormData({
                      ...formData,
                      visitType: v,
                      consultationFee: v === "New" ? 500 : 300,
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="New">New Consultation (₹500)</option>
                  <option value="Follow-up">Follow-up Revisit (₹300)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Fee Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      consultationFee: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Card">Debit / Credit Card</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chief Complaint / Notes */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              Chief Complaints / Clinical Notes (Optional)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Fever for 3 days, chest discomfort..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-slate-500 text-xs">
              Fee Total:{" "}
              <span className="font-bold text-slate-900 text-sm">
                ₹{formData.consultationFee}
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
                className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition shadow-sm hover:shadow"
              >
                <Printer className="w-4 h-4" />
                Register & Print Slip
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
