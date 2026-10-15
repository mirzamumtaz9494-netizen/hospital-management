"use client";

import React, { useState } from "react";
import {
  X,
  FlaskConical,
  Barcode,
  CheckCircle2,
  Clock,
  Printer,
  ArrowRight,
  FileText,
} from "lucide-react";
import { LabOrder } from "@/types";

interface SampleCollectionModalProps {
  isOpen?: boolean;
  order: LabOrder | null;
  onClose: () => void;
  onConfirmCollection: (
    orderId: string,
    phlebotomist: string,
    nextAction?: "barcode" | "results" | "queue"
  ) => void;
  onPrintBarcode: (order: LabOrder) => void;
}

export const SampleCollectionModal: React.FC<SampleCollectionModalProps> = ({
  isOpen = true,
  order,
  onClose,
  onConfirmCollection,
  onPrintBarcode,
}) => {
  const [phlebotomist, setPhlebotomist] = useState("Rajesh Kumar (Sr. Phleb)");
  const [collectionSite, setCollectionSite] = useState("Left Antecubital Fossa");

  if (!order || isOpen === false) return null;

  const handleAction = (nextAction: "barcode" | "results" | "queue") => {
    onConfirmCollection(order.id, phlebotomist, nextAction);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
              <FlaskConical className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Confirm Specimen Sample Collection
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {order.orderNo} • {order.barcode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Patient Details banner */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-sm">{order.patientName}</div>
              <div className="text-slate-500 text-[11px]">
                {order.age} Y / {order.gender} • <span className="font-mono">{order.mrId}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-teal-100 text-teal-800">
                {order.source} {order.wardBed ? `(${order.wardBed})` : ""}
              </span>
            </div>
          </div>

          {/* Required Vacutainer Tubes */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">
              Required Specimen Tubes to Draw:
            </label>
            <div className="space-y-1.5">
              {order.tests.map((t, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-600 shrink-0"></span>
                    <span className="font-bold text-slate-800">{t.testName}</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                    {t.tubeColor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Collector input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Phlebotomist Name
              </label>
              <select
                value={phlebotomist}
                onChange={(e) => setPhlebotomist(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="Rajesh Kumar (Sr. Phleb)">Rajesh Kumar (Sr. Phleb)</option>
                <option value="Sunita Devi (Phleb)">Sunita Devi (Phleb)</option>
                <option value="Anand Mohan (Lab Tech)">Anand Mohan (Lab Tech)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Venipuncture Site
              </label>
              <input
                type="text"
                value={collectionSite}
                onChange={(e) => setCollectionSite(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Next Step Options */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Next Workflow Step:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAction("barcode")}
                className="p-2.5 bg-white border border-teal-600 hover:bg-teal-50 text-teal-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Barcode className="w-4 h-4 text-teal-700" />
                <span>Confirm & Print Barcode</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction("results")}
                className="p-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Confirm & Go to Results</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleAction("queue")}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Confirm Sample Drawn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
