"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { useOwner } from "@/context/OwnerContext";

export const OwnerUnlockModal: React.FC = () => {
  const router = useRouter();
  const { isOwner, unlockOwner, lockOwner, isUnlockModalOpen, closeUnlockModal } =
    useOwner();

  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isUnlockModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passkey.trim()) {
      setError("Please enter the Platform Owner Passkey.");
      return;
    }

    const ok = unlockOwner(passkey);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPasskey("");
        closeUnlockModal();
        router.push("/super-admin");
      }, 700);
    } else {
      setError("Invalid Passkey. Access restricted to SaaS Platform Owner.");
    }
  };

  const handleLock = () => {
    lockOwner();
    closeUnlockModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0c1322] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-white space-y-6">
        {/* Close Button */}
        <button
          onClick={closeUnlockModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Platform Owner Gate
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Restricted
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Admin controls are hidden from hospital clients and visitors.
            </p>
          </div>
        </div>

        {isOwner ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-xs text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Owner Mode is Active on This Device</p>
                <p className="text-emerald-300/80 text-[11px] mt-0.5">
                  Super Admin buttons and hospital tenant controls are visible to you.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  closeUnlockModal();
                  router.push("/super-admin");
                }}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>Open Super Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleLock}
                className="py-2.5 px-4 bg-slate-900 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Lock &amp; Hide
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Passkey verified. Opening Super Admin Console...</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Master Owner Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPasskey ? "text" : "password"}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter Owner Security Key"
                  autoFocus
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Default Master Passkey: <code className="text-amber-400 font-mono">Owner@2026</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Verify &amp; Unlock Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
