"use client";

import React from "react";
import { X, CheckCircle2, XCircle, AlertCircle, Clock, ShieldCheck, Mail, Building } from "lucide-react";
import { PendingAccessRequest } from "@/types";

interface PendingApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: PendingAccessRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onApproveAll: () => void;
}

export const PendingApprovalsModal: React.FC<PendingApprovalsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onApprove,
  onReject,
  onApproveAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              {requests.length}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Staff Access &amp; Elevation Approval Tray
              </h3>
              <p className="text-xs text-slate-500">
                Review pending credentials, department transfers, and privilege elevations
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

        {/* Requests List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {requests.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900">
                All Access Requests Processed
              </div>
              <p className="text-xs text-slate-400 mt-1">
                There are no pending staff accounts or role authorizations requiring review.
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">
                      {req.applicantName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      Requested Role: {req.requestedRole}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {req.requestDate}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building className="w-3 h-3 text-slate-400" />
                      {req.department}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {req.applicantEmail}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    &ldquo;{req.justification}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => onReject(req.id)}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove(req.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Authorize
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {requests.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/75 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {requests.length} approvals pending administrative action
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
              <button
                onClick={onApproveAll}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Authorize All ({requests.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
