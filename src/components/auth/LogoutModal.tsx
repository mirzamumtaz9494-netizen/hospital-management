"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  X,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout?: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  const router = useRouter();
  const { roleConfig, logout } = useRole();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    if (onConfirmLogout) {
      onConfirmLogout();
    }
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                End Duty Shift &amp; Log Out
              </h3>
              <p className="text-xs text-slate-500">
                Sign off from current clinical terminal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Active User Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={roleConfig.profile.avatar}
              alt={roleConfig.profile.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/30"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm truncate">
                  {roleConfig.profile.name}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold ${roleConfig.profile.badgeColor}`}
                >
                  {roleConfig.profile.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {roleConfig.profile.department}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {roleConfig.profile.email}
              </p>
            </div>
          </div>

          {/* Shift Duty Summary */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-semibold mb-1">
                <Clock className="w-3 h-3 text-teal-600" />
                Shift Login Time
              </div>
              <div className="font-bold text-slate-800 font-mono">08:30 AM</div>
              <div className="text-[10px] text-emerald-600 font-medium">Duty active: 4h 15m</div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-semibold mb-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Terminal Station
              </div>
              <div className="font-bold text-slate-800 font-mono">Counter 02</div>
              <div className="text-[10px] text-slate-400">Metro Multispecialty</div>
            </div>
          </div>

          {/* Warning notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Please ensure all patient consultation notes, prescription entries, or cash balances are committed before ending your active shift.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer"
          >
            Cancel / Stay on Duty
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/20 transition flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Confirm Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
