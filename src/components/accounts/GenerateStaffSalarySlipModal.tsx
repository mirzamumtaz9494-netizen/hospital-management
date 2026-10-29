"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  Building2,
  Calculator,
  IndianRupee,
  CheckCircle2,
  Calendar,
  Landmark,
  BadgePercent,
} from "lucide-react";
import { StaffPayrollProfile, StaffSalarySlip } from "@/types";

interface GenerateStaffSalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: StaffPayrollProfile[];
  onSave: (slip: StaffSalarySlip) => void;
}

export const GenerateStaffSalarySlipModal: React.FC<GenerateStaffSalarySlipModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSave,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || "");
  const [monthYear, setMonthYear] = useState("October 2026");
  const [totalDays, setTotalDays] = useState<number>(31);
  const [paidDays, setPaidDays] = useState<number>(31);
  const [lopDays, setLopDays] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [overtimePay, setOvertimePay] = useState<number>(0);
  const [performanceBonus, setPerformanceBonus] = useState<number>(0);
  const [tdsDeduction, setTdsDeduction] = useState<number>(0);
  const [advanceDeduction, setAdvanceDeduction] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<"NEFT / RTGS" | "Direct Bank Transfer" | "Cheque">("NEFT / RTGS");
  const [paymentStatus, setPaymentStatus] = useState<StaffSalarySlip["paymentStatus"]>("Approved");
  const [remarks, setRemarks] = useState("");

  const activeProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  useEffect(() => {
    if (!activeProfile) return;
    setPaidDays(totalDays - lopDays);
  }, [totalDays, lopDays, activeProfile]);

  if (!isOpen || !activeProfile) return null;

  // Earnings
  const basicPay = activeProfile.basicPay;
  const hra = activeProfile.hra;
  const medicalAllowance = activeProfile.medicalAllowance;
  const specialAllowance = activeProfile.specialAllowance;
  const baseGross = basicPay + hra + medicalAllowance + specialAllowance;
  const grossEarnings = baseGross + overtimePay + performanceBonus;

  // Deductions
  const epfDeduction = activeProfile.isEpfEligible ? Math.round(basicPay * 0.12) : 0;
  const esiDeduction = activeProfile.isEsiEligible ? Math.round(grossEarnings * 0.0075) : 0;
  const professionalTax = 200; // Standard statutory PT slab
  const lopDeduction = lopDays > 0 ? Math.round((baseGross / totalDays) * lopDays) : 0;
  const totalDeductions =
    epfDeduction + esiDeduction + professionalTax + tdsDeduction + advanceDeduction + lopDeduction;

  const netSalary = Math.max(0, grossEarnings - totalDeductions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSlip: StaffSalarySlip = {
      id: `pay-${Date.now()}`,
      slipNumber: `PAY-2026-10-${Math.floor(10 + Math.random() * 89)}`,
      employeeCode: activeProfile.employeeCode,
      employeeName: activeProfile.name,
      designation: activeProfile.designation,
      department: activeProfile.department,
      monthYear,
      disbursementDate: new Date().toISOString().split("T")[0],
      totalDays,
      paidDays,
      lopDays,
      overtimeHours,
      basicPay,
      hra,
      medicalAllowance,
      specialAllowance,
      overtimePay,
      performanceBonus,
      grossEarnings,
      epfDeduction,
      esiDeduction,
      professionalTax,
      tdsDeduction,
      advanceDeduction,
      lopDeduction,
      totalDeductions,
      netSalary,
      netSalaryWords: `Net payable calculated for ${activeProfile.name}`,
      bankAccountNumber: activeProfile.bankAccountNumber,
      bankIfsc: activeProfile.bankIfsc,
      bankName: activeProfile.bankName,
      panNumber: activeProfile.panNumber,
      uan: activeProfile.uan,
      esiNumber: activeProfile.esiNumber,
      beneficiaryEmail: activeProfile.beneficiaryEmail,
      paymentMode,
      paymentStatus,
      remarks: remarks || `Salary computation for ${monthYear}.`,
    };

    onSave(newSlip);
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
              <h2 className="text-sm font-bold">Generate Staff Monthly Pay Slip</h2>
              <p className="text-[11px] text-slate-400">
                EPF 12%, ESIC 0.75%, Professional Tax, Overtime &amp; LOP Deductions
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Employee & Month Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Select Employee / Staff</label>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.employeeCode} • {p.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Pay Month &amp; Year</label>
              <input
                type="text"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                placeholder="e.g. October 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          {/* Salary Profile Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Salary Structure:
              </span>
              <div className="text-slate-900 font-mono text-xs">
                Basic: <strong>₹{basicPay.toLocaleString("en-IN")}</strong> | HRA: <strong>₹{hra.toLocaleString("en-IN")}</strong> | Med: <strong>₹{medicalAllowance.toLocaleString("en-IN")}</strong> | Spl: <strong>₹{specialAllowance.toLocaleString("en-IN")}</strong>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono text-slate-600">
              <div>A/C: {activeProfile.bankAccountNumber}</div>
              <div>IFSC: {activeProfile.bankIfsc}</div>
            </div>
          </div>

          {/* Attendance & Overtime Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-teal-50/50 p-3.5 rounded-2xl border border-teal-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Days in Month</label>
              <input
                type="number"
                min="28"
                max="31"
                value={totalDays}
                onChange={(e) => setTotalDays(parseInt(e.target.value) || 31)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">LOP Days (Unpaid)</label>
              <input
                type="number"
                min="0"
                max={totalDays}
                value={lopDays}
                onChange={(e) => setLopDays(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-rose-700 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">OT Hours</label>
              <input
                type="number"
                min="0"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">OT Pay (₹)</label>
              <input
                type="number"
                min="0"
                value={overtimePay}
                onChange={(e) => setOvertimePay(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-teal-800 font-mono font-bold"
              />
            </div>
          </div>

          {/* Additional Earnings & Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Performance Bonus (₹)</label>
              <input
                type="number"
                min="0"
                value={performanceBonus}
                onChange={(e) => setPerformanceBonus(parseInt(e.target.value) || 0)}
                placeholder="Incentives"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Salary Advance Repayment (₹)</label>
              <input
                type="number"
                min="0"
                value={advanceDeduction}
                onChange={(e) => setAdvanceDeduction(parseInt(e.target.value) || 0)}
                placeholder="Advance Deduction"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-rose-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">TDS / Income Tax (₹)</label>
              <input
                type="number"
                min="0"
                value={tdsDeduction}
                onChange={(e) => setTdsDeduction(parseInt(e.target.value) || 0)}
                placeholder="Monthly TDS"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-rose-700"
              />
            </div>
          </div>

          {/* Payment Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="NEFT / RTGS">Corporate Bank NEFT / RTGS</option>
                <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                <option value="Cheque">Hospital Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Initial Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="Approved">Approved for Payout</option>
                <option value="Bank Batch Queued">Bank Batch Queued</option>
                <option value="Draft">Draft</option>
                <option value="Disbursed">Disbursed</option>
              </select>
            </div>
          </div>

          {/* Accounting Remarks */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Accounting Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Regular monthly payroll run for ICU nursing staff"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          {/* Live Financial Breakdown Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Gross Earnings (Basic + HRA + Allowances + OT):</span>
              <span className="font-bold">₹{grossEarnings.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>Statutory EPF (12% of Basic):</span>
              <span>-₹{epfDeduction.toLocaleString("en-IN")}</span>
            </div>
            {esiDeduction > 0 && (
              <div className="flex justify-between text-rose-400 text-[11px]">
                <span>ESIC Health Insurance (0.75%):</span>
                <span>-₹{esiDeduction.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-rose-400 text-[11px]">
              <span>Professional Tax (PT Slab):</span>
              <span>-₹{professionalTax.toLocaleString("en-IN")}</span>
            </div>
            {lopDeduction > 0 && (
              <div className="flex justify-between text-rose-400 text-[11px]">
                <span>Loss of Pay ({lopDays} days):</span>
                <span>-₹{lopDeduction.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-white text-sm font-bold pt-2 border-t border-slate-700">
              <span>Net Take-Home Salary:</span>
              <span className="text-base text-emerald-400">₹{netSalary.toLocaleString("en-IN")}</span>
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
              <span>Issue Salary Slip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
