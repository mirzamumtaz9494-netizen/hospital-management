"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Printer,
  Clock,
  Terminal,
  Lock,
  FileText,
  AlertTriangle,
  Info,
} from "lucide-react";
import { SystemAuditLogItem } from "@/types";

interface AuditLogTabProps {
  logs: SystemAuditLogItem[];
  onExportAuditLog: () => void;
  onPrintCertificate: () => void;
}

export const AuditLogTab: React.FC<AuditLogTabProps> = ({
  logs,
  onExportAuditLog,
  onPrintCertificate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedActionType, setSelectedActionType] = useState("All");

  const actionTypes = [
    "All",
    "User Access",
    "Financial Override",
    "Clinical Change",
    "Inventory Authorization",
    "System Config",
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    const matchesSeverity =
      selectedSeverity === "All" || log.severity === selectedSeverity;
    const matchesAction =
      selectedActionType === "All" || log.actionType === selectedActionType;
    return matchesSearch && matchesSeverity && matchesAction;
  });

  const criticalCount = logs.filter((l) => l.severity === "Critical").length;
  const warningCount = logs.filter((l) => l.severity === "Warning").length;

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Security Audit Trail
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            1,480 Events
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-teal-700 font-bold">Immutable hash</span> logged today
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              Critical Actions
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-800 tracking-tight">
            {criticalCount} Critical
          </div>
          <div className="text-xs text-rose-800 mt-1 font-semibold">
            Narcotics, code red, account lockout
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tamper Protection
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            SHA-256
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-blue-700 font-bold">Write-Once Ledger</span> enforced
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Network Perimeter
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            VLAN Isolated
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-700 font-bold">192.168.0.0/16</span> clinical intranet
          </div>
        </div>
      </div>

      {/* 2. Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail by user, role, IP, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              {actionTypes.map((a) => (
                <option key={a} value={a}>
                  {a === "All" ? "All Action Types" : a}
                </option>
              ))}
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Info">Info Only</option>
              <option value="Warning">Warning Only</option>
              <option value="Critical">Critical Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrintCertificate}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Certificate
          </button>
          <button
            onClick={onExportAuditLog}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Log
          </button>
        </div>
      </div>

      {/* 3. System Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              System Administrative &amp; Clinical Audit Log Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Regulatory tamper-proof event logs required under HIPAA Security Rule &amp; NABH MUM.5
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User &amp; Role</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Audit Description &amp; Resource</th>
                <th className="py-3 px-4">Origin IP</th>
                <th className="py-3 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">
                      {log.userName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {log.userRole}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {log.actionType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-slate-700 font-medium text-xs leading-relaxed">
                      {log.details}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === "Critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : log.severity === "Warning"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          log.severity === "Critical"
                            ? "bg-rose-500 animate-pulse"
                            : log.severity === "Warning"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                      ></span>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
