"use client";

import React from "react";
import { X, Printer, Activity, Receipt } from "lucide-react";
import { OpBillItem } from "@/types";

interface PrintOpBillModalProps {
  bill: OpBillItem | null;
  onClose: () => void;
}

export const PrintOpBillModal: React.FC<PrintOpBillModalProps> = ({
  bill,
  onClose,
}) => {
  if (!bill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Controls */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800">
              Print Preview • Official OPD Cash Receipt / Tax Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt */}
        <div className="print-container p-8 sm:p-10 font-sans text-slate-900 bg-white text-xs">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-teal-700" />
                <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  CarePulse Multispecialty Hospital
                </h1>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Plot 42, Healthcare City, Jubilee Hills, Hyderabad • Ph: +91 040 2345 6789
              </p>
              <p className="text-[10px] text-slate-500">GSTIN: 36AAACG0000A1Z5 • Reg No: AP/HYD/MED/2026/094</p>
            </div>
            <div className="text-right">
              <span className="inline-block border border-slate-900 px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                OPD Cash Receipt
              </span>
              <p className="font-mono text-xs font-bold text-slate-900 mt-1">{bill.billNo}</p>
              <p className="text-[10px] text-slate-500">{bill.date} • {bill.time}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 mb-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-3 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Name:</span>
                <span className="font-bold text-slate-900">{bill.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">MR ID:</span>
                <span className="font-mono font-bold">{bill.mrId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">OP Token:</span>
                <span className="font-mono font-bold text-teal-800">{bill.opNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Doctor:</span>
                <span className="font-semibold">{bill.doctor}</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left border border-slate-300 mb-5">
            <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-300">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Service / Particulars</th>
                <th className="py-2 px-3">Dept</th>
                <th className="py-2 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2 px-3 font-mono">1</td>
                <td className="py-2 px-3 font-bold text-slate-900">Specialist OPD Consultation Fee</td>
                <td className="py-2 px-3 text-slate-600">{bill.department}</td>
                <td className="py-2 px-3 text-right font-mono font-bold">₹{bill.consultationFee}.00</td>
              </tr>
              {bill.labCharges > 0 && (
                <tr>
                  <td className="py-2 px-3 font-mono">2</td>
                  <td className="py-2 px-3 font-bold text-slate-900">Diagnostic Laboratory Investigations</td>
                  <td className="py-2 px-3 text-slate-600">Pathology</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">₹{bill.labCharges}.00</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-slate-900 bg-slate-50 font-bold">
              <tr>
                <td colSpan={3} className="py-2 px-3 text-right">Total Invoiced:</td>
                <td className="py-2 px-3 text-right font-mono">₹{bill.totalAmount}.00</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-1 px-3 text-right text-emerald-800">Amount Paid ({bill.paymentMode}):</td>
                <td className="py-1 px-3 text-right font-mono text-emerald-800">₹{bill.paidAmount}.00</td>
              </tr>
              {bill.balanceDue > 0 && (
                <tr className="text-amber-800">
                  <td colSpan={3} className="py-1 px-3 text-right">Balance Due:</td>
                  <td className="py-1 px-3 text-right font-mono">₹{bill.balanceDue}.00</td>
                </tr>
              )}
            </tfoot>
          </table>

          {/* Footer note & cashier sign */}
          <div className="pt-4 border-t border-slate-300 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-slate-500">Cashier: {bill.cashier}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Thank you. Computer Generated Official Receipt.</p>
            </div>
            <div className="text-right">
              <div className="w-28 border-b border-slate-800 mb-1"></div>
              <p className="text-[10px] font-bold text-slate-800">Authorized Cashier</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
