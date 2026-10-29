"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Stethoscope,
  Building2,
  ShieldCheck,
  FileText,
  Landmark,
  BadgePercent,
  CheckCircle2,
} from "lucide-react";
import { DoctorSettlementStatement } from "@/types";
import { printElement } from "@/lib/printService";
import { useTenant } from "@/context/TenantContext";

interface PrintDoctorSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: DoctorSettlementStatement | null;
}

export const PrintDoctorSettlementModal: React.FC<PrintDoctorSettlementModalProps> = ({
  isOpen,
  onClose,
  settlement,
}) => {
  const { currentTenant } = useTenant();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !settlement) return null;

  const handlePrint = () => {
    if (!printRef.current) return;
    printElement(
      printRef.current,
      `Doctor_Payout_Statement_${settlement.settlementNumber}`
    );
  };

  const hospitalName = currentTenant?.name || "VitalSync Multispecialty Hospital";
  const hospitalUnit = currentTenant?.unitName || "Apex Care Hospital • Tertiary Care Unit";
  const hospitalPhone = currentTenant?.contactPhone || "+91 40 6822 9911";
  const hospitalEmail = currentTenant?.contactEmail || "accounts@apexcarehospital.com";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold">
              Official Doctor Settlement &amp; Payout Statement: {settlement.settlementNumber}
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
                      {hospitalUnit} • Finance &amp; Accounts Division
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Banjara Hills, Hyderabad • Phone: {hospitalPhone} • Email: {hospitalEmail}
                </p>
              </div>

              <div className="text-right text-[11px] text-slate-600 font-mono space-y-0.5">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  DOCTOR PAYOUT STATEMENT
                </div>
                <div>Form 16A Professional Fee Settlement</div>
                <div>Date: <strong className="text-slate-900">{settlement.settlementDate}</strong></div>
                <div>Status: <span className="font-bold uppercase text-teal-800">{settlement.paymentStatus}</span></div>
              </div>
            </div>

            {/* Doctor & Settlement Meta Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Consultant / Surgeon:</span>
                  <div className="font-black text-slate-900 text-sm">{settlement.doctorName}</div>
                  <div className="text-teal-800 font-semibold text-[11px]">{settlement.department}</div>
                </div>
                <div className="pt-1 text-[11px] space-y-0.5 text-slate-700">
                  <div>Contract Type: <strong className="text-slate-900">{settlement.contractType}</strong></div>
                  <div>PAN: <strong className="font-mono text-slate-900">{settlement.panNumber}</strong></div>
                </div>
              </div>

              <div className="space-y-1.5 text-right font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-sans">Statement Reference:</span>
                  <div className="font-bold text-slate-900">{settlement.settlementNumber}</div>
                  <div className="text-slate-600 text-[11px]">Period: <strong className="text-slate-800 font-sans">{settlement.period}</strong></div>
                </div>
                <div className="pt-1 text-[11px] space-y-0.5 text-slate-700">
                  <div>Bank: <strong className="font-sans text-slate-900">{settlement.bankName}</strong></div>
                  <div>A/C: <strong className="text-slate-900">{settlement.bankAccountNumber}</strong></div>
                  <div>IFSC: <strong className="text-slate-900">{settlement.bankIfsc}</strong></div>
                </div>
              </div>
            </div>

            {/* Revenue & Sharing Breakdown Summary */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BadgePercent className="w-3.5 h-3.5 text-teal-700" />
                Fee Sharing Summary &amp; Caseload
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Cases</th>
                    <th className="py-2.5 px-3 text-right">Gross Collections (₹)</th>
                    <th className="py-2.5 px-3 text-right">Hospital Share (₹)</th>
                    <th className="py-2.5 px-3 text-right">Doctor Earnings (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {settlement.contractType === "Salaried Full-Time" && (
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-800">
                        Monthly Base Retainer / Salary
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">1 Month</td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        ₹{settlement.baseSalaryOrRetainer.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">₹0</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        ₹{settlement.baseSalaryOrRetainer.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )}
                  {settlement.totalOpdConsultations > 0 && (
                    <tr>
                      <td className="py-2 px-3 font-sans">
                        <div className="font-semibold text-slate-800">Outpatient (OPD) Consultations</div>
                        <div className="text-[10px] text-slate-500">
                          {settlement.contractType === "Salaried Full-Time"
                            ? "Formulary & Institutional OP Consultations"
                            : "Agreed Fee Split per Consultation Token"}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">
                        {settlement.totalOpdConsultations}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-700">
                        ₹{settlement.grossOpdCollections.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        ₹{(settlement.grossOpdCollections - settlement.doctorOpdEarnings).toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        ₹{settlement.doctorOpdEarnings.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )}
                  {settlement.totalSurgeries > 0 && (
                    <tr>
                      <td className="py-2 px-3 font-sans">
                        <div className="font-semibold text-slate-800">Inpatient (IPD) Surgical Procedures &amp; OT</div>
                        <div className="text-[10px] text-slate-500">
                          Major Surgical Cases &amp; Cath Lab Interventions
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">
                        {settlement.totalSurgeries}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-700">
                        ₹{settlement.grossSurgeryCollections.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        ₹{(settlement.grossSurgeryCollections - settlement.doctorSurgeryEarnings).toLocaleString("en-IN")}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        ₹{settlement.doctorSurgeryEarnings.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Itemized Audit Log */}
            {settlement.itemizedEncounters.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Clinical Encounter Sample Audit Trail
                </div>
                <table className="w-full text-left text-[11px] border-collapse bg-slate-50/50 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="border-b border-slate-200 text-[9px] font-bold text-slate-500 uppercase bg-slate-100">
                      <th className="py-2 px-2.5">Date</th>
                      <th className="py-2 px-2.5">Patient &amp; UHID</th>
                      <th className="py-2 px-2.5">Procedure / Case</th>
                      <th className="py-2 px-2.5 text-right">Billed (₹)</th>
                      <th className="py-2 px-2.5 text-right">Doctor Cut (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[10.5px]">
                    {settlement.itemizedEncounters.map((enc) => (
                      <tr key={enc.id}>
                        <td className="py-1.5 px-2.5 text-slate-600">{enc.date}</td>
                        <td className="py-1.5 px-2.5 font-sans">
                          <span className="font-semibold text-slate-800">{enc.patientName}</span>
                          <span className="text-[9px] text-slate-400 font-mono ml-1.5">({enc.uhid})</span>
                        </td>
                        <td className="py-1.5 px-2.5 font-sans text-slate-700">
                          {enc.procedureName || enc.caseType}
                        </td>
                        <td className="py-1.5 px-2.5 text-right text-slate-600">
                          ₹{enc.totalCharged.toLocaleString("en-IN")}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-bold text-teal-900">
                          ₹{enc.doctorShare.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Financial Summary & TDS Box */}
            <div className="border-t-2 border-slate-900 pt-3 flex items-start justify-between text-xs">
              <div className="max-w-xs space-y-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Statutory &amp; Banking Details:
                </span>
                <p className="text-[11px] text-slate-600">
                  Payment Mode: <strong className="text-slate-900">{settlement.paymentMode}</strong>
                  {settlement.transactionRef && (
                    <span className="block font-mono text-[10px] text-teal-800 font-bold mt-0.5">
                      Ref: {settlement.transactionRef}
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  * TDS is withheld under Section 194J of Income Tax Act (10% on professional &amp; technical fees). Form 16A will be credited to PAN {settlement.panNumber} on quarterly filing.
                </p>
              </div>

              <div className="w-64 space-y-1 text-right font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Doctor Earnings:</span>
                  <span>₹{settlement.grossEarnings.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>TDS Deducted (10% u/s 194J):</span>
                  <span>-₹{settlement.tdsDeduction.toLocaleString("en-IN")}</span>
                </div>
                {settlement.otherDeductions > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Other Deductions:</span>
                    <span>-₹{settlement.otherDeductions.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200 text-[11px]">
                  <span>Hospital Retained Revenue:</span>
                  <span className="text-teal-800 font-bold">₹{settlement.hospitalShareRetained.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                  <span>Net Disbursable:</span>
                  <span className="text-base text-teal-900">₹{settlement.netPayable.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Statutory Signatures */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="border-b border-slate-300 pb-1 h-10 flex items-end justify-center font-serif italic text-slate-700">
                  Ramesh Sharma
                </div>
                <div className="pt-1.5 font-bold text-slate-900 text-[11px]">Chief Financial Officer / Accountant</div>
                <div className="text-[10px] text-slate-500">Prepared &amp; Verified</div>
              </div>

              <div>
                <div className="border-b border-slate-300 pb-1 h-10 flex items-end justify-center font-serif italic text-teal-800">
                  Dr. Bhargav, MD DM
                </div>
                <div className="pt-1.5 font-bold text-slate-900 text-[11px]">Medical Superintendent / CMO</div>
                <div className="text-[10px] text-slate-500">Clinical Audit Approved</div>
              </div>

              <div>
                <div className="border-b border-slate-300 pb-1 h-10 flex items-end justify-center font-serif italic text-slate-500 text-[11px]">
                  {settlement.doctorName}
                </div>
                <div className="pt-1.5 font-bold text-slate-900 text-[11px]">Consultant Signature</div>
                <div className="text-[10px] text-slate-500">Payee Acknowledgment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
