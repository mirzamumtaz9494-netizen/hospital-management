"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Mail, CheckCircle2, Send, Sparkles } from "lucide-react";

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (email: string, frequency: string, format: string) => void;
}

export const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({
  isOpen,
  onClose,
  onConfirmSchedule,
}) => {
  const [email, setEmail] = useState("director@VitalSync.hospital");
  const [frequency, setFrequency] = useState("Daily at 08:00 AM");
  const [format, setFormat] = useState("PDF Executive Summary");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmSchedule(email, frequency, format);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Schedule Automated Hospital MIS
              </h3>
              <p className="text-xs text-slate-500">
                Receive scheduled executive briefings via email
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Recipient Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Dispatch Cadence &amp; Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Daily at 08:00 AM">Daily Morning Briefing (08:00 AM)</option>
              <option value="Daily Day-End at 10:00 PM">Daily Day-End Financial Summary (10:00 PM)</option>
              <option value="Weekly Monday 09:00 AM">Weekly Operations Digest (Monday 09:00 AM)</option>
              <option value="Monthly 1st Calendar Day">Monthly Board Pack (1st of Month)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Document Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="PDF Executive Summary">PDF Executive Summary with Visual Scorecards</option>
              <option value="Excel Raw Data Matrix">Excel Detailed Departmental Matrix (.xlsx)</option>
              <option value="CSV Financial Ledger">CSV Financial Transaction Ledger (.csv)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Activate Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
