"use client";

import React from "react";
import { X, Printer, Barcode, QrCode } from "lucide-react";
import { LabOrder } from "@/types";

interface PrintBarcodeModalProps {
  order: LabOrder | null;
  onClose: () => void;
}

export const PrintBarcodeModal: React.FC<PrintBarcodeModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Barcode className="w-4 h-4 text-teal-800" />
            <span className="text-xs font-bold text-slate-800">
              Vacutainer Tube Barcode Sticker
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Label
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Label (50mm x 25mm thermal sticker simulation) */}
        <div className="p-6 bg-slate-100 flex flex-col items-center justify-center space-y-4">
          <div className="text-xs text-slate-500 font-medium">
            Thermal Label Preview (50mm × 25mm)
          </div>

          <div className="w-72 bg-white p-3.5 border-2 border-slate-800 rounded-xl shadow-md text-slate-900 font-mono text-[11px] space-y-1.5 print-container">
            <div className="flex items-center justify-between font-bold text-xs border-b border-slate-300 pb-1">
              <span>VitalSync LAB</span>
              <span>{order.orderNo}</span>
            </div>

            <div className="font-bold text-slate-900 text-xs">
              {order.patientName} ({order.age}/{order.gender})
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-600">
              <span>MR: {order.mrId}</span>
              <span>{order.source} {order.wardBed ? `• ${order.wardBed}` : ""}</span>
            </div>

            {/* Barcode Graphic Lines */}
            <div className="py-2 text-center">
              <div className="h-9 w-full flex items-center justify-center gap-[2px]">
                {[3, 1, 4, 1, 5, 2, 1, 3, 4, 2, 1, 3, 2, 4, 1, 3, 1, 5, 2, 1, 4, 2, 3, 1, 4, 1].map(
                  (weight, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 h-full"
                      style={{ width: `${weight * 1.5}px` }}
                    />
                  )
                )}
              </div>
              <div className="font-mono text-[11px] font-bold tracking-widest mt-0.5">
                {order.barcode}
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-200 pt-1">
              <span>{order.orderDate} {order.orderTime}</span>
              <span className="font-bold text-slate-800 truncate max-w-[120px]">
                {order.tests.map((t) => t.tubeColor.split(" ")[0]).join(", ")}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center max-w-xs">
            Standard barcode label compatible with Zebra, TSC & Citizen thermal barcode printers.
          </p>
        </div>
      </div>
    </div>
  );
};
