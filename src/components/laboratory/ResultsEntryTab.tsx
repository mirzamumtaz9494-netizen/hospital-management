"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Printer,
  Save,
  Award,
  Sparkles,
  UserCheck,
  Stethoscope,
  Info,
  Clock,
  Check,
} from "lucide-react";
import {
  LabOrder,
  LabParameterResult,
  LabTestParameter,
} from "@/types";
import { MOCK_LAB_CATALOG } from "@/data/labMockData";

interface ResultsEntryTabProps {
  orders: LabOrder[];
  onSaveResults: (orderId: string, updatedOrder: LabOrder) => void;
  onApproveOrder: (order: LabOrder) => void;
  onPrintReport: (order: LabOrder) => void;
}

export const ResultsEntryTab: React.FC<ResultsEntryTabProps> = ({
  orders,
  onSaveResults,
  onApproveOrder,
  onPrintReport,
}) => {
  // Orders ready for result entry or approval
  const analyzableOrders = orders.filter(
    (o) =>
      o.status === "Sample Collected" ||
      o.status === "In Analysis" ||
      o.status === "Pending Approval" ||
      o.status === "Completed"
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    analyzableOrders[0]?.id || ""
  );

  const activeOrder =
    analyzableOrders.find((o) => o.id === selectedOrderId) || analyzableOrders[0];

  // Local state for editable parameter values
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [pathologistNotes, setPathologistNotes] = useState<string>(
    activeOrder?.clinicalNotes ||
      "Clinical correlation advised. All controls within acceptable Westgard multi-rule limits."
  );

  // When order changes, populate parameter defaults
  const handleSelectOrder = (order: LabOrder) => {
    setSelectedOrderId(order.id);
    const initialMap: Record<string, string> = {};
    order.tests.forEach((t) => {
      if (t.results) {
        t.results.forEach((r) => {
          initialMap[r.parameterId] = r.value;
        });
      } else {
        // Fallback to catalog defaults
        const cat = MOCK_LAB_CATALOG.find((c) => c.code === t.testCode);
        if (cat) {
          cat.parameters.forEach((p) => {
            initialMap[p.id] = String(p.defaultValue || "");
          });
        }
      }
    });
    setParamValues(initialMap);
    setPathologistNotes(
      order.clinicalNotes ||
        "Clinical correlation advised. All controls within acceptable Westgard multi-rule limits."
    );
  };

  const handleParamChange = (paramId: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  // Determine abnormal flag based on catalog ranges
  const computeFlag = (
    param: LabTestParameter,
    valStr: string
  ): "Normal" | "High" | "Low" | "Critical" => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return "Normal";

    if (param.maxValue !== undefined && val > param.maxValue) {
      if (param.name.includes("Troponin") && val > 14) return "Critical";
      if (param.name.includes("Platelet") && val < 0.5) return "Critical";
      if (val > param.maxValue * 1.5) return "Critical";
      return "High";
    }
    if (param.minValue !== undefined && val < param.minValue) {
      if (val < param.minValue * 0.6) return "Critical";
      return "Low";
    }
    return "Normal";
  };

  const handleSaveDraft = () => {
    if (!activeOrder) return;
    // Build updated results
    const updatedTests = activeOrder.tests.map((t) => {
      const cat = MOCK_LAB_CATALOG.find((c) => c.code === t.testCode);
      const params = cat ? cat.parameters : [];
      const results: LabParameterResult[] = params.map((p) => {
        const val = paramValues[p.id] || String(p.defaultValue || "");
        const flag = computeFlag(p, val);
        return {
          parameterId: p.id,
          parameterName: p.name,
          unit: p.unit,
          normalRange: p.normalRange,
          value: val,
          flag,
        };
      });
      return {
        ...t,
        status: "In Analysis" as const,
        results,
      };
    });

    const updatedOrder: LabOrder = {
      ...activeOrder,
      status: "Pending Approval",
      tests: updatedTests,
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      technician: "Sr. Tech Priya M., M.Sc MLT",
      clinicalNotes: pathologistNotes,
    };

    onSaveResults(activeOrder.id, updatedOrder);
  };

  const handleApprove = () => {
    if (!activeOrder) return;
    handleSaveDraft();
    const approvedOrder: LabOrder = {
      ...activeOrder,
      status: "Completed",
      approvedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      approvedBy: "Dr. Bhargav, MD (Pathology) [Reg. KMC-58291]",
      clinicalNotes: pathologistNotes,
    };
    onApproveOrder(approvedOrder);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Worklist Queue of Orders (4 cols) */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Analyzer Workstation Queue
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
              {analyzableOrders.length} Orders
            </span>
          </div>

          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {analyzableOrders.map((ord) => {
              const isSelected = ord.id === activeOrder?.id;
              const hasStat = ord.priority === "Stat" || ord.priority === "Emergency";

              return (
                <div
                  key={ord.id}
                  onClick={() => handleSelectOrder(ord)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? "bg-teal-50/80 border-teal-600 shadow-xs"
                      : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">
                      {ord.orderNo}
                    </span>
                    {hasStat ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 animate-pulse">
                        STAT
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ord.barcode}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-slate-900 text-xs mt-1">
                    {ord.patientName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {ord.age}/{ord.gender} • {ord.source} {ord.wardBed ? `(${ord.wardBed})` : ""}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-600 font-medium truncate max-w-[140px]">
                      {ord.tests.map((t) => t.testName).join(", ")}
                    </span>
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded ${
                        ord.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "Pending Approval"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Clinical Parameter Worksheet & Sign-Off (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        {activeOrder ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
            {/* Header: Patient Banner */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-base">
                    {activeOrder.orderNo}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                    {activeOrder.barcode}
                  </span>
                  {activeOrder.priority === "Stat" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black animate-pulse">
                      STAT URGENT
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {activeOrder.patientName} • {activeOrder.age} Y / {activeOrder.gender} •{" "}
                  <span className="font-mono text-slate-500">{activeOrder.mrId}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Ref By: <span className="font-semibold text-slate-700">{activeOrder.referringDoctor}</span> •{" "}
                  {activeOrder.source} {activeOrder.wardBed ? `(${activeOrder.wardBed})` : ""}
                </div>
              </div>

              {/* Status & Top Action */}
              <div className="flex items-center gap-2">
                {activeOrder.status === "Completed" && (
                  <button
                    onClick={() => onPrintReport(activeOrder)}
                    className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Verified Report
                  </button>
                )}
              </div>
            </div>

            {/* Parameter Entry Worksheet */}
            <div className="p-5 space-y-6">
              {activeOrder.tests.map((test) => {
                const catalogItem = MOCK_LAB_CATALOG.find(
                  (c) => c.code === test.testCode
                );
                const parameters = catalogItem?.parameters || [];

                return (
                  <div key={test.id} className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {test.testName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                          {test.department}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        Specimen: {test.sampleType} ({test.tubeColor})
                      </span>
                    </div>

                    {/* Parameters Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                            <th className="py-2.5 px-3">Diagnostic Parameter</th>
                            <th className="py-2.5 px-3">Measured Value</th>
                            <th className="py-2.5 px-3">Unit</th>
                            <th className="py-2.5 px-3">Biological Ref. Interval</th>
                            <th className="py-2.5 px-3 text-center">Status Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parameters.map((param) => {
                            const currentVal =
                              paramValues[param.id] !== undefined
                                ? paramValues[param.id]
                                : String(param.defaultValue || "");
                            const flag = computeFlag(param, currentVal);

                            return (
                              <tr key={param.id} className="hover:bg-slate-50/50">
                                <td className="py-2.5 px-3 font-semibold text-slate-800">
                                  {param.name}
                                </td>

                                <td className="py-2.5 px-3 w-40">
                                  <input
                                    type="text"
                                    value={currentVal}
                                    onChange={(e) =>
                                      handleParamChange(param.id, e.target.value)
                                    }
                                    className={`w-full px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition focus:outline-none ${
                                      flag === "Critical"
                                        ? "border-rose-500 bg-rose-50/60 text-rose-900"
                                        : flag === "High"
                                        ? "border-amber-500 bg-amber-50/60 text-amber-900"
                                        : flag === "Low"
                                        ? "border-sky-500 bg-sky-50/60 text-sky-900"
                                        : "border-slate-200 bg-white text-slate-900 focus:border-teal-500"
                                    }`}
                                  />
                                </td>

                                <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                  {param.unit || "-"}
                                </td>

                                <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                                  {param.normalRange}
                                </td>

                                <td className="py-2.5 px-3 text-center">
                                  {flag === "Critical" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 animate-pulse border border-rose-300">
                                      CRITICAL
                                    </span>
                                  )}
                                  {flag === "High" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                      ▲ HIGH
                                    </span>
                                  )}
                                  {flag === "Low" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                                      ▼ LOW
                                    </span>
                                  )}
                                  {flag === "Normal" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Normal
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Pathologist Clinical Impression / Remarks */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pathologist Clinical Impression & Correlation Notes
                </label>
                <textarea
                  value={pathologistNotes}
                  onChange={(e) => setPathologistNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="Enter diagnostic impressions, smear comments, critical alerts..."
                />
              </div>

              {/* Electronic Signatures Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Award className="w-4 h-4 text-teal-700" />
                  <span>
                    Authorized Signatory:{" "}
                    <strong className="text-slate-900">Dr. Bhargav, MD (Pathology)</strong> • Reg. KMC-58291
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDraft}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 bg-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" />
                    Save Draft
                  </button>

                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify & Sign Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No order selected</p>
            <p className="text-xs text-slate-400">Select an order from the left worklist to enter parameter results.</p>
          </div>
        )}
      </div>
    </div>
  );
};
