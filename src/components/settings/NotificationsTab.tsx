"use client";

import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { NotificationSettings } from "@/types";

interface NotificationsTabProps {
  settings: NotificationSettings;
  onSaveSettings: (updated: NotificationSettings) => void;
  onOpenTestModal: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  settings: initialSettings,
  onSaveSettings,
  onOpenTestModal,
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);

  const handleToggle = (field: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settings);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Patient Notifications, DLT SMS &amp; WhatsApp Business API
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              TRAI DLT Approved
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Automated appointment reminders, digital lab report delivery, and doctor panic-value SMS broadcasts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTestModal}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-teal-700" />
            Send Test Message
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Rules
          </button>
        </div>
      </div>

      {/* 2. Communication Gateways Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">
                DLT SMS Gateway
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {settings.smsProvider}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Entity: {settings.dltRegistrationId}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">
                WhatsApp Business API
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Meta Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Automated PDF diagnostic report delivery
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Tier: Tier 4 (Unlimited msgs/day)
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">
                SMTP Healthcare Relay
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                TLS 1.3 Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              SendGrid HIPAA BAA signed relay
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Daily quota: 100,000 emails
            </p>
          </div>
        </div>
      </div>

      {/* 3. Automated Notification Rules & Triggers */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Automated Event Triggers &amp; Patient Delivery Rules
            </h3>
            <p className="text-xs text-slate-500">
              Configure which clinical, billing, and diagnostic milestones send automatic mobile alerts
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Outpatient Registration &amp; Token Number SMS
                </div>
                <div className="text-[11px] text-slate-500">
                  Sends token number (e.g. OP-40125), doctor name, consultation room, and live queue position
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyOpTokenSms}
              onChange={() => handleToggle("notifyOpTokenSms")}
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Laboratory Diagnostic Report PDF via WhatsApp
                </div>
                <div className="text-[11px] text-slate-500">
                  Direct WhatsApp dispatch of certified NABL PDF report as soon as results are authorized
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyLabReadyWhatsApp}
              onChange={() => handleToggle("notifyLabReadyWhatsApp")}
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Inpatient Admission &amp; Ward Daily Tariff SMS
                </div>
                <div className="text-[11px] text-slate-500">
                  Notifies primary attendant of patient bed number, visiting hours, and daily room rent tariff
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyIpAdmitSms}
              onChange={() => handleToggle("notifyIpAdmitSms")}
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  Doctor Critical Panic Value Broadcast (Priority Alert)
                </div>
                <div className="text-[11px] text-slate-500">
                  Instantly sends high-priority SMS alert to attending physician for life-threatening lab anomalies
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyCriticalLabDoctor}
              onChange={() => handleToggle("notifyCriticalLabDoctor")}
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
            />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Discharge Bill Settlement Receipt via WhatsApp &amp; Email
                </div>
                <div className="text-[11px] text-slate-500">
                  Sends computerized GST tax invoice, payment receipt, and discharge medication summary
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyDischargeBillPdf}
              onChange={() => handleToggle("notifyDischargeBillPdf")}
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
