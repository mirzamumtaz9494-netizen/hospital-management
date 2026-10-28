"use client";

import React, { useState } from "react";
import { X, LogOut, CheckCircle2, AlertTriangle, FileText, IndianRupee } from "lucide-react";
import { ActiveAdmission, DischargeOutcome } from "@/types";

interface DischargePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  admission: ActiveAdmission | null;
  onConfirmDischarge: (data: {
    admission: ActiveAdmission;
    outcome: DischargeOutcome;
    dischargeNotes: string;
    finalBill: number;
    settlementMode: string;
  }) => void;
}

export const DischargePatientModal: React.FC<DischargePatientModalProps> = ({
  isOpen,
  onClose,
  admission,
  onConfirmDischarge,
}) => {
  const [outcome, setOutcome] = useState<DischargeOutcome>("Recovered");
  const [dischargeNotes, setDischargeNotes] = useState(
    "Condition stable at time of discharge. Vitals within normal limits. Advised home rest and oral medications as per discharge summary."
  );
  const [settlementType, setSettlementType] = useState<"SETTLE_NOW" | "OUTSTANDING_CREDIT">("SETTLE_NOW");
  const [settlementMode, setSettlementMode] = useState("UPI");
  const [upiUtr, setUpiUtr] = useState("");
  const [authorizingManager, setAuthorizingManager] = useState("Chief Medical Director");
  const [promisedDueDate, setPromisedDueDate] = useState("2026-11-05");

  if (!isOpen || !admission) return null;

  const totalBill = admission.billSoFar;
  const advancePaid = admission.advancePaid;
  const balanceDue = Math.max(0, totalBill - advancePaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDischarge({
      admission,
      outcome,
      dischargeNotes,
      finalBill: totalBill,
      settlementMode: settlementType === "OUTSTANDING_CREDIT" ? `Credit Balance (Auth: ${authorizingManager})` : settlementMode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 font-bold">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Discharge Inpatient
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {admission.ipNo} • {admission.name} ({admission.wardBed})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 font-medium">Admitted Date:</span>
              <span className="font-bold text-slate-900 ml-1">{admission.admittedOn}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Days Stayed:</span>
              <span className="font-bold text-slate-900 ml-1">{admission.days} days</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 font-medium">Diagnosis:</span>
              <span className="font-bold text-slate-900 ml-1">{admission.diagnosis}</span>
            </div>
          </div>

          {/* Outcome Selector */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              Discharge Outcome <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Recovered", "Referred", "LAMA"] as DischargeOutcome[]).map((oc) => (
                <button
                  key={oc}
                  type="button"
                  onClick={() => setOutcome(oc)}
                  className={`py-2 rounded-xl font-bold border transition text-center ${
                    outcome === oc
                      ? oc === "Recovered"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                        : oc === "Referred"
                        ? "bg-blue-50 border-blue-300 text-blue-800 shadow-2xs"
                        : "bg-amber-50 border-amber-300 text-amber-800 shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {oc}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Discharge Summary */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              Clinical Discharge Notes & Advice on Discharge
            </label>
            <textarea
              rows={3}
              value={dischargeNotes}
              onChange={(e) => setDischargeNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Financial Settlement Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Total Inpatient Bill:</span>
              <span className="font-mono font-bold text-white text-sm">₹{totalBill.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Advance Deposit Deducted:</span>
              <span className="font-mono font-bold text-emerald-400">₹{advancePaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
              <span>Net Settlement Due:</span>
              <span className="font-mono text-amber-400 text-base">₹{balanceDue.toLocaleString()}</span>
            </div>
          </div>

          {balanceDue > 0 ? (
            <div className="space-y-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5">
              <label className="block text-amber-950 font-bold text-xs">
                Financial Clearance Strategy:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettlementType("SETTLE_NOW")}
                  className={`py-2 px-3 rounded-xl font-bold border transition text-left text-xs ${
                    settlementType === "SETTLE_NOW"
                      ? "bg-emerald-600 border-emerald-700 text-white shadow-xs"
                      : "bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50"
                  }`}
                >
                  Collect Full Due (₹{balanceDue.toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => setSettlementType("OUTSTANDING_CREDIT")}
                  className={`py-2 px-3 rounded-xl font-bold border transition text-left text-xs ${
                    settlementType === "OUTSTANDING_CREDIT"
                      ? "bg-amber-600 border-amber-700 text-white shadow-xs"
                      : "bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50"
                  }`}
                >
                  Authorize Outstanding Dues
                </button>
              </div>

              {settlementType === "SETTLE_NOW" ? (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Settlement Payment Mode
                  </label>
                  <select
                    value={settlementMode}
                    onChange={(e) => setSettlementMode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="UPI">UPI / Digital QR</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Insurance / TPA">Insurance / TPA Cashless</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2 pt-1 border-t border-amber-200/80">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">
                        Authorizing Manager
                      </label>
                      <input
                        type="text"
                        value={authorizingManager}
                        onChange={(e) => setAuthorizingManager(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-600 mb-0.5">
                        Promise Due Date
                      </label>
                      <input
                        type="date"
                        value={promisedDueDate}
                        onChange={(e) => setPromisedDueDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-800 font-medium">
                    ⚠️ Dues of ₹{balanceDue.toLocaleString()} will be automatically tracked in the Hospital Accounts Ledger and notified to {admission.attendingDoctor}.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full Inpatient Balance Already Settled (₹0 Due)</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete & Discharge Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
