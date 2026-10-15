"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Clock,
  IndianRupee,
  Layers,
  FlaskConical,
  ChevronRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { LabCatalogItem, LabDepartment } from "@/types";
import { MOCK_LAB_CATALOG } from "@/data/labMockData";

interface TestCatalogTabProps {
  catalog?: LabCatalogItem[];
  onOrderTest?: (test: LabCatalogItem) => void;
}

export const TestCatalogTab: React.FC<TestCatalogTabProps> = ({
  catalog = MOCK_LAB_CATALOG,
  onOrderTest,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [expandedTestId, setExpandedTestId] = useState<string | null>("cat-1");

  const filteredTests = catalog.filter((test) => {
    if (selectedDept !== "All" && test.department !== selectedDept) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      test.name.toLowerCase().includes(q) ||
      test.code.toLowerCase().includes(q) ||
      test.department.toLowerCase().includes(q) ||
      test.sampleType.toLowerCase().includes(q) ||
      test.parameters.some((p) => p.name.toLowerCase().includes(q))
    );
  });

  const departments: (string | "All")[] = [
    "All",
    "Hematology",
    "Biochemistry",
    "Microbiology",
    "Serology",
    "Immunology",
    "Clinical Pathology",
    "Radiology / Imaging",
  ];

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Laboratory Diagnostic Test Directory & Tariffs
            </h3>
            <p className="text-xs text-slate-500">
              Browse diagnostic profiles, specimen collection requirements, biological reference intervals, and rates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              {filteredTests.length} Tests Available
            </span>
          </div>
        </div>

        {/* Search & Department Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by test name, CPT code, parameter (e.g. CBC, Troponin, LFT)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedDept === dept
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tests Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => {
          const isExpanded = expandedTestId === test.id;

          return (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between transition hover:border-slate-300"
            >
              <div className="p-4 space-y-3">
                {/* Header row: Code + Name + Price */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {test.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {test.department}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                      {test.name}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-slate-900 tracking-tight">
                      ₹{test.price}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Standard Tariff</div>
                  </div>
                </div>

                {/* Specimen & Turnaround Time Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-medium">Specimen & Tube</div>
                    <div className="font-semibold text-slate-800 truncate" title={test.sampleType}>
                      {test.sampleType}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{test.tubeColor}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-medium">Turnaround Time (TAT)</div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-700" />
                      {test.tatHours} Hours
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Automated Analyzer</div>
                  </div>
                </div>

                {/* Toggle Parameters Drawer */}
                <div>
                  <button
                    onClick={() =>
                      setExpandedTestId(isExpanded ? null : test.id)
                    }
                    className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 transition flex items-center justify-between"
                  >
                    <span>
                      Includes {test.parameters.length} Clinical Diagnostic Parameters
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden animate-in fade-in">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                            <th className="py-2 px-3">Parameter</th>
                            <th className="py-2 px-3">Unit</th>
                            <th className="py-2 px-3">Biological Ref. Range</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {test.parameters.map((p) => (
                            <tr key={p.id}>
                              <td className="py-2 px-3 font-medium text-slate-800">
                                {p.name}
                              </td>
                              <td className="py-2 px-3 text-slate-500 font-mono">
                                {p.unit || "-"}
                              </td>
                              <td className="py-2 px-3 text-slate-700 font-mono font-semibold">
                                {p.normalRange}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Order Button */}
              {onOrderTest && (
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    NABL MC-2941 Standardized
                  </span>
                  <button
                    onClick={() => onOrderTest(test)}
                    className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    Add to Requisition
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
