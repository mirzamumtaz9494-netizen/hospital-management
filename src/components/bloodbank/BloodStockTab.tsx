"use client";

import React, { useState } from "react";
import {
  Droplet,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpDown,
  Building,
} from "lucide-react";
import { BloodInventoryUnit } from "@/types";
import { MOCK_BLOOD_STOCK_SUMMARY, BloodGroupStockSummary } from "@/data/bloodBankMockData";

interface BloodStockTabProps {
  bags: BloodInventoryUnit[];
  onReserveBag: (bagId: string) => void;
}

export const BloodStockTab: React.FC<BloodStockTabProps> = ({
  bags,
  onReserveBag,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [selectedComponent, setSelectedComponent] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBags = bags.filter((bag) => {
    if (selectedGroup !== "All" && bag.bloodGroup !== selectedGroup) return false;
    if (selectedComponent !== "All" && bag.component !== selectedComponent) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      bag.bagBarcode.toLowerCase().includes(q) ||
      bag.bloodGroup.toLowerCase().includes(q) ||
      bag.storageLocation.toLowerCase().includes(q) ||
      bag.donorName.toLowerCase().includes(q) ||
      (bag.crossmatchedPatient && bag.crossmatchedPatient.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* 8-Group Visual Stock Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
              Live Blood Group Stock Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Real-time inventory levels across all 8 ABO/Rh blood groups.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Adequate Stock
            </span>
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Moderate
            </span>
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              Critical Low
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {MOCK_BLOOD_STOCK_SUMMARY.map((item) => {
            const isSelected = selectedGroup === item.group;
            return (
              <button
                key={item.group}
                onClick={() => setSelectedGroup(isSelected ? "All" : item.group)}
                className={`p-3 rounded-2xl border text-center transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-rose-500 bg-rose-50/50 border-rose-300 shadow-sm"
                    : item.status === "Critical"
                    ? "bg-rose-50/80 border-rose-200 hover:border-rose-400"
                    : item.status === "Moderate"
                    ? "bg-amber-50/60 border-amber-200 hover:border-amber-400"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    {item.group}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      item.status === "Critical"
                        ? "bg-rose-600 text-white"
                        : item.status === "Moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="my-1">
                  <div className="text-2xl font-black text-slate-900 leading-none">
                    {item.totalUnits}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Units Avail.
                  </div>
                </div>

                <div className="w-full pt-1.5 border-t border-slate-100 text-[9px] text-slate-500 flex justify-between">
                  <span>PRBC: {item.prbc}</span>
                  <span>Plt: {item.platelets}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blood Bag Inventory Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Blood Bag Stock Ledger ({filteredBags.length} Bags)
            </h3>
            {selectedGroup !== "All" && (
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                Filtered: {selectedGroup}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search barcode, donor, shelf..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Component Filter */}
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Components</option>
              <option value="Packed Red Blood Cells (PRBC)">PRBC</option>
              <option value="Whole Blood">Whole Blood</option>
              <option value="Platelet Concentrate (RDP)">Platelets</option>
              <option value="Fresh Frozen Plasma (FFP)">FFP</option>
            </select>

            {/* Reset Filters */}
            {(selectedGroup !== "All" || selectedComponent !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGroup("All");
                  setSelectedComponent("All");
                  setSearchQuery("");
                }}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Bag Barcode</th>
                <th className="py-2.5 px-3.5">Blood Group</th>
                <th className="py-2.5 px-3.5">Component &amp; Vol</th>
                <th className="py-2.5 px-3.5">Collection Date</th>
                <th className="py-2.5 px-3.5">Expiry Date</th>
                <th className="py-2.5 px-3.5">Storage Location</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBags.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No blood units match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredBags.map((bag) => {
                  const isNearExpiry = bag.daysRemaining <= 7;
                  return (
                    <tr key={bag.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3.5 font-bold font-mono text-slate-900 flex items-center gap-2">
                        <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600 shrink-0" />
                        {bag.bagBarcode}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs bg-rose-50 text-rose-700 border border-rose-200">
                          {bag.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900">{bag.component}</div>
                        <div className="text-[10px] text-slate-400">{bag.volumeMl} mL</div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">{bag.collectionDate}</td>
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900">{bag.expiryDate}</div>
                        <div
                          className={`text-[10px] font-bold ${
                            isNearExpiry ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {bag.daysRemaining} days remaining
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 text-[11px]">
                        {bag.storageLocation}
                      </td>
                      <td className="py-3 px-3.5">
                        {bag.status === "Available" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Available
                          </span>
                        )}
                        {bag.status === "Reserved" && (
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Reserved
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">
                              {bag.crossmatchedPatient} ({bag.crossmatchedIpNo})
                            </span>
                          </div>
                        )}
                        {bag.status === "Transfused" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Transfused
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        {bag.status === "Available" ? (
                          <button
                            onClick={() => onReserveBag(bag.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer"
                          >
                            Reserve
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Locked</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
