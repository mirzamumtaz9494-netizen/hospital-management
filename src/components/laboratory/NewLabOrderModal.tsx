"use client";

import React, { useState } from "react";
import {
  X,
  FlaskConical,
  User,
  Stethoscope,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { LabOrder, LabPriority, LabCatalogItem, LabDepartment } from "@/types";
import { MOCK_LAB_CATALOG } from "@/data/labMockData";

interface NewLabOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (newOrder: LabOrder) => void;
}

export const NewLabOrderModal: React.FC<NewLabOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmitOrder,
}) => {
  const [patientSource, setPatientSource] = useState<"OPD" | "IPD" | "Emergency" | "Walk-in">("OPD");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("45");
  const [gender, setGender] = useState<"M" | "F" | "Other">("M");
  const [phone, setPhone] = useState("");
  const [mrId, setMrId] = useState("");
  const [wardBed, setWardBed] = useState("");
  const [doctor, setDoctor] = useState("Dr. S. Reddy (Cardiology)");
  const [priority, setPriority] = useState<LabPriority>("Routine");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");

  // Selected tests (set of catalog test IDs)
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(["cat-1"]);

  if (!isOpen) return null;

  const toggleTest = (id: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const selectedTests = MOCK_LAB_CATALOG.filter((c) =>
    selectedTestIds.includes(c.id)
  );

  const totalAmount = selectedTests.reduce((sum, t) => sum + t.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert("Please enter patient name");
      return;
    }
    if (selectedTests.length === 0) {
      alert("Please select at least one diagnostic test");
      return;
    }

    const orderNumber = `LAB-${Math.floor(8815 + Math.random() * 50)}`;
    const barcodeStr = `BC-${Math.floor(904130 + Math.random() * 50)}`;
    const generatedMrId = mrId.trim() || `MR-${Math.floor(10450 + Math.random() * 50)}`;

    const initials = patientName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "PT";

    const newOrder: LabOrder = {
      id: `ord-${Date.now()}`,
      orderNo: orderNumber,
      barcode: barcodeStr,
      patientId: `p-${Date.now()}`,
      mrId: generatedMrId,
      opIpNo:
        patientSource === "IPD"
          ? `IP-${Math.floor(22045 + Math.random() * 20)}`
          : patientSource === "Emergency"
          ? `ER-${Math.floor(5025 + Math.random() * 20)}`
          : patientSource === "Walk-in"
          ? `WLK-${Math.floor(115 + Math.random() * 20)}`
          : `OP-${Math.floor(40125 + Math.random() * 20)}`,
      patientName,
      initials,
      age: parseInt(age, 10) || 45,
      gender,
      phone: phone || "9876543210",
      source: patientSource,
      wardBed: patientSource === "IPD" ? wardBed || "GEN-14" : undefined,
      referringDoctor: doctor,
      tests: selectedTests.map((t) => ({
        id: `t-${Math.random()}`,
        testCode: t.code,
        testName: t.name,
        department: t.department,
        price: t.price,
        status: "Pending Sample",
        sampleType: t.sampleType,
        tubeColor: t.tubeColor,
      })),
      totalAmount,
      paidAmount: totalAmount,
      paymentStatus: "Paid",
      priority,
      orderDate: "Today",
      orderTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Pending Sample",
      clinicalNotes,
    };

    onSubmitOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-800">
              <FlaskConical className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                New Diagnostic Test Requisition
              </h3>
              <p className="text-xs text-slate-500">
                Generate laboratory order, barcode label & collect diagnostic bill
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Source Toggle */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">
              Patient Care Stream
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["OPD", "IPD", "Emergency", "Walk-in"] as const).map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setPatientSource(src)}
                  className={`py-2 rounded-xl font-bold border transition text-xs ${
                    patientSource === src
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Anand Sharma"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "M" | "F" | "Other")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9848012345"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Referring Doctor
              </label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              >
                <option value="Dr. S. Reddy (Cardiology)">Dr. S. Reddy (Cardiology)</option>
                <option value="Dr. K. Sharma (General Medicine)">Dr. K. Sharma (General Medicine)</option>
                <option value="Dr. A. Rao (Orthopedics)">Dr. A. Rao (Orthopedics)</option>
                <option value="Dr. P. Nair (Gynecology)">Dr. P. Nair (Gynecology)</option>
                <option value="Dr. V. Menon (Neurology)">Dr. V. Menon (Neurology)</option>
                <option value="Self / Preventive Checkup">Self / Preventive Checkup</option>
              </select>
            </div>

            {patientSource === "IPD" && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Ward & Bed Number
                </label>
                <input
                  type="text"
                  value={wardBed}
                  onChange={(e) => setWardBed(e.target.value)}
                  placeholder="e.g. ICU-07 or G-105"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Order Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as LabPriority)}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none ${
                  priority === "Stat"
                    ? "bg-rose-50 border-rose-300 text-rose-800"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <option value="Routine">Routine Processing</option>
                <option value="Stat">STAT / Urgent Emergency (Immediate TAT)</option>
              </select>
            </div>
          </div>

          {/* Test Selection from Catalog */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                Select Diagnostic Tests & Profiles ({selectedTestIds.length} Selected)
              </label>
              <span className="font-mono font-black text-slate-900 text-xs">
                Total: ₹{totalAmount}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl">
              {MOCK_LAB_CATALOG.map((test) => {
                const isSelected = selectedTestIds.includes(test.id);
                return (
                  <div
                    key={test.id}
                    onClick={() => toggleTest(test.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                      isSelected
                        ? "bg-teal-50 border-teal-600 text-teal-900 font-semibold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{test.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {test.code} • {test.department}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs shrink-0 ml-2">
                      ₹{test.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Indications */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Clinical Indication / Diagnosis
            </label>
            <input
              type="text"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Chronic chest pain, fever 4 days, pre-op clearance..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Payment & Submit */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-slate-500">Bill Amount Payable</div>
              <div className="text-xl font-black text-slate-900 font-mono">
                ₹{totalAmount.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="UPI">UPI (GPay / PhonePe)</option>
                <option value="Cash">Cash Counter</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Insurance">TPA Insurance</option>
              </select>

              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Confirm & Create Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
