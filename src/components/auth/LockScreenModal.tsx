"use client";

import React, { useState } from "react";
import { Lock, Unlock, LogOut, ShieldAlert, KeyRound } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { LogoutModal } from "./LogoutModal";

export const LockScreenModal: React.FC = () => {
  const { isLocked, unlockSession, roleConfig } = useRole();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showLogout, setShowLogout] = useState(false);

  if (!isLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length < 4) {
      setError("Please enter a 4-digit security PIN");
      return;
    }
    const success = unlockSession(pin);
    if (!success) {
      setError("Incorrect PIN. Try 1234");
      setPin("");
    } else {
      setError(null);
      setPin("");
    }
  };

  const handleKeyClick = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        const success = unlockSession(nextPin);
        if (!success) {
          setError("Incorrect PIN. Try 1234");
          setPin("");
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-6 text-white animate-in zoom-in-95 duration-150">
          {/* Lock Icon */}
          <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/10">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white">
            Terminal Locked
          </h2>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            VitalSync clinical privacy protection active
          </p>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/70 text-left mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={roleConfig.profile.avatar}
              alt={roleConfig.profile.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-teal-500/30"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100 text-xs truncate">
                  {roleConfig.profile.name}
                </span>
              </div>
              <span
                className={`inline-block text-[9px] px-2 py-0.5 rounded font-mono font-bold mt-0.5 ${roleConfig.profile.badgeColor}`}
              >
                {roleConfig.profile.badge}
              </span>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {roleConfig.profile.department}
              </p>
            </div>
          </div>

          {/* PIN Display */}
          <div className="mb-4">
            <div className="flex justify-center gap-3 mb-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                    idx < pin.length
                      ? "bg-teal-400 border-teal-400 scale-110 shadow-sm shadow-teal-400/50"
                      : "border-slate-600 bg-slate-800"
                  }`}
                />
              ))}
            </div>
            {error ? (
              <p className="text-[11px] text-rose-400 font-medium flex items-center justify-center gap-1 mt-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400">
                Enter 4-digit PIN (Demo: <span className="font-mono text-teal-300">1234</span>)
              </p>
            )}
          </div>

          {/* Number Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num)}
                className="h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-base font-bold text-slate-100 hover:text-white transition active:scale-95 cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="h-11 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold text-slate-400 hover:text-slate-200 transition active:scale-95 cursor-pointer flex items-center justify-center"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick("0")}
              className="h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-base font-bold text-slate-100 hover:text-white transition active:scale-95 cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleUnlock()}
              className="h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition active:scale-95 cursor-pointer flex items-center justify-center shadow-md shadow-teal-500/20"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setPin("1234");
                unlockSession("1234");
              }}
              className="text-[11px] text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
            >
              Quick Demo Unlock
            </button>
            <button
              type="button"
              onClick={() => setShowLogout(true)}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Off Shift
            </button>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
      />
    </>
  );
};
