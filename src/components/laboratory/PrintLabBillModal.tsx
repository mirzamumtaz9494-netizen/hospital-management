"use client";

import React from "react";
import { X, Printer, Activity, Receipt, IndianRupee } from "lucide-react";
import { LabBillItem } from "@/types";

interface PrintLabBillModalProps {
  bill: LabBillItem | null;
  onClose: () => void;
}

export const PrintLabBillModal: React.FC<PrintLabBillModalProps> = ({
  bill,
  onClose,
}) => {
  if (!bill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-800" />
            <span className="text-xs font-bold text-slate-800">
              Laboratory Diagnostics Cash Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
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

        {/* Printable Receipt Sheet */}
        <div className="print-container overflow-y-auto p-8 font-sans text-slate-900 bg-white space-y-5">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 text-center">
            <h2 className="text-lg font-black uppercase text-slate-900">
              CarePulse Multispecialty Hospital
            </h2>
            <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Diagnostic Laboratory Cash Receipt & Invoice
            </p>
            <p className="text-[10px] text-slate-500">
              Metro Health City, Hyderabad • GSTIN: 36AAACC1206M1ZP
            </p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-3">
            <div>
              <div><span className="text-slate-500">Bill No:</span> <strong className="font-mono">{bill.billNo}</strong></div>
              <div><span className="text-slate-500">Order No:</span> <span className="font-mono">{bill.orderNo}</span></div>
              <div><span className="text-slate-500">Date/Time:</span> {bill.date} {bill.time}</div>
            </div>
            <div className="text-right">
              <div><span className="text-slate-500">Patient:</span> <strong>{bill.patientName}</strong></div>
              <div><span className="text-slate-500">MR ID:</span> <span className="font-mono">{bill.mrId}</span></div>
              <div><span className="text-slate-500">Ref. Doctor:</span> {bill.doctor}</div>
            </div>
          </div>

          {/* Itemized Investigations */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 font-bold uppercase text-[10px] text-slate-500">
                <th className="py-2">#</th>
                <th className="py-2">Investigation Description</th>
                <th className="py-2">Department</th>
                <th className="py-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bill.tests.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2 font-semibold text-slate-900">{item.testName}</td>
                  <td className="py-2 text-slate-500">{item.department}</td>
                  <td className="py-2 text-right font-mono font-bold">₹{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t-2 border-slate-900 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Total:</span>
              <span className="font-mono font-semibold">₹{bill.totalCost}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Special Discount:</span>
                <span className="font-mono font-semibold">-₹{bill.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Net Amount Paid:</span>
              <span className="font-mono text-base">₹{bill.netPayable}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Payment Mode:</span>
              <span className="font-bold text-slate-800">{bill.paymentMode}</span>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <div className="text-[10px] text-slate-400">
              Computer Generated Diagnostic Cash Invoice • No signature required
            </div>
            <div className="text-right">
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                Cashier / Front Desk
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
