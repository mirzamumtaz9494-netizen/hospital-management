"use client";

import React from "react";
import {
  X,
  Printer,
  Pill,
  ShieldCheck,
  Receipt,
  FileCheck,
  QrCode,
} from "lucide-react";
import { PharmacyOrder } from "@/types";

interface PrintPharmacyBillModalProps {
  order: PharmacyOrder | null;
  onClose: () => void;
}

export const PrintPharmacyBillModal: React.FC<PrintPharmacyBillModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-800" />
            <span className="text-xs font-bold text-slate-800">
              Pharmacy Tax Invoice &amp; Retail Cash Memo (Form 20B/21B)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="print-container overflow-y-auto p-8 sm:p-10 font-sans text-slate-900 bg-white space-y-5">
          {/* 1. Hospital Pharmacy Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                  CP
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                    CarePulse Multispecialty Hospital
                  </h1>
                  <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                    Central Clinical &amp; Inpatient Pharmacy • 24/7 Dispensing
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Metro Health City, Road No. 12, Banjara Hills, Hyderabad • Phone: +91 40 6822 9911
              </p>
            </div>

            <div className="text-right text-[10px] text-slate-600 font-mono space-y-0.5">
              <div className="font-bold text-slate-900 text-xs">RETAIL TAX INVOICE</div>
              <div>DL No: <strong className="text-slate-800">TG/HYD/2026/84920 (20B, 21B)</strong></div>
              <div>GSTIN: <strong className="text-slate-800">36AAACC1206M1ZP</strong></div>
              <div>FSSAI: 13622011000492</div>
            </div>
          </div>

          {/* 2. Patient & Invoice Meta Table */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
            <div className="space-y-1">
              <div>
                <span className="text-slate-500 text-[11px]">Patient Name:</span>{" "}
                <strong className="text-slate-900 font-bold text-sm">
                  {order.patientName}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Age / Gender:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {order.age} Y / {order.gender}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Patient MR ID:</span>{" "}
                <span className="font-mono font-bold text-slate-900">{order.mrId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Care Stream:</span>{" "}
                <span className="font-semibold text-teal-800">{order.source}</span>
                {order.wardBed && ` • ${order.wardBed}`}
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div>
                <span className="text-slate-500 text-[11px]">Bill / Invoice No:</span>{" "}
                <strong className="font-mono text-slate-900 font-bold">
                  {order.billNumber || "PHB-5011"}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Rx Reference:</span>{" "}
                <span className="font-mono font-bold text-slate-800">{order.rxNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Prescribed By:</span>{" "}
                <span className="font-semibold text-slate-800">{order.prescribingDoctor}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Date &amp; Time:</span>{" "}
                <span className="font-mono text-slate-700">{order.orderDate} {order.orderTime}</span>
              </div>
            </div>
          </div>

          {/* 3. Itemized Medicines Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 font-bold uppercase text-[10px] text-slate-500">
                <th className="py-2 px-1">#</th>
                <th className="py-2 px-2">Brand &amp; Generic Formulation</th>
                <th className="py-2 px-2 font-mono">Batch</th>
                <th className="py-2 px-2 font-mono">Exp.</th>
                <th className="py-2 px-2 text-center">Qty</th>
                <th className="py-2 px-2 text-right">Rate</th>
                <th className="py-2 px-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2 px-1 text-slate-400 font-sans">{idx + 1}</td>
                  <td className="py-2 px-2 font-sans">
                    <div className="font-bold text-slate-900">{item.medicineName}</div>
                    <div className="text-[10px] text-slate-500">{item.genericName}</div>
                  </td>
                  <td className="py-2 px-2 text-slate-700 text-[11px]">{item.batchNo}</td>
                  <td className="py-2 px-2 text-slate-700 text-[11px]">{item.expiryDate}</td>
                  <td className="py-2 px-2 text-center font-bold text-slate-900 text-xs">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-2 text-right text-slate-700 text-[11px]">
                    ₹{item.unitPrice.toFixed(1)}
                  </td>
                  <td className="py-2 px-2 text-right font-black text-slate-900 text-xs">
                    ₹{Math.round(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 4. Financial Totals */}
          <div className="border-t-2 border-slate-900 pt-3 flex items-start justify-between text-xs">
            <div className="max-w-xs space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                Payment Information:
              </span>
              <p className="text-slate-600">
                Mode: <strong className="text-slate-900">{order.paymentMode}</strong> ({order.paymentStatus})
              </p>
              <p className="text-[10px] text-slate-500 italic">
                Schedule H1 / H Drug Compliance: Sold strictly on valid medical prescription.
              </p>
            </div>

            <div className="w-56 space-y-1 text-right font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (12%):</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-300">
                <span>Net Payable:</span>
                <span className="text-lg">₹{Math.round(order.netTotal)}</span>
              </div>
            </div>
          </div>

          {/* 5. Regulatory Warning & Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 items-end text-xs">
            <div>
              <div className="text-[9px] text-slate-400 font-mono">
                Goods once sold cannot be returned without original cash receipt.
                <br />
                Store medicines below 25°C away from direct sunlight.
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-teal-900 text-sm font-bold">
                V. Murthy
              </div>
              <div className="border-t border-slate-400 pt-1 mt-1 font-bold text-slate-900 text-xs">
                V. Murthy, B.Pharm
              </div>
              <div className="text-[10px] text-slate-500">
                Registered Pharmacist • Reg No: TS-48291
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
