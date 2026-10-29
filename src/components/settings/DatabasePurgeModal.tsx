"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  X,
  Database,
  Building2,
  Stethoscope,
  FlaskConical,
  Pill,
  Lock,
} from "lucide-react";
import {
  getDatabaseStats,
  purgeTransactionalData,
  DatabaseStats,
  PurgeResult,
} from "@/lib/databaseResetService";

interface DatabasePurgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: PurgeResult) => void;
}

export const DatabasePurgeModal: React.FC<DatabasePurgeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [purgeCloud, setPurgeCloud] = useState(true);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeResult, setPurgeResult] = useState<PurgeResult | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmInput("");
      setPurgeResult(null);
      getDatabaseStats().then(setStats);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = confirmInput.trim().toUpperCase() === "RESET";

  const handleExecutePurge = async () => {
    if (!isConfirmed || isPurging) return;

    setIsPurging(true);
    try {
      const result = await purgeTransactionalData({ purgeCloud });
      setPurgeResult(result);
      onSuccess(result);
    } catch (err) {
      console.error("Purge error:", err);
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Hospital Test Database Purge &amp; Reset
              </h2>
              <p className="text-xs text-red-100">
                Safe pre-launch clean slate for live patient onboarding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {purgeResult ? (
            /* Success State */
            <div className="space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Database Purge Completed!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {purgeResult.message}
                </p>
              </div>

              {/* Purged counts card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-2 flex justify-between">
                  <span>Purge Audit Summary</span>
                  <span className="text-emerald-700">
                    {purgeResult.clearedSummary.totalCleared} Records Cleared
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div>
                    Patients Purged:{" "}
                    <strong className="text-slate-900">
                      {purgeResult.clearedSummary.patientsCount}
                    </strong>
                  </div>
                  <div>
                    OPD Tokens:{" "}
                    <strong className="text-slate-900">
                      {purgeResult.clearedSummary.opdTokensCount}
                    </strong>
                  </div>
                  <div>
                    Diagnostic Vouchers:{" "}
                    <strong className="text-slate-900">
                      {purgeResult.clearedSummary.diagnosticOrdersCount}
                    </strong>
                  </div>
                  <div>
                    Inbound Referrals:{" "}
                    <strong className="text-slate-900">
                      {purgeResult.clearedSummary.inboundReferralsCount}
                    </strong>
                  </div>
                  <div>
                    Billing Transactions:{" "}
                    <strong className="text-slate-900">
                      {purgeResult.clearedSummary.billingTransactionsCount}
                    </strong>
                  </div>
                  <div>
                    Outbox Mutations:{" "}
                    <strong className="text-slate-900">
                      {purgeResult.clearedSummary.outboxMutationsCount}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Master Preserved Notice */}
              <div className="bg-emerald-50/80 rounded-2xl p-3.5 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>All Master Configurations Preserved:</strong> Doctor
                  accounts, hospital settings, master lab catalogs, medicine
                  directory, and partner diagnostic centers remain 100% active.
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    window.location.reload();
                  }}
                  className="w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reload Clean Hospital Workspace
                </button>
              </div>
            </div>
          ) : (
            /* Warning & Confirmation State */
            <>
              {/* Alert Warning */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <div className="font-bold">
                    Important: This is a Production Clean Slate Operation
                  </div>
                  <p className="text-amber-800">
                    Use this utility once testing is finished. It safely purges
                    all test patients, simulated OPD tokens, external scan
                    vouchers, and billing trials while keeping master hospital
                    configurations completely untouched.
                  </p>
                </div>
              </div>

              {/* Two columns: What will be Deleted vs What will be Preserved */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Deleting */}
                <div className="bg-red-50/60 p-3.5 rounded-2xl border border-red-200 space-y-1.5">
                  <div className="font-bold text-red-900 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    Will Be Safely Purged:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-red-800 text-[11px]">
                    <li>All dummy / test patient records</li>
                    <li>Outpatient (OPD) queue tokens</li>
                    <li>Inpatient (IPD) mock admissions</li>
                    <li>External diagnostic scan vouchers</li>
                    <li>Inbound referral slips</li>
                    <li>Simulated billing &amp; cashier reports</li>
                    <li>Offline transaction sync queue</li>
                  </ul>
                </div>

                {/* Preserved */}
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Preserved Master Data:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-emerald-800 text-[11px]">
                    <li>Hospital Profile &amp; Legal Reg No.</li>
                    <li>Doctor credentials &amp; staff logins</li>
                    <li>Partner Diagnostic Centers Directory</li>
                    <li>Master Lab Catalogs &amp; Rates</li>
                    <li>Pharmacy Drug Formulary</li>
                    <li>Wards, Beds &amp; Department setup</li>
                  </ul>
                </div>
              </div>

              {/* Stats overview */}
              {stats && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>Current local records detected:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {stats.localPatients} patients • {stats.externalDiagnosticOrders} vouchers • {stats.syncOutbox} outbox items
                  </span>
                </div>
              )}

              {/* Supabase sync checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={purgeCloud}
                  onChange={(e) => setPurgeCloud(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600"
                />
                <span>Also wipe test records from connected Cloud Database (Supabase)</span>
              </label>

              {/* Safety Confirmation Input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-800">
                  To confirm safe purge, type{" "}
                  <span className="text-red-600 font-mono font-bold">RESET</span>{" "}
                  below:
                </label>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="Type RESET to confirm"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isConfirmed || isPurging}
                  onClick={handleExecutePurge}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-2 ${
                    isConfirmed && !isPurging
                      ? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 cursor-pointer"
                      : "bg-slate-300 cursor-not-allowed opacity-60"
                  }`}
                >
                  {isPurging ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Purging Test Data...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Purge Test Database &amp; Start Fresh
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
