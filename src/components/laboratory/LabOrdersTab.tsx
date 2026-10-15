"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Printer,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Eye,
  MoreHorizontal,
  FlaskConical,
  Barcode,
  ArrowUpDown,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  LabOrder,
  LabOrderStatus,
  LabDepartment,
  LabPriority,
} from "@/types";

interface LabOrdersTabProps {
  orders: LabOrder[];
  onSelectOrder: (order: LabOrder) => void;
  onCollectSample: (order: LabOrder) => void;
  onEnterResults: (order: LabOrder) => void;
  onPrintReport: (order: LabOrder) => void;
  onPrintBarcode: (order: LabOrder) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  LD: "bg-blue-100 text-blue-700",
  RK: "bg-teal-100 text-teal-700",
  IQ: "bg-violet-100 text-violet-700",
  SS: "bg-amber-100 text-amber-700",
  HP: "bg-rose-100 text-rose-700",
  DV: "bg-cyan-100 text-cyan-700",
  MJ: "bg-emerald-100 text-emerald-700",
  DEFAULT: "bg-slate-100 text-slate-700",
};

export const LabOrdersTab: React.FC<LabOrdersTabProps> = ({
  orders,
  onSelectOrder,
  onCollectSample,
  onEnterResults,
  onPrintReport,
  onPrintBarcode,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (selectedStatus !== "All" && order.status !== selectedStatus) return false;
    // Dept filter
    if (selectedDept !== "All") {
      const hasDept = order.tests.some((t) => t.department === selectedDept);
      if (!hasDept) return false;
    }
    // Priority filter
    if (selectedPriority !== "All" && order.priority !== selectedPriority) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.orderNo.toLowerCase().includes(q) ||
      order.barcode.toLowerCase().includes(q) ||
      order.patientName.toLowerCase().includes(q) ||
      order.mrId.toLowerCase().includes(q) ||
      order.opIpNo.toLowerCase().includes(q) ||
      order.referringDoctor.toLowerCase().includes(q) ||
      order.tests.some((t) => t.testName.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: LabOrderStatus) => {
    switch (status) {
      case "Pending Sample":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending Sample
          </span>
        );
      case "Sample Collected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Sample Collected
          </span>
        );
      case "In Analysis":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
            In Analysis
          </span>
        );
      case "Pending Approval":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Pending Approval
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
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

  const getPriorityBadge = (priority: LabPriority) => {
    if (priority === "Stat" || priority === "Emergency") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-300 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
          STAT / URGENT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-500 bg-slate-100">
        Routine
      </span>
    );
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
      case "Walk-in":
        return (
          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold">
            Walk-in Lab
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
      {/* 6 Diagnostic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Total Tests Today</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">186</div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">▲ 12.4% vs yesterday</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Pending Collection</div>
          <div className="text-2xl font-black text-amber-600 tracking-tight">24</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Phlebotomy room</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">In Analysis</div>
          <div className="text-2xl font-black text-violet-600 tracking-tight">38</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Auto-analyzers active</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Pending Approval</div>
          <div className="text-2xl font-black text-purple-600 tracking-tight">18</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">Awaiting Pathologist</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Completed & Signed</div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">106</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Ready for Print / SMS</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium mb-1">Critical Alerts</div>
          <div className="text-2xl font-black text-rose-600 tracking-tight flex items-center gap-1.5">
            5
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="text-[11px] text-rose-700 font-bold mt-1">Immediate Doctor Call</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs space-y-3">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "All", label: "All Orders", count: orders.length },
            { id: "Pending Sample", label: "Pending Collection", count: orders.filter((o) => o.status === "Pending Sample").length },
            { id: "Sample Collected", label: "Collected", count: orders.filter((o) => o.status === "Sample Collected").length },
            { id: "In Analysis", label: "In Analysis", count: orders.filter((o) => o.status === "In Analysis").length },
            { id: "Pending Approval", label: "Pending Approval", count: orders.filter((o) => o.status === "Pending Approval").length },
            { id: "Completed", label: "Completed", count: orders.filter((o) => o.status === "Completed").length },
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

        {/* Search & Dropdown Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient name, Order No, MR ID, Barcode, or Test..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">All Departments</option>
              <option value="Hematology">Hematology</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Serology">Serology</option>
              <option value="Immunology">Immunology</option>
              <option value="Clinical Pathology">Clinical Pathology</option>
              <option value="Radiology / Imaging">Radiology / Imaging</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All">All Priorities</option>
              <option value="Routine">Routine</option>
              <option value="Stat">STAT / Urgent</option>
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
                <th className="py-3 px-4">Order / Barcode</th>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Tests Ordered</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FlaskConical className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm text-slate-600">No laboratory orders found</p>
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
                      {/* Order No & Barcode */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition">
                          {order.orderNo}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Barcode className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.barcode}</span>
                        </div>
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

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        {getSourceBadge(order.source, order.wardBed)}
                      </td>

                      {/* Tests Ordered */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {order.tests.map((t) => (
                            <div
                              key={t.id}
                              className="font-medium text-slate-800 text-[11px] truncate flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                              <span className="truncate">{t.testName}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                          ₹{order.totalAmount} • {order.paymentStatus}
                        </div>
                      </td>

                      {/* Referring Doctor */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {order.referringDoctor}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {order.orderDate}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        {getPriorityBadge(order.priority)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === "Pending Sample" && (
                            <button
                              onClick={() => onCollectSample(order)}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                              title="Collect Specimen Sample"
                            >
                              <FlaskConical className="w-3.5 h-3.5" />
                              Collect
                            </button>
                          )}

                          {(order.status === "Sample Collected" || order.status === "In Analysis") && (
                            <button
                              onClick={() => onEnterResults(order)}
                              className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                              title="Enter Clinical Parameter Results"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Results
                            </button>
                          )}

                          {order.status === "Pending Approval" && (
                            <button
                              onClick={() => onEnterResults(order)}
                              className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                              title="Review & Approve Report"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          )}

                          {order.status === "Completed" && (
                            <button
                              onClick={() => onPrintReport(order)}
                              className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                              title="Print Official Diagnostic Report"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Report
                            </button>
                          )}

                          {/* Print Barcode Label */}
                          <button
                            onClick={() => onPrintBarcode(order)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="Print Specimen Barcode Label"
                          >
                            <Barcode className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenDropdownId(
                                  openDropdownId === order.id ? null : order.id
                                )
                              }
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {openDropdownId === order.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-left text-xs animate-in zoom-in-95">
                                <button
                                  onClick={() => {
                                    onSelectOrder(order);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                                  View Order Info
                                </button>
                                <button
                                  onClick={() => {
                                    onPrintBarcode(order);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Barcode className="w-3.5 h-3.5 text-slate-500" />
                                  Print Barcode Label
                                </button>
                                <button
                                  onClick={() => {
                                    onPrintReport(order);
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                                  Print Lab Report
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredOrders.length}</span> of{" "}
            <span className="font-bold text-slate-800">{orders.length}</span> lab orders
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
