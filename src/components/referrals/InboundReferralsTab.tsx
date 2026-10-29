"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  Filter,
  Plus,
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Stethoscope,
  ChevronRight,
  UserCheck,
  ArrowRight,
  Eye,
} from "lucide-react";
import { InboundReferral, InboundReferralStatus, ReferralPriority } from "@/types";

interface InboundReferralsTabProps {
  referrals: InboundReferral[];
  onOpenNewModal: () => void;
  onOpenPrintModal: (referral: InboundReferral) => void;
  onUpdateStatus: (referralId: string, newStatus: InboundReferralStatus) => void;
}

export const InboundReferralsTab: React.FC<InboundReferralsTabProps> = ({
  referrals,
  onOpenNewModal,
  onOpenPrintModal,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedReferralForAudit, setSelectedReferralForAudit] = useState<InboundReferral | null>(null);

  // Filtered referrals
  const filtered = referrals.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientPhone.includes(searchTerm);

    const matchesDept = filterDepartment === "all" || r.destinationDepartment === filterDepartment;
    const matchesStatus = filterStatus === "all" || r.referralStatus === filterStatus;
    const matchesPriority = filterPriority === "all" || r.referralPriority === filterPriority;

    return matchesSearch && matchesDept && matchesStatus && matchesPriority;
  });

  // Calculate metrics
  const totalCount = referrals.length;
  const admittedCount = referrals.filter((r) => r.referralStatus === "Admitted").length;
  const emergencyCount = referrals.filter((r) => r.referralPriority === "Emergency").length;
  const ackPendingCount = referrals.filter((r) => !r.acknowledgementSent).length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inbound</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
            <p className="text-[11px] text-teal-600 font-medium mt-0.5">Active External Referrals</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">IPD Conversions</p>
            <h3 className="text-2xl font-black text-indigo-900 mt-1">{admittedCount}</h3>
            <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
              {totalCount > 0 ? Math.round((admittedCount / totalCount) * 100) : 0}% Admission Rate
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emergency Triage</p>
            <h3 className="text-2xl font-black text-rose-900 mt-1">{emergencyCount}</h3>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Immediate Care Protocol</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ethics Compliance</p>
            <h3 className="text-2xl font-black text-emerald-900 mt-1">100%</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">NMC Verified • Zero Cuts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, UHID, doctor or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Departments</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Neurology">Neurology</option>
            <option value="Gynecology">Gynecology</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="Received">Received</option>
            <option value="Consulted">Consulted</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Priorities</option>
            <option value="Emergency">Emergency</option>
            <option value="Urgent">Urgent</option>
            <option value="Routine">Routine</option>
          </select>

          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            Log Inbound Referral
          </button>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Patient Information</th>
                <th className="py-3.5 px-4">Referring Practitioner / Entity</th>
                <th className="py-3.5 px-4">Dept & Intended Service</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Referral Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No inbound referrals match your active filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const priorityColors = {
                    Emergency: "bg-rose-50 text-rose-700 border-rose-200",
                    Urgent: "bg-amber-50 text-amber-700 border-amber-200",
                    Routine: "bg-slate-50 text-slate-700 border-slate-200",
                  };

                  const statusColors = {
                    Received: "bg-blue-50 text-blue-700 border-blue-200",
                    Consulted: "bg-indigo-50 text-indigo-700 border-indigo-200",
                    Admitted: "bg-purple-50 text-purple-700 border-purple-200",
                    Discharged: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    "Follow-up Sent": "bg-teal-50 text-teal-700 border-teal-200",
                  };

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition">
                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 font-medium whitespace-nowrap">
                        {r.referralDate}
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{r.patientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {r.uhid} • {r.patientAge}y/{r.patientGender}
                        </div>
                        <div className="text-[10px] text-slate-400">{r.patientPhone}</div>
                      </td>

                      {/* Referring Practitioner */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                          {r.referrerName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {r.referringEntity}
                          {r.referrerRegNo ? ` • Reg: ${r.referrerRegNo}` : ""}
                        </div>
                        <div className="text-[10px] text-slate-400">Ph: {r.referrerContact}</div>
                      </td>

                      {/* Dept & Service */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{r.destinationDepartment}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {r.intendedService}
                        </div>
                        <div className="text-[10px] text-teal-700 font-medium mt-0.5">
                          Treating: {r.treatingDoctor}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            priorityColors[r.referralPriority]
                          }`}
                        >
                          {r.referralPriority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={r.referralStatus}
                          onChange={(e) => onUpdateStatus(r.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            statusColors[r.referralStatus]
                          }`}
                        >
                          <option value="Received">Received</option>
                          <option value="Consulted">Consulted</option>
                          <option value="Admitted">Admitted</option>
                          <option value="Discharged">Discharged</option>
                          <option value="Follow-up Sent">Follow-up Sent</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenPrintModal(r)}
                            title="Generate & Print NMC Clinical Acknowledgment Letter"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 transition cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            Acknowledgment Slip
                          </button>

                          <button
                            onClick={() => setSelectedReferralForAudit(r)}
                            title="View Audit Trail"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
      </div>

      {/* Audit Trail Modal */}
      {selectedReferralForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Referral Audit Trail: {selectedReferralForAudit.patientName}
                </h3>
                <p className="text-[11px] text-slate-500">
                  UHID: {selectedReferralForAudit.uhid} • Referrer: {selectedReferralForAudit.referrerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedReferralForAudit(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedReferralForAudit.auditTrail.map((entry) => (
                <div key={entry.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600">{entry.action}</span>
                    <span>{entry.timestamp}</span>
                  </div>
                  <div className="text-slate-800 font-medium">Logged by: {entry.performedBy}</div>
                  {entry.notes && <div className="text-slate-500 italic text-[11px]">"{entry.notes}"</div>}
                </div>
              ))}
            </div>

            <div className="text-right pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedReferralForAudit(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
