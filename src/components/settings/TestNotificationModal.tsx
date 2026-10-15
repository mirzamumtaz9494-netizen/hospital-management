"use client";

import React, { useState } from "react";
import { X, Send, Smartphone, MessageSquare, Mail, CheckCircle2 } from "lucide-react";

interface TestNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: (channel: string, target: string) => void;
}

export const TestNotificationModal: React.FC<TestNotificationModalProps> = ({
  isOpen,
  onClose,
  onSendSuccess,
}) => {
  const [channel, setChannel] = useState<"SMS" | "WhatsApp" | "Email">("SMS");
  const [recipient, setRecipient] = useState("+91 98401 22334");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      onSendSuccess(channel, recipient);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gateway Dispatch Test Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Verify mobile gateway latency &amp; DLT template compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Communication Gateway
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setChannel("SMS");
                  setRecipient("+91 98401 22334");
                }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  channel === "SMS"
                    ? "bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-500"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Smartphone className="w-4 h-4 text-teal-700" />
                DLT SMS
              </button>

              <button
                type="button"
                onClick={() => {
                  setChannel("WhatsApp");
                  setRecipient("+91 98401 22334");
                }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  channel === "WhatsApp"
                    ? "bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-500"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp API
              </button>

              <button
                type="button"
                onClick={() => {
                  setChannel("Email");
                  setRecipient("doctor.desk@carepulse.hms");
                }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  channel === "Email"
                    ? "bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-500"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Mail className="w-4 h-4 text-purple-600" />
                SMTP Email
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Recipient {channel === "Email" ? "Email Address" : "Mobile Number"} *
            </label>
            <input
              type={channel === "Email" ? "email" : "text"}
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Simulated Message Payload (DLT Template ID: 11071629)
            </div>
            <p className="text-xs text-slate-700 font-mono leading-relaxed">
              &ldquo;Dear Patient, your OP Token #OP-40125 for Cardiology (Dr. Rajesh Rao) is confirmed for 15-Oct-2026. Please report to Room 204. — CarePulse Hospital&rdquo;
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? "Dispatching..." : `Send Test ${channel}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
