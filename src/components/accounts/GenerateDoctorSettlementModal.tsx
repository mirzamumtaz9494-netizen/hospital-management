"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Stethoscope,
  Building2,
  Calculator,
  IndianRupee,
  CheckCircle2,
  BadgePercent,
  Calendar,
  CreditCard,
  Landmark,
} from "lucide-react";
import { DoctorSettlementRule, DoctorSettlementStatement } from "@/types";

interface GenerateDoctorSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: DoctorSettlementRule[];
  onSave: (settlement: DoctorSettlementStatement) => void;
}

export const GenerateDoctorSettlementModal: React.FC<GenerateDoctorSettlementModalProps> = ({
  isOpen,
  onClose,
  rules,
  onSave,
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || "");
  const [period, setPeriod] = useState("October 2026");
  const [opdCount, setOpdCount] = useState<number>(45);
  const [opdGross, setOpdGross] = useState<number>(36000);
  const [surgeryCount, setSurgeryCount] = useState<number>(3);
  const [surgeryGross, setSurgeryGross] = useState<number>(180000);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<"NEFT / RTGS" | "Cheque" | "Direct Bank Transfer">("NEFT / RTGS");
  const [paymentStatus, setPaymentStatus] = useState<DoctorSettlementStatement["paymentStatus"]>("Pending Approval");
  const [remarks, setRemarks] = useState("");

  const activeRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  // Adjust defaults when doctor changes
  useEffect(() => {
    if (!activeRule) return;
    if (activeRule.contractType === "Salaried Full-Time") {
      setOpdCount(80);
      setOpdGross(40000);
      setSurgeryCount(0);
      setSurgeryGross(0);
    } else if (activeRule.contractType === "Visiting Consultant") {
      setOpdCount(95);
      setOpdGross(76000);
      setSurgeryCount(4);
      setSurgeryGross(160000);
    } else {
      // On-Call Surgeon
      setOpdCount(35);
      setOpdGross(24500);
      setSurgeryCount(5);
      setSurgeryGross(350000);
    }
  }, [selectedRuleId]);

  if (!isOpen || !activeRule) return null;

  // Real-time Fee Sharing Calculation Engine
  let baseSalary = 0;
  let doctorOpdShare = 0;
  let doctorSurgeryShare = 0;

  if (activeRule.contractType === "Salaried Full-Time") {
    baseSalary = activeRule.monthlyBaseSalary || 0;
    // Salaried OP collections belong to hospital
    doctorOpdShare = 0;
    // Optional surgery incentive
    if (activeRule.ipdSurgeonSharePercent && surgeryGross > 0) {
      doctorSurgeryShare = Math.round((surgeryGross * activeRule.ipdSurgeonSharePercent) / 100);
    }
  } else if (activeRule.contractType === "Visiting Consultant") {
    const opdPercent = activeRule.opdSharePercent || 70;
    doctorOpdShare = Math.round((opdGross * opdPercent) / 100);

    const surgPercent = activeRule.ipdSurgeonSharePercent || 60;
    doctorSurgeryShare = Math.round((surgeryGross * surgPercent) / 100);
  } else {
    // On-Call Surgeon
    const opdPercent = activeRule.opdSharePercent || 65;
    doctorOpdShare = Math.round((opdGross * opdPercent) / 100);

    if (activeRule.fixedSurgeonFeePerOt && surgeryCount > 0) {
      doctorSurgeryShare = surgeryCount * activeRule.fixedSurgeonFeePerOt;
    } else {
      const surgPercent = activeRule.ipdSurgeonSharePercent || 60;
      doctorSurgeryShare = Math.round((surgeryGross * surgPercent) / 100);
    }
  }

  const grossEarnings = baseSalary + doctorOpdShare + doctorSurgeryShare;
  const hospitalRetainedShare =
    (opdGross - doctorOpdShare) + (surgeryGross - doctorSurgeryShare);

  // Statutory 10% TDS under Section 194J
  const tdsDeduction = Math.round((grossEarnings * (activeRule.tdsPercent || 10)) / 100);
  const netPayable = Math.max(0, grossEarnings - tdsDeduction - otherDeductions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStatement: DoctorSettlementStatement = {
      id: `settle-${Date.now()}`,
      settlementNumber: `DOC-SETTLE-2026-10-${Math.floor(10 + Math.random() * 89)}`,
      doctorId: activeRule.doctorId,
      doctorName: activeRule.doctorName,
      department: activeRule.department,
      period,
      settlementDate: new Date().toISOString().split("T")[0],
      contractType: activeRule.contractType,
      totalOpdConsultations: Number(opdCount) || 0,
      grossOpdCollections: Number(opdGross) || 0,
      doctorOpdEarnings: doctorOpdShare,
      totalSurgeries: Number(surgeryCount) || 0,
      grossSurgeryCollections: Number(surgeryGross) || 0,
      doctorSurgeryEarnings: doctorSurgeryShare,
      baseSalaryOrRetainer: baseSalary,
      grossEarnings,
      hospitalShareRetained: hospitalRetainedShare,
      tdsDeduction,
      otherDeductions: Number(otherDeductions) || 0,
      netPayable,
      paymentStatus,
      paymentMode,
      bankAccountNumber: activeRule.bankAccountNumber,
      bankIfsc: activeRule.bankIfsc,
      bankName: activeRule.bankName,
      panNumber: activeRule.panNumber,
      remarks: remarks || `Settlement computed under ${activeRule.contractType} terms for ${period}.`,
      itemizedEncounters: [
        {
          id: `enc-${Date.now()}-1`,
          date: new Date().toISOString().split("T")[0],
          patientName: "Active Patient Cohort",
          uhid: "UHID-BATCH-OCT",
          caseType: "OPD Consultation",
          procedureName: `${opdCount} Outpatient Consultations`,
          totalCharged: opdGross,
          doctorShare: doctorOpdShare,
          hospitalShare: opdGross - doctorOpdShare,
        },
      ],
    };

    onSave(newStatement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Doctor Settlement Rules Engine</h2>
              <p className="text-[11px] text-slate-400">
                Fee sharing, OPD splits, OT surgical calculations &amp; 10% TDS u/s 194J
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Select Doctor & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Select Consultant / Specialist</label>
              <select
                value={selectedRuleId}
                onChange={(e) => setSelectedRuleId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
              >
                {rules.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    {rule.doctorName} ({rule.department} • {rule.contractType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Billing Period</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. October 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          {/* Active Contract Terms Pill */}
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                Configured Contract Terms:
              </span>
              <div className="text-slate-900 font-bold text-xs">
                {activeRule.contractType}:{" "}
                {activeRule.contractType === "Salaried Full-Time" && (
                  <span>₹{(activeRule.monthlyBaseSalary || 0).toLocaleString("en-IN")} Fixed Monthly Retainer</span>
                )}
                {activeRule.contractType === "Visiting Consultant" && (
                  <span>{activeRule.opdSharePercent}% OP Share • {activeRule.ipdSurgeonSharePercent}% OT Surgery Share</span>
                )}
                {activeRule.contractType === "On-Call Surgeon" && (
                  <span>
                    {activeRule.fixedSurgeonFeePerOt
                      ? `₹${activeRule.fixedSurgeonFeePerOt.toLocaleString("en-IN")} Fixed/OT`
                      : `${activeRule.ipdSurgeonSharePercent}% OT Share`}
                    {" "}• {activeRule.opdSharePercent}% OP Share
                  </span>
                )}
              </div>
            </div>
            <div className="text-right text-[10px] font-mono text-teal-800">
              <div>PAN: {activeRule.panNumber}</div>
              <div>IFSC: {activeRule.bankIfsc}</div>
            </div>
          </div>

          {/* Caseload & Collections Input Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">OP Consultations</label>
              <input
                type="number"
                min="0"
                value={opdCount}
                onChange={(e) => setOpdCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Gross OP Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={opdGross}
                onChange={(e) => setOpdGross(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Surgeries / OT</label>
              <input
                type="number"
                min="0"
                value={surgeryCount}
                onChange={(e) => setSurgeryCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Gross OT Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={surgeryGross}
                onChange={(e) => setSurgeryGross(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
              />
            </div>
          </div>

          {/* Payment & Other Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Other Deductions (₹)</label>
              <input
                type="number"
                min="0"
                value={otherDeductions}
                onChange={(e) => setOtherDeductions(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="Advance / Indemnity"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Disbursement Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="NEFT / RTGS">NEFT / RTGS Corporate Bank</option>
                <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                <option value="Cheque">Hospital Corporate Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Initial Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Bank Queued">Bank Queued</option>
                <option value="Disbursed">Disbursed</option>
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Accounting Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. October monthly settlement with 4 OT robotic knee procedures"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          {/* Real-Time Calculation Ledger Preview */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Gross Doctor Revenue Generated:</span>
              <span>₹{(opdGross + surgeryGross + baseSalary).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Doctor Calculated Earnings:</span>
              <span className="font-bold">₹{grossEarnings.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span>Less: Statutory TDS (10% u/s 194J):</span>
              <span>-₹{tdsDeduction.toLocaleString("en-IN")}</span>
            </div>
            {otherDeductions > 0 && (
              <div className="flex justify-between text-rose-400">
                <span>Less: Other Adjustments:</span>
                <span>-₹{otherDeductions.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-teal-400 text-[11px] pt-1 border-t border-slate-800">
              <span>Hospital Retained Margin:</span>
              <span>₹{hospitalRetainedShare.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-white text-sm font-bold pt-1.5 border-t border-slate-700">
              <span>Net Doctor Payable:</span>
              <span className="text-base text-emerald-400">₹{netPayable.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Commit &amp; Issue Settlement Voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
