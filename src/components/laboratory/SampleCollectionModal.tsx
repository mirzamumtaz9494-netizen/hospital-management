"use client";

import React, { useState } from "react";
import {
  X,
  FlaskConical,
  Barcode,
  CheckCircle2,
  Clock,
  Printer,
} from "lucide-react";
import { LabOrder } from "@/types";

interface SampleCollectionModalProps {
  order: LabOrder | null;
  onClose: () => void;
  onConfirmCollection: (orderId: string, phlebotomist: string) => void;
  onPrintBarcode: (order: LabOrder) => void;
}

export const SampleCollectionModal: React.FC<SampleCollectionModalProps> = ({
  order,
  onClose,
  onConfirmCollection,
  onPrintBarcode,
}) => {
  const [phlebotomist, setPhlebotomist] = useState("Rajesh Kumar (Sr. Phleb)");
  const [collectionSite, setCollectionSite] = useState("Left Antecubital Fossa");

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCollection(order.id, phlebotomist);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
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
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
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

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onPrintBarcode(order)}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition flex items-center gap-1.5"
            >
              <Barcode className="w-3.5 h-3.5 text-slate-500" />
              Print Barcode Sticker
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Sample Drawn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
