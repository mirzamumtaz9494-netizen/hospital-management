"use client";

import React, { useState } from "react";
import {
  KeyRound,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { roleConfig } = useRole();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Strength calculation
  const hasMinLength = newPwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPwd);
  const hasNumber = /[0-9]/.test(newPwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPwd);

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const getStrengthLabel = () => {
    if (strengthScore <= 1) return { label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
    if (strengthScore <= 3) return { label: "Moderate", color: "bg-amber-500", text: "text-amber-600" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
  };

  const strength = getStrengthLabel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPwd) {
      setError("Please enter your current account password.");
      return;
    }
    if (!hasMinLength) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("New password and confirm password do not match.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Update Staff Password
              </h3>
              <p className="text-xs text-slate-500">
                Secure your CarePulse clinical station credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Password Changed Successfully!
            </h4>
            <p className="text-xs text-slate-500">
              Your new hospital authentication credentials are now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 pr-10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  New Password
                </label>
                {newPwd && (
                  <span className={`text-[10px] font-bold ${strength.text}`}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 pr-10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {newPwd && (
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  <div className={`h-1.5 rounded-full ${strengthScore >= 1 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-1.5 rounded-full ${strengthScore >= 2 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-1.5 rounded-full ${strengthScore >= 3 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-1.5 rounded-full ${strengthScore >= 4 ? strength.color : "bg-slate-200"}`} />
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 pr-10 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
