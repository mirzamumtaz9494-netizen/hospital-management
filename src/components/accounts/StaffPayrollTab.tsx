"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  Clock,
  Landmark,
  BadgePercent,
  FileText,
  AlertCircle,
  TrendingUp,
  Download,
  Building2,
  Calendar,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
} from "lucide-react";
import { StaffPayrollProfile, StaffSalarySlip } from "@/types";
import { exportStaffSalaryBankBatch } from "@/lib/bankBatchExportService";

interface StaffPayrollTabProps {
  slips: StaffSalarySlip[];
  profiles: StaffPayrollProfile[];
  onOpenGenerateModal: () => void;
  onPrintSlip: (slip: StaffSalarySlip) => void;
  onUpdateSlipStatus: (
    id: string,
    newStatus: StaffSalarySlip["paymentStatus"],
    txRef?: string
  ) => void;
}

export const StaffPayrollTab: React.FC<StaffPayrollTabProps> = ({
  slips,
  profiles,
  onOpenGenerateModal,
  onPrintSlip,
  onUpdateSlipStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"SLIPS" | "PROFILES">("SLIPS");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  // KPI Computations
  const totalGrossPayroll = slips.reduce((sum, s) => sum + s.grossEarnings, 0);
  const totalNetSalaries = slips.reduce((sum, s) => sum + s.netSalary, 0);
  const totalStatutoryDeductions = slips.reduce(
    (sum, s) => sum + s.epfDeduction + s.esiDeduction + s.professionalTax + s.tdsDeduction,
    0
  );
  const queuedBatchCount = slips.filter((s) => s.paymentStatus === "Bank Batch Queued").length;

  const departments = [
    "All",
    "Critical Care & ICU",
    "Finance & Accounts",
    "Pharmacy & Formulary",
    "Diagnostic Pathology & Lab",
    "Front Office & Billing",
    "Inpatient General Wards",
    "Operation Theatre & Wards",
  ];

  const filteredSlips = slips.filter((slip) => {
    const matchesSearch =
      slip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.slipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.bankAccountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || slip.paymentStatus === statusFilter;
    const matchesDept = deptFilter === "All" || slip.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusBadge = (status: StaffSalarySlip["paymentStatus"]) => {
    switch (status) {
      case "Disbursed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Disbursed
          </span>
        );
      case "Bank Batch Queued":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Landmark className="w-3 h-3 text-blue-600" />
            Bank Queued
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <UserCheck className="w-3 h-3 text-teal-600" />
            Approved
          </span>
        );
      case "Draft":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            Unified Staff Payroll &amp; Corporate Bank Payouts
          </h2>
          <p className="text-xs text-slate-500">
            Statutory EPF (12%), ESIC (0.75%), PT slabs, overtime hours, and 1-click NEFT/RTGS bank batch export
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab("SLIPS")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeSubTab === "SLIPS"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Salary Slips ({slips.length})
            </button>
            <button
              onClick={() => setActiveSubTab("PROFILES")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeSubTab === "PROFILES"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Staff Profiles ({profiles.length})
            </button>
          </div>

          <button
            onClick={() => exportStaffSalaryBankBatch(slips)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-emerald-700/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Download CSV formatted for HDFC Enet, ICICI, and SBI Corporate banking portals"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export NEFT/RTGS Batch</span>
          </button>

          <button
            onClick={onOpenGenerateModal}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-teal-700/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Pay Slip</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Net Staff Take-Home
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
            ₹{totalNetSalaries.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-teal-700 font-bold">Gross Cost: ₹{totalGrossPayroll.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Statutory Deductions Pool
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <BadgePercent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-800 tracking-tight font-mono">
            ₹{totalStatutoryDeductions.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-blue-700 font-bold">EPF (12%) + ESIC + PT</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Bank Batch Queued
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight font-mono">
            {queuedBatchCount} Slips
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-700 font-bold">Ready for corporate NEFT upload</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Hospital Staff Roster
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-900 tracking-tight font-mono">
            {profiles.length} Active Staff
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-purple-700 font-bold">Nurses, Techs, Pharmacists &amp; Admin</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: Monthly Salary Slips Ledger */}
      {activeSubTab === "SLIPS" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, code (CP-NUR), voucher, bank A/C..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Departments" : d}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Approved">Approved</option>
                <option value="Bank Batch Queued">Bank Batch Queued</option>
                <option value="Disbursed">Disbursed</option>
              </select>
            </div>
          </div>

          {/* Slips Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/75">
                    <th className="py-3 px-4">Pay Voucher &amp; Period</th>
                    <th className="py-3 px-4">Employee Details</th>
                    <th className="py-3 px-3 text-center">Attendance</th>
                    <th className="py-3 px-3 text-right">Gross Earnings (₹)</th>
                    <th className="py-3 px-3 text-right">Deductions (₹)</th>
                    <th className="py-3 px-3 text-right">Net Salary (₹)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {filteredSlips.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                        No monthly salary slips match the current filter selection.
                      </td>
                    </tr>
                  ) : (
                    filteredSlips.map((slip) => (
                      <tr key={slip.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{slip.slipNumber}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{slip.monthYear}</div>
                        </td>

                        <td className="py-3 px-4 font-sans">
                          <div className="font-bold text-slate-900">{slip.employeeName}</div>
                          <div className="text-[10px] text-teal-800 font-semibold">
                            {slip.designation} • <span className="font-mono text-slate-500 font-normal">{slip.employeeCode}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center font-sans text-[11px] text-slate-700">
                          <div>{slip.paidDays}/{slip.totalDays} Days</div>
                          {slip.lopDays > 0 ? (
                            <span className="text-[10px] text-rose-700 font-bold">{slip.lopDays}d LOP</span>
                          ) : (
                            <span className="text-[10px] text-emerald-700">Full</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right text-slate-700">
                          ₹{slip.grossEarnings.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-3 text-right text-rose-700 font-medium">
                          -₹{slip.totalDeductions.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ₹{slip.netSalary.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {getStatusBadge(slip.paymentStatus)}
                        </td>

                        <td className="py-3 px-4 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            {slip.paymentStatus === "Draft" && (
                              <button
                                onClick={() => onUpdateSlipStatus(slip.id, "Approved")}
                                className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {slip.paymentStatus === "Approved" && (
                              <button
                                onClick={() => onUpdateSlipStatus(slip.id, "Bank Batch Queued")}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Queue Bank
                              </button>
                            )}
                            {slip.paymentStatus === "Bank Batch Queued" && (
                              <button
                                onClick={() => onUpdateSlipStatus(slip.id, "Disbursed", `NEFT-${Date.now().toString().slice(-8)}`)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}

                            <button
                              onClick={() => onPrintSlip(slip)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Print Official Monthly Salary Slip"
                            >
                              <Printer className="w-3 h-3 text-slate-500" />
                              <span>Slip</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Staff Salary Profiles & Statutory Settings */}
      {activeSubTab === "PROFILES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((prof) => (
            <div
              key={prof.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{prof.name}</h3>
                    <p className="text-[11px] text-teal-800 font-semibold">{prof.designation}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{prof.employeeCode} • {prof.department}</p>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </div>

                {/* Salary Package Breakdown */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Basic Pay:</span>
                    <strong className="text-slate-900">₹{prof.basicPay.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">HRA (40%):</span>
                    <strong className="text-slate-900">₹{prof.hra.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Medical Allowance:</span>
                    <strong className="text-slate-900">₹{prof.medicalAllowance.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Special Allowance:</span>
                    <strong className="text-slate-900">₹{prof.specialAllowance.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold">
                    <span className="font-sans">Monthly Base CTC:</span>
                    <span className="text-teal-900">₹{(prof.basicPay + prof.hra + prof.medicalAllowance + prof.specialAllowance).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Banking & Statutory Details */}
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>Bank: <strong className="text-slate-900">{prof.bankName}</strong></div>
                  <div>A/C: <strong className="font-mono text-slate-900">{prof.bankAccountNumber}</strong> (IFSC: {prof.bankIfsc})</div>
                  <div>PAN: <strong className="font-mono text-slate-900">{prof.panNumber}</strong></div>
                  <div>UAN: <strong className="font-mono text-slate-900">{prof.uan}</strong></div>
                  {prof.esiNumber && <div>ESI: <strong className="font-mono text-slate-900">{prof.esiNumber}</strong></div>}
                </div>
              </div>

              <button
                onClick={onOpenGenerateModal}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-teal-700" />
                <span>Issue Monthly Slip</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
