"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Droplet, CheckCircle2, AlertTriangle } from "lucide-react";
import { BloodRequisition } from "@/types";

interface IssueBloodModalProps {
  isOpen: boolean;
  requisition: BloodRequisition | null;
  onClose: () => void;
  onConfirmIssue: (reqId: string, bagBarcode: string, nurseStaff: string) => void;
}

export const IssueBloodModal: React.FC<IssueBloodModalProps> = ({
  isOpen,
  requisition,
  onClose,
  onConfirmIssue,
}) => {
  const [nurseStaff, setNurseStaff] = useState("Staff Nurse Philomena");
  const [checklist, setChecklist] = useState({
    recipientMatch: false,
    bloodGroupMatch: false,
    expiryChecked: false,
    visualInspectionPassed: false,
  });

  if (!isOpen || !requisition) return null;

  const allChecked =
    checklist.recipientMatch &&
    checklist.bloodGroupMatch &&
    checklist.expiryChecked &&
    checklist.visualInspectionPassed;

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecked) return;
    onConfirmIssue(
      requisition.id,
      requisition.reservedBagBarcode || "BAG-88202",
      nurseStaff
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Issue Blood Unit to Ward / OT</h3>
              <p className="text-[11px] text-slate-500">Dual-verification protocol before blood release.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient & Bag Summary */}
        <div className="my-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Recipient Patient:</span>
            <span className="font-bold text-slate-900">{requisition.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">IP Number &amp; Bed:</span>
            <span className="font-mono font-bold text-slate-800">{requisition.ipNo} ({requisition.wardBed})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Requisitioned Blood:</span>
            <span className="font-bold text-rose-700">{requisition.bloodGroup} • {requisition.component}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Reserved Bag Barcode:</span>
            <span className="font-mono font-bold text-slate-900">{requisition.reservedBagBarcode || "BAG-88202"}</span>
          </div>
        </div>

        {/* Safety Checklist */}
        <form onSubmit={handleIssue} className="space-y-3 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Mandatory Clinical Safety Checks:
          </div>

          <label className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.recipientMatch}
              onChange={(e) => setChecklist({ ...checklist, recipientMatch: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-slate-700 font-medium">
              Verified recipient wristband ID and MRN ({requisition.mrId}) match.
            </span>
          </label>

          <label className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.bloodGroupMatch}
              onChange={(e) => setChecklist({ ...checklist, bloodGroupMatch: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-slate-700 font-medium">
              Donor blood group ({requisition.bloodGroup}) crossmatch confirmed 100% compatible.
            </span>
          </label>

          <label className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.expiryChecked}
              onChange={(e) => setChecklist({ ...checklist, expiryChecked: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-slate-700 font-medium">
              Blood bag expiration date checked and valid (within 35 days).
            </span>
          </label>

          <label className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.visualInspectionPassed}
              onChange={(e) => setChecklist({ ...checklist, visualInspectionPassed: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-slate-700 font-medium">
              Visual inspection passed (no hemolysis, clotting, or discoloration).
            </span>
          </label>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Receiving Nursing Staff</label>
            <input
              type="text"
              value={nurseStaff}
              onChange={(e) => setNurseStaff(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allChecked}
              className={`px-5 py-2 rounded-xl text-white font-bold shadow-sm transition ${
                allChecked
                  ? "bg-rose-600 hover:bg-rose-700 cursor-pointer"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Sign-Off &amp; Release Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
