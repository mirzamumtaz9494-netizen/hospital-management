"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Phone,
  MessageSquare,
  UserCheck,
  Printer,
  ChevronDown,
} from "lucide-react";
import { FollowUpItem } from "@/types";

interface OpdFollowUpsTabProps {
  followUps: FollowUpItem[];
  onCheckInRevisit: (item: FollowUpItem) => void;
  onSendReminder: (item: FollowUpItem) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  RK: "bg-blue-100 text-blue-700",
  KR: "bg-rose-100 text-rose-700",
  VR: "bg-teal-100 text-teal-700",
  AD: "bg-pink-100 text-pink-700",
  SB: "bg-violet-100 text-violet-700",
  LD: "bg-amber-100 text-amber-700",
};

export const OpdFollowUpsTab: React.FC<OpdFollowUpsTabProps> = ({
  followUps,
  onCheckInRevisit,
  onSendReminder,
}) => {
  const [statusFilter, setStatusFilter] = useState<"All" | "Due Today" | "Upcoming" | "Overdue">("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFollowUps = followUps.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false;
    if (selectedDoctor !== "All" && item.doctor !== selectedDoctor) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.mrId.toLowerCase().includes(q) ||
      item.doctor.toLowerCase().includes(q) ||
      item.diagnosis.toLowerCase().includes(q) ||
      item.phone.includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* 4 KPI Cards for Follow-ups */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Calendar className="w-4 h-4 text-teal-600" />
            Due Today
          </div>
          <div className="text-2xl font-bold text-slate-900">2</div>
          <span className="text-[11px] text-teal-700 font-semibold">Scheduled for 12 Oct 2026</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            Upcoming (Next 7 Days)
          </div>
          <div className="text-2xl font-bold text-blue-700">14</div>
          <span className="text-[11px] text-slate-500">Free revisit policy active</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Overdue Follow-ups
          </div>
          <div className="text-2xl font-bold text-amber-700">3</div>
          <span className="text-[11px] text-amber-600 font-semibold">Window expired &gt; 7 days</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            Revisits Completed
          </div>
          <div className="text-2xl font-bold text-emerald-700">42</div>
          <span className="text-[11px] text-slate-500">Successfully reviewed this month</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Outpatient Follow-up Tracker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              {filteredFollowUps.length} Cases
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, MR ID or diagnosis"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Doctors</option>
              <option value="Dr. S. Reddy">Dr. S. Reddy</option>
              <option value="Dr. K. Sharma">Dr. K. Sharma</option>
              <option value="Dr. A. Rao">Dr. A. Rao</option>
              <option value="Dr. P. Nair">Dr. P. Nair</option>
              <option value="Dr. V. Menon">Dr. V. Menon</option>
            </select>

            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              {(["All", "Due Today", "Upcoming", "Overdue"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    statusFilter === st
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Follow-up Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Patient MR ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Clinical Diagnosis</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Initial Visit</th>
                <th className="py-3 px-4">Follow-up Date</th>
                <th className="py-3 px-4">Policy Status</th>
                <th className="py-3 px-4">Reminder</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFollowUps.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition group">
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-teal-800">
                    {item.mrId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          AVATAR_COLORS[item.initials] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.initials}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block group-hover:text-teal-700 transition">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.age} / {item.gender} • {item.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={item.diagnosis}>
                    {item.diagnosis}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {item.doctor}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {item.originalVisitDate}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {item.scheduledFollowUpDate}
                  </td>
                  <td className="py-3 px-4">
                    {item.isFreeRevisit ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Free Revisit (7-Day)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Window Expired (₹300)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.reminderStatus === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.reminderStatus === "Sent"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.reminderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => onCheckInRevisit(item)}
                        className="px-3 py-1 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs transition shadow-2xs"
                      >
                        Check-in
                      </button>
                      <button
                        onClick={() => onSendReminder(item)}
                        className="p-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
                        title="Send SMS / WhatsApp Reminder"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
