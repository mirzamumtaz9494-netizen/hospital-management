"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Printer,
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  MoreHorizontal,
  Download,
  Calendar,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { PharmacyOrder, PharmacyDispenseStatus } from "@/types";

interface PharmacyDispensingTabProps {
  orders: PharmacyOrder[];
  onSelectOrder: (order: PharmacyOrder) => void;
  onDispenseOrder: (order: PharmacyOrder) => void;
  onPrintBill: (order: PharmacyOrder) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  RK: "bg-teal-100 text-teal-700",
  LD: "bg-blue-100 text-blue-700",
  SS: "bg-amber-100 text-amber-700",
  MJ: "bg-rose-100 text-rose-700",
  DV: "bg-cyan-100 text-cyan-700",
  DEFAULT: "bg-slate-100 text-slate-700",
};

export const PharmacyDispensingTab: React.FC<PharmacyDispensingTabProps> = ({
  orders,
  onSelectOrder,
  onDispenseOrder,
  onPrintBill,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== "All" && order.dispenseStatus !== selectedStatus) return false;
    if (selectedSource !== "All" && order.source !== selectedSource) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.rxNumber.toLowerCase().includes(q) ||
      (order.billNumber && order.billNumber.toLowerCase().includes(q)) ||
      order.patientName.toLowerCase().includes(q) ||
      order.mrId.toLowerCase().includes(q) ||
      order.prescribingDoctor.toLowerCase().includes(q) ||
      order.items.some((i) => i.medicineName.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: PharmacyDispenseStatus) => {
    switch (status) {
      case "Pending Dispense":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending Dispense
          </span>
        );
      case "Ready for Pickup":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Ready for Pickup
          </span>
        );
      case "Dispensed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Dispensed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getSourceBadge = (source: string, wardBed?: string) => {
    switch (source) {
      case "IPD":
        return (
          <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-semibold">
            IPD • {wardBed || "Ward"}
          </span>
        );
      case "Emergency":
        return (
          <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-semibold">
            Emergency ER
          </span>
        );
      case "Retail Walk-in":
        return (
          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold">
            Retail POS
          </span>
        );
      default:
        return (
          <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[10px] font-semibold">
            OPD Clinic
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 6 Pharmacy Operations KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Today&apos;s Pharmacy Sales</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">₹1,20,000</div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">▲ 9.0% vs yesterday</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Prescriptions</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">148</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">OPD + IPD + Retail</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Pending Dispense</div>
          <div className="text-2xl font-black text-amber-600 tracking-tight">12</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Awaiting Packing</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Low Stock Alerts</div>
          <div className="text-2xl font-black text-rose-600 tracking-tight flex items-center gap-1.5">
            2
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">Atorva 10, Azithral</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Near Expiry (90d)</div>
          <div className="text-2xl font-black text-purple-600 tracking-tight">4</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">First-Exp, First-Out</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Formulary Drugs</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">840</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">100% Barcoded</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs space-y-3">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "All", label: "All Orders", count: orders.length },
            { id: "Pending Dispense", label: "Pending Dispense", count: orders.filter((o) => o.dispenseStatus === "Pending Dispense").length },
            { id: "Ready for Pickup", label: "Ready for Pickup", count: orders.filter((o) => o.dispenseStatus === "Ready for Pickup").length },
            { id: "Dispensed", label: "Dispensed", count: orders.filter((o) => o.dispenseStatus === "Dispensed").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                selectedStatus === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedStatus === tab.id
                    ? "bg-teal-500/30 text-teal-300"
                    : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Care Stream Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Rx No, Bill No, Patient Name, MR ID, or Medicine..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Care Streams</option>
              <option value="OPD">OPD Outpatient</option>
              <option value="IPD">IPD Inpatient Wards</option>
              <option value="Emergency">Emergency ER</option>
              <option value="Retail Walk-in">Retail Walk-in</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Rx No / Bill</th>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Stream / Ward</th>
                <th className="py-3 px-4">Prescribed Medicines</th>
                <th className="py-3 px-4">Prescriber</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Pill className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm text-slate-600">No prescriptions found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or search query</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const avatarClass =
                    AVATAR_COLORS[order.initials] || AVATAR_COLORS.DEFAULT;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectOrder(order)}
                    >
                      {/* Rx No & Bill */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition">
                          {order.rxNumber}
                        </div>
                        {order.billNumber && (
                          <div className="text-[11px] text-teal-800 font-semibold mt-0.5">
                            {order.billNumber}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {order.orderTime}
                        </div>
                      </td>

                      {/* Patient Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs ${avatarClass}`}
                          >
                            {order.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {order.patientName}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {order.age} / {order.gender} • <span className="font-mono text-slate-400">{order.mrId}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stream / Location */}
                      <td className="py-3.5 px-4">
                        {getSourceBadge(order.source, order.wardBed)}
                      </td>

                      {/* Prescribed Medicines */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="font-medium text-slate-800 text-[11px] truncate flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                              <span className="truncate">{item.medicineName}</span>
                              <span className="text-slate-400 text-[10px] font-mono shrink-0">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Prescriber */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {order.prescribingDoctor}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {order.orderDate}
                        </div>
                      </td>

                      {/* Total Amount & Payment */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-black text-slate-900 text-xs">
                          ₹{order.netTotal.toFixed(0)}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500">
                          {order.paymentStatus} • {order.paymentMode}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.dispenseStatus)}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {order.dispenseStatus === "Pending Dispense" && (
                            <button
                              onClick={() => onDispenseOrder(order)}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                              title="Dispense Medications"
                            >
                              <Pill className="w-3.5 h-3.5" />
                              Dispense
                            </button>
                          )}

                          {order.dispenseStatus === "Ready for Pickup" && (
                            <button
                              onClick={() => onDispenseOrder(order)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                              title="Handover to Patient"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Handover
                            </button>
                          )}

                          <button
                            onClick={() => onPrintBill(order)}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                            title="Print Pharmacy Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-teal-700" />
                            Bill
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredOrders.length}</span> of{" "}
            <span className="font-bold text-slate-800">{orders.length}</span> prescriptions
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
              Prev
            </button>
            <button className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-bold">1</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
