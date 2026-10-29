"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  UserCheck,
  Building2,
  Calendar,
  Landmark,
  BadgePercent,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { StaffSalarySlip } from "@/types";
import { printElement } from "@/lib/printService";
import { useTenant } from "@/context/TenantContext";

interface PrintStaffSalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slip: StaffSalarySlip | null;
}

export const PrintStaffSalarySlipModal: React.FC<PrintStaffSalarySlipModalProps> = ({
  isOpen,
  onClose,
  slip,
}) => {
  const { currentTenant } = useTenant();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !slip) return null;

  const handlePrint = () => {
    if (!printRef.current) return;
    printElement(
      printRef.current,
      `Salary_Slip_${slip.slipNumber}_${slip.employeeCode}`
    );
  };

  const hospitalName = currentTenant?.name || "VitalSync Multispecialty Hospital";
  const hospitalUnit = currentTenant?.unitName || "Apex Care Hospital • Tertiary Care Unit";
  const hospitalPhone = currentTenant?.contactPhone || "+91 40 6822 9911";
  const hospitalEmail = currentTenant?.contactEmail || "payroll@apexcarehospital.com";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold">
              Official Monthly Salary Slip: {slip.slipNumber} • {slip.employeeName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div className="p-6 bg-slate-100 max-h-[82vh] overflow-y-auto">
          <div
            ref={printRef}
            className="print-container bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mx-auto max-w-[750px] text-slate-900 space-y-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                    VS
                  </div>
                  <div>
                    <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                      {hospitalName}
                    </h1>
                    <p className="text-[11px] font-bold text-teal-800 tracking-wider uppercase">
                      {hospitalUnit} • Human Resources &amp; Staff Payroll
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Banjara Hills, Hyderabad • Phone: {hospitalPhone} • Email: {hospitalEmail}
                </p>
              </div>

              <div className="text-right text-[11px] text-slate-600 font-mono space-y-0.5">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  MONTHLY SALARY SLIP
                </div>
                <div>Pay Period: <strong className="text-slate-900">{slip.monthYear}</strong></div>
                <div>Disbursement: {slip.disbursementDate}</div>
                <div>Status: <span className="font-bold uppercase text-teal-800">{slip.paymentStatus}</span></div>
              </div>
            </div>

            {/* Employee Information & Attendance Table */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs">
              <div className="space-y-1">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Employee Name:</span>
                  <div className="font-black text-slate-900 text-sm">{slip.employeeName}</div>
                  <div className="text-teal-800 font-semibold text-[11px]">{slip.designation}</div>
                </div>
                <div className="pt-1 text-[11px] space-y-0.5 text-slate-700">
                  <div>Department: <strong className="text-slate-900">{slip.department}</strong></div>
                  <div>Staff ID: <strong className="font-mono text-slate-900">{slip.employeeCode}</strong></div>
                  <div>PAN: <strong className="font-mono text-slate-900">{slip.panNumber}</strong></div>
                  <div>UAN (EPF): <strong className="font-mono text-slate-900">{slip.uan}</strong></div>
                  {slip.esiNumber && (
                    <div>ESI No: <strong className="font-mono text-slate-900">{slip.esiNumber}</strong></div>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-right font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-sans">Payment &amp; Attendance:</span>
                  <div className="font-bold text-slate-900">Voucher #{slip.slipNumber}</div>
                  <div className="text-slate-600 text-[11px]">Mode: <strong className="text-slate-800 font-sans">{slip.paymentMode}</strong></div>
                </div>
                <div className="pt-1 text-[11px] space-y-0.5 text-slate-700">
                  <div>Bank: <strong className="font-sans text-slate-900">{slip.bankName}</strong></div>
                  <div>A/C: <strong className="text-slate-900">{slip.bankAccountNumber}</strong></div>
                  <div>IFSC: <strong className="text-slate-900">{slip.bankIfsc}</strong></div>
                  <div className="pt-1.5 font-sans border-t border-slate-200/80 text-[11px]">
                    Total Days: <strong>{slip.totalDays}</strong> | Worked: <strong>{slip.paidDays}</strong> | LOP: <strong>{slip.lopDays}</strong>
                    {slip.overtimeHours > 0 && <span> | OT: <strong>{slip.overtimeHours}h</strong></span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings & Deductions Comparison Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Earnings Column */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700">
                  Earnings (₹)
                </div>
                <table className="w-full text-xs font-mono">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-sans text-slate-600">Basic Salary</td>
                      <td className="py-1.5 px-3 text-right text-slate-900 font-bold">₹{slip.basicPay.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-sans text-slate-600">House Rent Allowance (HRA)</td>
                      <td className="py-1.5 px-3 text-right text-slate-900 font-bold">₹{slip.hra.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-sans text-slate-600">Medical Allowance</td>
                      <td className="py-1.5 px-3 text-right text-slate-900 font-bold">₹{slip.medicalAllowance.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-sans text-slate-600">Special Allowance</td>
                      <td className="py-1.5 px-3 text-right text-slate-900 font-bold">₹{slip.specialAllowance.toLocaleString("en-IN")}</td>
                    </tr>
                    {slip.overtimePay > 0 && (
                      <tr className="hover:bg-slate-50 text-teal-800">
                        <td className="py-1.5 px-3 font-sans">Overtime / Night Duty Pay ({slip.overtimeHours}h)</td>
                        <td className="py-1.5 px-3 text-right font-bold">₹{slip.overtimePay.toLocaleString("en-IN")}</td>
                      </tr>
                    )}
                    {slip.performanceBonus > 0 && (
                      <tr className="hover:bg-slate-50 text-teal-800">
                        <td className="py-1.5 px-3 font-sans">Clinical Performance Incentive</td>
                        <td className="py-1.5 px-3 text-right font-bold">₹{slip.performanceBonus.toLocaleString("en-IN")}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                      <td className="py-2 px-3 font-sans text-slate-800">Gross Earnings</td>
                      <td className="py-2 px-3 text-right text-slate-900 text-sm">₹{slip.grossEarnings.toLocaleString("en-IN")}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Deductions Column */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700">
                  Deductions (₹)
                </div>
                <table className="w-full text-xs font-mono">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-sans text-slate-600">EPF Employee Share (12%)</td>
                      <td className="py-1.5 px-3 text-right text-rose-700 font-bold">₹{slip.epfDeduction.toLocaleString("en-IN")}</td>
                    </tr>
                    {slip.esiDeduction > 0 && (
                      <tr className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-sans text-slate-600">ESIC Health Insurance (0.75%)</td>
                        <td className="py-1.5 px-3 text-right text-rose-700 font-bold">₹{slip.esiDeduction.toLocaleString("en-IN")}</td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-sans text-slate-600">Professional Tax (PT)</td>
                      <td className="py-1.5 px-3 text-right text-rose-700 font-bold">₹{slip.professionalTax.toLocaleString("en-IN")}</td>
                    </tr>
                    {slip.tdsDeduction > 0 && (
                      <tr className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-sans text-slate-600">Income Tax (TDS)</td>
                        <td className="py-1.5 px-3 text-right text-rose-700 font-bold">₹{slip.tdsDeduction.toLocaleString("en-IN")}</td>
                      </tr>
                    )}
                    {slip.advanceDeduction > 0 && (
                      <tr className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-sans text-slate-600">Salary Advance Repayment</td>
                        <td className="py-1.5 px-3 text-right text-rose-700 font-bold">₹{slip.advanceDeduction.toLocaleString("en-IN")}</td>
                      </tr>
                    )}
                    {slip.lopDeduction > 0 && (
                      <tr className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-sans text-slate-600">Loss of Pay (LOP {slip.lopDays}d)</td>
                        <td className="py-1.5 px-3 text-right text-rose-700 font-bold">₹{slip.lopDeduction.toLocaleString("en-IN")}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                      <td className="py-2 px-3 font-sans text-slate-800">Total Deductions</td>
                      <td className="py-2 px-3 text-right text-rose-700 text-sm">₹{slip.totalDeductions.toLocaleString("en-IN")}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Net Salary Payable Box */}
            <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  Net Disbursable Salary (Take-Home):
                </span>
                <span className="text-xs text-slate-700 font-serif italic">
                  {slip.netSalaryWords || "Amount calculated via corporate payroll clearing"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  ₹{slip.netSalary.toLocaleString("en-IN")}
                </span>
                <div className="text-[10px] text-teal-700 font-mono font-semibold">
                  A/C: {slip.bankAccountNumber} ({slip.bankIfsc})
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="border-b border-slate-300 pb-1 h-10 flex items-end justify-center font-serif italic text-slate-700">
                  Ramesh Sharma
                </div>
                <div className="pt-1.5 font-bold text-slate-900 text-[11px]">Ramesh Sharma</div>
                <div className="text-[10px] text-slate-500">Chief Accountant &amp; Payroll Officer</div>
              </div>

              <div>
                <div className="border-b border-slate-300 pb-1 h-10 flex items-end justify-center font-serif italic text-slate-500 text-[11px]">
                  {slip.employeeName}
                </div>
                <div className="pt-1.5 font-bold text-slate-900 text-[11px]">Employee Signature</div>
                <div className="text-[10px] text-slate-500">Payee Receipt &amp; Acknowledgment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
