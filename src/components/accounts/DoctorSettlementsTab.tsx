"use client";

import React, { useState } from "react";
import {
  Stethoscope,
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
  Calculator,
} from "lucide-react";
import { DoctorSettlementRule, DoctorSettlementStatement } from "@/types";

interface DoctorSettlementsTabProps {
  statements: DoctorSettlementStatement[];
  rules: DoctorSettlementRule[];
  onOpenGenerateModal: () => void;
  onPrintStatement: (statement: DoctorSettlementStatement) => void;
  onUpdateStatementStatus: (
    id: string,
    newStatus: DoctorSettlementStatement["paymentStatus"],
    txRef?: string
  ) => void;
}

export const DoctorSettlementsTab: React.FC<DoctorSettlementsTabProps> = ({
  statements,
  rules,
  onOpenGenerateModal,
  onPrintStatement,
  onUpdateStatementStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"STATEMENTS" | "RULES">("STATEMENTS");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("All");

  // KPI Computations
  const totalDoctorEarnings = statements.reduce((sum, s) => sum + s.grossEarnings, 0);
  const totalNetPayable = statements.reduce((sum, s) => sum + s.netPayable, 0);
  const totalHospitalRetained = statements.reduce((sum, s) => sum + s.hospitalShareRetained, 0);
  const totalTdsWithheld = statements.reduce((sum, s) => sum + s.tdsDeduction, 0);
  const pendingStatementsCount = statements.filter(
    (s) => s.paymentStatus === "Pending Approval" || s.paymentStatus === "Approved"
  ).length;

  const filteredStatements = statements.filter((s) => {
    const matchesSearch =
      s.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.settlementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.panNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.paymentStatus === statusFilter;
    const matchesPeriod = periodFilter === "All" || s.period === periodFilter;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const getStatusBadge = (status: DoctorSettlementStatement["paymentStatus"]) => {
    switch (status) {
      case "Disbursed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Disbursed
          </span>
        );
      case "Bank Queued":
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
      case "Pending Approval":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Approval
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
            <Stethoscope className="w-5 h-5 text-teal-700" />
            Doctor Settlement &amp; Fee Sharing Clearinghouse
          </h2>
          <p className="text-xs text-slate-500">
            Salaried retainers, visiting consultant OP splits, on-call OT surgeon fee sharing &amp; Section 194J TDS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab("STATEMENTS")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeSubTab === "STATEMENTS"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Settlement Statements ({statements.length})
            </button>
            <button
              onClick={() => setActiveSubTab("RULES")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeSubTab === "RULES"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Contract Rules ({rules.length})
            </button>
          </div>

          <button
            onClick={onOpenGenerateModal}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-teal-700/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Calculate Payout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Net Doctor Disbursable
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
            ₹{totalNetPayable.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-teal-700 font-bold">Gross: ₹{totalDoctorEarnings.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Hospital Retained Share
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight font-mono">
            ₹{totalHospitalRetained.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-700 font-bold">Facility &amp; OT overheads</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              TDS Withheld (Sec 194J)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <BadgePercent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-800 tracking-tight font-mono">
            ₹{totalTdsWithheld.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-blue-700 font-bold">10% Statutory deduction</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-800 tracking-tight font-mono">
            {pendingStatementsCount} Vouchers
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-amber-700 font-bold">Awaiting CFO / Bank run</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: Settlement Statements Ledger */}
      {activeSubTab === "STATEMENTS" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doctor, voucher ref, department, PAN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Bank Queued">Bank Queued</option>
                <option value="Disbursed">Disbursed</option>
              </select>

              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
              >
                <option value="All">All Periods</option>
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
            </div>
          </div>

          {/* Statements Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/75">
                    <th className="py-3 px-4">Statement No &amp; Date</th>
                    <th className="py-3 px-4">Doctor &amp; Department</th>
                    <th className="py-3 px-3 text-center">Contract</th>
                    <th className="py-3 px-3 text-center">Caseload</th>
                    <th className="py-3 px-3 text-right">Doctor Gross (₹)</th>
                    <th className="py-3 px-3 text-right">TDS 10% (₹)</th>
                    <th className="py-3 px-3 text-right">Net Payable (₹)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {filteredStatements.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                        No doctor settlement statements match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStatements.map((stmt) => (
                      <tr key={stmt.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{stmt.settlementNumber}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{stmt.settlementDate} • {stmt.period}</div>
                        </td>

                        <td className="py-3 px-4 font-sans">
                          <div className="font-bold text-slate-900">{stmt.doctorName}</div>
                          <div className="text-[10px] text-teal-800 font-semibold">{stmt.department}</div>
                        </td>

                        <td className="py-3 px-3 text-center font-sans">
                          <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            stmt.contractType === "Salaried Full-Time"
                              ? "bg-purple-50 text-purple-800 border border-purple-200"
                              : stmt.contractType === "On-Call Surgeon"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}>
                            {stmt.contractType}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-sans text-[11px] text-slate-700">
                          <div>{stmt.totalOpdConsultations} OPD</div>
                          {stmt.totalSurgeries > 0 && (
                            <div className="text-teal-800 font-bold">{stmt.totalSurgeries} Surgeries</div>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right text-slate-700">
                          ₹{stmt.grossEarnings.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-3 text-right text-rose-700 font-medium">
                          -₹{stmt.tdsDeduction.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ₹{stmt.netPayable.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {getStatusBadge(stmt.paymentStatus)}
                        </td>

                        <td className="py-3 px-4 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Status Quick Action Buttons */}
                            {stmt.paymentStatus === "Pending Approval" && (
                              <button
                                onClick={() => onUpdateStatementStatus(stmt.id, "Approved")}
                                title="Approve for Payment"
                                className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {stmt.paymentStatus === "Approved" && (
                              <button
                                onClick={() => onUpdateStatementStatus(stmt.id, "Bank Queued")}
                                title="Queue for Corporate Bank NEFT"
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Queue Bank
                              </button>
                            )}
                            {stmt.paymentStatus === "Bank Queued" && (
                              <button
                                onClick={() => onUpdateStatementStatus(stmt.id, "Disbursed", `UTR-${Date.now().toString().slice(-8)}`)}
                                title="Mark as Disbursed"
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}

                            <button
                              onClick={() => onPrintStatement(stmt)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Print Official Doctor Payout Statement"
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

      {/* VIEW 2: Doctor Contract Rules Directory */}
      {activeSubTab === "RULES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{rule.doctorName}</h3>
                    <p className="text-[11px] text-teal-800 font-semibold">{rule.department}</p>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rule.contractType === "Salaried Full-Time"
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : rule.contractType === "On-Call Surgeon"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    {rule.contractType}
                  </span>
                </div>

                {/* Contract Formula Breakdown */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 font-mono">
                  {rule.contractType === "Salaried Full-Time" && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Monthly Base Retainer:</span>
                      <strong className="text-slate-900">₹{(rule.monthlyBaseSalary || 0).toLocaleString("en-IN")}</strong>
                    </div>
                  )}
                  {rule.contractType === "Visiting Consultant" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">OPD Fee Share:</span>
                        <strong className="text-teal-800">{rule.opdSharePercent}% Doctor / {rule.hospitalOpdSharePercent}% Hosp</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">OT Procedure Cut:</span>
                        <strong className="text-slate-900">{rule.ipdSurgeonSharePercent}%</strong>
                      </div>
                    </>
                  )}
                  {rule.contractType === "On-Call Surgeon" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Surgeon OT Package:</span>
                        <strong className="text-rose-800">
                          {rule.fixedSurgeonFeePerOt
                            ? `₹${rule.fixedSurgeonFeePerOt.toLocaleString("en-IN")} Fixed/Case`
                            : `${rule.ipdSurgeonSharePercent}% of Surgery Fee`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">OPD Consult Share:</span>
                        <strong className="text-slate-900">{rule.opdSharePercent}%</strong>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500 font-sans">TDS Deduction:</span>
                    <strong className="text-slate-700">10% (Sec 194J)</strong>
                  </div>
                </div>

                {/* Banking & Statutory Info */}
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>Bank: <strong className="text-slate-900">{rule.bankName}</strong></div>
                  <div>A/C: <strong className="font-mono text-slate-900">{rule.bankAccountNumber}</strong> (IFSC: {rule.bankIfsc})</div>
                  <div>PAN: <strong className="font-mono text-slate-900">{rule.panNumber}</strong></div>
                </div>
              </div>

              <button
                onClick={onOpenGenerateModal}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-teal-700" />
                <span>Calculate Settlement</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
