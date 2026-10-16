"use client";

import React from "react";
import { X, Printer, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { WardIndent } from "@/types";

interface PrintWardIndentSlipModalProps {
  indent: WardIndent | null;
  onClose: () => void;
}

export const PrintWardIndentSlipModal: React.FC<PrintWardIndentSlipModalProps> = ({
  indent,
  onClose,
}) => {
  if (!indent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-800" />
            <span className="text-xs font-bold text-slate-800">
              Inpatient Ward Medication Issue Slip
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="print-container overflow-y-auto p-8 font-sans text-slate-900 bg-white space-y-4">
          <div className="border-b-2 border-slate-900 pb-3 text-center">
            <h2 className="text-base font-black uppercase text-slate-900">
              VitalSync Multispecialty Hospital
            </h2>
            <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Ward Floor Stock Drug Issue Slip &amp; Nurse MAR Voucher
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-3">
            <div>
              <div><span className="text-slate-500">Indent No:</span> <strong className="font-mono">{indent.indentNo}</strong></div>
              <div><span className="text-slate-500">Ward:</span> <strong>{indent.wardName}</strong></div>
              <div><span className="text-slate-500">Requested By:</span> {indent.requestedByNurse}</div>
            </div>
            <div className="text-right">
              <div><span className="text-slate-500">Date/Time:</span> {indent.requestedAt}</div>
              <div><span className="text-slate-500">Priority:</span> <span className="font-bold">{indent.priority}</span></div>
              <div><span className="text-slate-500">Status:</span> {indent.status}</div>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 font-bold uppercase text-[10px] text-slate-500">
                <th className="py-2">Item Description</th>
                <th className="py-2 font-mono">Batch</th>
                <th className="py-2 text-center">Req.</th>
                <th className="py-2 text-center">Issued</th>
                <th className="py-2 text-right">Rate</th>
                <th className="py-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {indent.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 font-semibold text-slate-900">{item.medicineName}</td>
                  <td className="py-2 font-mono text-[11px] text-slate-600">{item.batchNo}</td>
                  <td className="py-2 text-center font-mono">{item.requestedQty}</td>
                  <td className="py-2 text-center font-mono font-bold text-slate-900">{item.issuedQty}</td>
                  <td className="py-2 text-right font-mono">₹{item.unitPrice}</td>
                  <td className="py-2 text-right font-mono font-bold">
                    ₹{item.issuedQty * item.unitPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-slate-900 pt-3 flex justify-between text-xs">
            <span className="font-bold text-slate-700">Total Indent Valuation:</span>
            <span className="font-mono font-black text-sm text-slate-900">
              ₹{indent.totalCost.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-xs">
            <div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                Issued By (Pharmacist)
              </div>
            </div>
            <div className="text-right">
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                Received By (Ward Incharge Nurse)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
