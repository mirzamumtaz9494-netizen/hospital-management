"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Lock,
  User,
  Shield,
  Stethoscope,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRole, RoleKey, ROLES_REGISTRY } from "@/context/RoleContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();

  const [selectedRole, setSelectedRole] = useState<RoleKey>("doctor");
  const [staffId, setStaffId] = useState("CP-DOC-401");
  const [password, setPassword] = useState("Hospital@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [terminalStation, setTerminalStation] = useState("OPD Chamber 04 - Internal Medicine");
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Role quick demo helper
  const handleSelectRolePreset = (key: RoleKey) => {
    setSelectedRole(key);
    setError(null);
    const profile = ROLES_REGISTRY[key].profile;
    
    // Auto-fill realistic credentials for test simulation
    switch (key) {
      case "cmo":
        setStaffId("CP-CMO-100");
        setTerminalStation("Executive Governance Suite");
        break;
      case "receptionist":
        setStaffId("CP-REC-204");
        setTerminalStation("Main Triage & Registration Counter 01");
        break;
      case "doctor":
        setStaffId("CP-DOC-401");
        setTerminalStation("OPD Chamber 04 - Internal Medicine");
        break;
      case "nurse":
        setStaffId("CP-NUR-302");
        setTerminalStation("Nursing Station - ICU & Ward 3");
        break;
      case "pharmacist":
        setStaffId("CP-PHARM-505");
        setTerminalStation("Central Formulary & Dispensing POS");
        break;
      case "lab_tech":
        setStaffId("CP-LAB-602");
        setTerminalStation("Central Diagnostic & Pathology Station");
        break;
      case "cashier":
        setStaffId("CP-CASH-701");
        setTerminalStation("Main Cash Desk & Accounts Counter");
        break;
    }
    setPassword("Hospital@2026");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!staffId.trim()) {
      setError("Please provide your Staff ID or registered hospital email.");
      return;
    }

    if (!password) {
      setError("Please enter your account password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      login(selectedRole);

      setTimeout(() => {
        // Route according to role privileges
        if (selectedRole === "pharmacist") {
          router.push("/pharmacy");
        } else if (selectedRole === "lab_tech") {
          router.push("/laboratory");
        } else if (selectedRole === "cashier") {
          router.push("/accounts");
        } else {
          router.push("/");
        }
      }, 700);
    }, 600);
  };

  const activeRoleConfig = ROLES_REGISTRY[selectedRole];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-[#0c1322]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              VitalSync <span className="text-teal-400">HMS</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-400 font-mono">
              Terminal v2.4 • NABH Certified
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Metro Multispecialty Main Server</span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-teal-300 transition"
          >
            ← Guest Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Quick Role Presets & Hospital Info (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Role-Based Clinical Access (RBAC)
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Clinical Terminal <br />
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Staff Authentication
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Select your clinical role below for instant test sign-in or enter your accredited hospital credentials.
              </p>
            </div>

            {/* 1-Click Role Switcher Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1-Click Role Quick Presets:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {(Object.keys(ROLES_REGISTRY) as RoleKey[]).map((rKey) => {
                  const role = ROLES_REGISTRY[rKey];
                  const isSelected = selectedRole === rKey;
                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => handleSelectRolePreset(rKey)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-teal-950/40 border-teal-500/60 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/50"
                          : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={role.profile.avatar}
                        alt={role.profile.name}
                        className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-slate-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {role.profile.name}
                          </span>
                          <span
                            className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${role.profile.badgeColor}`}
                          >
                            {role.profile.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {role.profile.department}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HIPAA Compliance Note */}
            <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p>
                Protected under NABH, ISO 27001, and HIPAA patient data regulations. Every terminal session is encrypted and audit logged.
              </p>
            </div>
          </div>

          {/* Right Column: Sign-In Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Active Role Header Banner */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeRoleConfig.profile.avatar}
                  alt={activeRoleConfig.profile.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/40"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">
                      {activeRoleConfig.profile.name}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${activeRoleConfig.profile.badgeColor}`}
                    >
                      {activeRoleConfig.profile.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {activeRoleConfig.profile.roleLabel}
                  </p>
                  <p className="text-[11px] text-teal-400/80 font-mono">
                    {activeRoleConfig.profile.email}
                  </p>
                </div>
              </div>

              {/* Status / Errors */}
              {error && (
                <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Authentication authorized! Launching clinical terminal...</span>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Staff ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hospital Staff ID / Registered Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      placeholder="e.g. CP-DOC-401 or dr.priya@VitalSync.hms"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Security Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] text-teal-400 hover:text-teal-300 transition"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter terminal password"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Station / Chamber Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Duty Station / Chamber Allocation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building className="w-4 h-4" />
                    </div>
                    <select
                      value={terminalStation}
                      onChange={(e) => setTerminalStation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    >
                      <option value="OPD Chamber 04 - Internal Medicine">
                        OPD Chamber 04 - Internal Medicine
                      </option>
                      <option value="Main Triage & Registration Counter 01">
                        Main Triage & Registration Counter 01
                      </option>
                      <option value="Nursing Station - ICU & Ward 3">
                        Nursing Station - ICU & Ward 3
                      </option>
                      <option value="Central Formulary & Dispensing POS">
                        Central Formulary & Dispensing POS
                      </option>
                      <option value="Central Diagnostic & Pathology Station">
                        Central Diagnostic & Pathology Station
                      </option>
                      <option value="Main Cash Desk & Accounts Counter">
                        Main Cash Desk & Accounts Counter
                      </option>
                      <option value="Executive Governance Suite">
                        Executive Governance Suite
                      </option>
                    </select>
                  </div>
                </div>

                {/* Remember Station Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberTerminal}
                      onChange={(e) => setRememberTerminal(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500/20"
                    />
                    <span>Remember this clinical terminal for 12 hours</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Verifying Clinical Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Terminal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Onboarding Register link */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  New clinical staff member or technician?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-teal-400 hover:text-teal-300 transition inline-flex items-center gap-1"
                  >
                    Register Terminal Access →
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0c1322] px-4 py-3 text-center text-xs text-slate-500">
        © 2026 VitalSync Health Systems Inc. • ISO 27001 &amp; NABH Accredited Platform • Role-Based Healthcare EHR
      </footer>
    </div>
  );
}
