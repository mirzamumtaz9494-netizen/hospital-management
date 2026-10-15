"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  Layers,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertOctagon,
  Pill,
  Building,
  SlidersHorizontal,
} from "lucide-react";
import { MedicineItem, MedicineCategory } from "@/types";

interface PharmacyInventoryTabProps {
  medicines: MedicineItem[];
  onAddMedicine: () => void;
  onAdjustStock: (medicine: MedicineItem) => void;
}

export const PharmacyInventoryTab: React.FC<PharmacyInventoryTabProps> = ({
  medicines,
  onAddMedicine,
  onAdjustStock,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredMedicines = medicines.filter((m) => {
    if (selectedCategory !== "All" && m.category !== selectedCategory) return false;
    if (statusFilter !== "All") {
      if (statusFilter === "Low Stock" && m.stockQuantity > m.minReorderLevel) return false;
      if (statusFilter === "Near Expiry" && m.status !== "Near Expiry") return false;
      if (statusFilter === "In Stock" && m.status !== "In Stock") return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.batchNo.toLowerCase().includes(q) ||
      m.manufacturer.toLowerCase().includes(q) ||
      m.rackLocation.toLowerCase().includes(q)
    );
  });

  const lowStockCount = medicines.filter(
    (m) => m.stockQuantity <= m.minReorderLevel
  ).length;

  const nearExpiryCount = medicines.filter(
    (m) => m.status === "Near Expiry"
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Banner / Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Hospital Drug Formulary &amp; Stock Inventory
            </h3>
            <p className="text-xs text-slate-500">
              Real-time batch tracking, expiration alerts, reorder thresholds, and schedule drug regulatory compliance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddMedicine}
              className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Filter Badges & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "All", label: "All Items", count: medicines.length },
              { id: "Low Stock", label: "Low Stock Alerts", count: lowStockCount, alert: true },
              { id: "Near Expiry", label: "Near Expiry (90d)", count: nearExpiryCount, warning: true },
              { id: "In Stock", label: "Adequate Stock", count: medicines.filter((m) => m.status === "In Stock").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  statusFilter === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : tab.alert
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    statusFilter === tab.id
                      ? "bg-teal-500/30 text-teal-300"
                      : tab.alert
                      ? "bg-rose-600 text-white"
                      : "bg-white text-slate-500 border border-slate-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulary or batch..."
              className="w-full pl-10 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Item Code</th>
                <th className="py-3 px-4">Brand &amp; Generic Formulation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Batch &amp; Expiry</th>
                <th className="py-3 px-4">Stock Qty</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Unit MRP</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((med) => {
                const isLowStock = med.stockQuantity <= med.minReorderLevel;
                const isNearExpiry = med.status === "Near Expiry";

                return (
                  <tr
                    key={med.id}
                    className={`hover:bg-slate-50 transition ${
                      isLowStock ? "bg-rose-50/20" : ""
                    }`}
                  >
                    {/* Item Code */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-slate-900">{med.code}</span>
                      <div className="text-[10px] text-slate-400 font-sans">{med.dosageForm}</div>
                    </td>

                    {/* Brand & Generic Formulation */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900">{med.name}</div>
                      <div className="text-[11px] text-slate-500 truncate" title={med.genericName}>
                        {med.genericName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Mfr: {med.manufacturer}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {med.category}
                      </span>
                    </td>

                    {/* Batch & Expiry */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-800">{med.batchNo}</div>
                      <div
                        className={`text-[10px] font-semibold mt-0.5 ${
                          isNearExpiry ? "text-purple-700 font-bold" : "text-slate-500"
                        }`}
                      >
                        Exp: {med.expiryDate}
                        {isNearExpiry && " (90d)"}
                      </div>
                    </td>

                    {/* Stock Qty */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-black text-xs ${
                            isLowStock ? "text-rose-600" : "text-slate-900"
                          }`}
                        >
                          {med.stockQuantity}
                        </span>
                        {isLowStock ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700 uppercase">
                            Low
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            / min {med.minReorderLevel}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Storage Location */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {med.rackLocation}
                    </td>

                    {/* Unit MRP */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{med.mrp}
                    </td>

                    {/* Regulatory Schedule */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          med.schedule === "Schedule H1"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : med.schedule === "Schedule H"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {med.schedule}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onAdjustStock(med)}
                          className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-bold text-[11px] transition"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
