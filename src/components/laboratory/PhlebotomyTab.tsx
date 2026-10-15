"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Search,
  Barcode,
  Printer,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { LabOrder } from "@/types";

interface PhlebotomyTabProps {
  orders: LabOrder[];
  onCollectSample: (order: LabOrder) => void;
  onPrintBarcode: (order: LabOrder) => void;
}

export const PhlebotomyTab: React.FC<PhlebotomyTabProps> = ({
  orders,
  onCollectSample,
  onPrintBarcode,
}) => {
  const [barcodeSearch, setBarcodeSearch] = useState("");
  const [selectedPhlebotomist, setSelectedPhlebotomist] = useState("Rajesh Kumar (Sr. Phleb)");

  // Filter pending sample collection orders
  const pendingCollectionOrders = orders.filter(
    (o) => o.status === "Pending Sample"
  );

  // Recently collected orders
  const recentCollectedOrders = orders.filter(
    (o) => o.status === "Sample Collected" || o.status === "In Analysis"
  );

  const tubeGuide = [
    {
      color: "Purple / Lavender",
      additive: "K2-EDTA",
      tests: "CBC, HbA1c, ESR, Blood Group",
      dept: "Hematology",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      dot: "bg-purple-600",
    },
    {
      color: "Red / Gold",
      additive: "SST Gel Clot Activator",
      tests: "Lipid, LFT, KFT, Thyroid, Serology",
      dept: "Biochemistry",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      dot: "bg-amber-600",
    },
    {
      color: "Light Blue",
      additive: "Sodium Citrate 3.2%",
      tests: "PT/INR, APTT, D-Dimer",
      dept: "Coagulation",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      dot: "bg-sky-600",
    },
    {
      color: "Grey",
      additive: "Sodium Fluoride",
      tests: "Fasting & PP Blood Glucose",
      dept: "Biochemistry",
      badgeColor: "bg-slate-200 text-slate-800 border-slate-300",
      dot: "bg-slate-500",
    },
    {
      color: "Yellow Sterile",
      additive: "No Additive (Sterile Container)",
      tests: "Urine Routine & Microscopy",
      dept: "Clinical Pathology",
      badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
      dot: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner: Phlebotomy Station & Tube Barcode Scanner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <FlaskConical className="w-3.5 h-3.5" />
              Central Phlebotomy & Sample Reception Desk
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Specimen Collection & Barcode Labeling
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Scan patient barcode or token to quickly identify requested tubes, verify patient identity, and print specimen barcodes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-teal-300 shrink-0" />
              <input
                type="text"
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                placeholder="Scan / Type Barcode or Order..."
                className="bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none w-48 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Tube Guide Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-700" />
            Standard Vacutainer Tube Color Protocols (WHO / CLSI Guidelines)
          </span>
          <span className="text-[11px] text-slate-500">Order of Draw: Blue $\rightarrow$ Gold $\rightarrow$ Purple $\rightarrow$ Grey</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {tubeGuide.map((tube, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${tube.dot}`}></span>
                  {tube.color}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{tube.dept}</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-700">{tube.additive}</div>
              <div className="text-[10px] text-slate-500 mt-1 truncate" title={tube.tests}>
                {tube.tests}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Collection Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              Patients Awaiting Sample Collection
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
              {pendingCollectionOrders.length} Waiting
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Duty Phlebotomist:</span>
            <select
              value={selectedPhlebotomist}
              onChange={(e) => setSelectedPhlebotomist(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Rajesh Kumar (Sr. Phleb)">Rajesh Kumar (Sr. Phleb)</option>
              <option value="Sunita Devi (Phleb)">Sunita Devi (Phleb)</option>
              <option value="Anand Mohan (Lab Tech)">Anand Mohan (Lab Tech)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order / Barcode</th>
                <th className="py-3 px-4">Patient Demographics</th>
                <th className="py-3 px-4">Location / Ward</th>
                <th className="py-3 px-4">Required Vacutainers</th>
                <th className="py-3 px-4">Tests Ordered</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4 text-right">Phlebotomy Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingCollectionOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1.5" />
                    <p className="font-bold text-slate-700">All samples collected!</p>
                    <p className="text-xs text-slate-400">No patients waiting in phlebotomy queue.</p>
                  </td>
                </tr>
              ) : (
                pendingCollectionOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900">{order.orderNo}</div>
                      <div className="text-[11px] text-teal-700 font-semibold">{order.barcode}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{order.patientName}</div>
                      <div className="text-[11px] text-slate-500">
                        {order.age} / {order.gender} • <span className="font-mono text-slate-400">{order.mrId}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {order.source === "IPD" ? (
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {order.wardBed} (Bedside Draw)
                        </span>
                      ) : (
                        <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                          Phlebotomy Cabin 1
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {order.tests.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {t.tubeColor}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div className="font-medium text-slate-800 truncate">
                        {order.tests.map((t) => t.testName).join(", ")}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        ~12 min
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onPrintBarcode(order)}
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <Barcode className="w-3.5 h-3.5 text-slate-500" />
                          Barcode
                        </button>

                        <button
                          onClick={() => onCollectSample(order)}
                          className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Collected
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

      {/* Recently Collected / Dispatched to Analyzer Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Recently Collected Specimens In Transit to Analyzers ({recentCollectedOrders.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentCollectedOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {ord.orderNo}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold">
                    {ord.barcode}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 text-xs mt-1">
                  {ord.patientName} ({ord.age}/{ord.gender})
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {ord.tests.map((t) => t.testName).join(", ")}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Collected: {ord.sampleCollectedAt || "Recent"} by {ord.phlebotomist || "Rajesh K."}
                </div>
              </div>

              <button
                onClick={() => onPrintBarcode(ord)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg border border-slate-200 transition"
                title="Reprint Barcode"
              >
                <Barcode className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
