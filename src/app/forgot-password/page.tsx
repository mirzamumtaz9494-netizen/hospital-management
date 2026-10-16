"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  KeyRound,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Lock,
  Sparkles,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Identity
  const [identifier, setIdentifier] = useState("CP-DOC-401");
  const [department, setDepartment] = useState("Internal Medicine");

  // Step 2: OTP
  const [otp, setOtp] = useState(["4", "8", "2", "9", "1", "0"]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Step 3: New Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPin, setNewPin] = useState("1234");

  // Status
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Password strength calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const getStrengthLabel = () => {
    if (!newPassword) return { label: "Required", color: "bg-slate-700", text: "text-slate-500", width: "w-0" };
    if (strengthScore <= 1) return { label: "Weak", color: "bg-rose-500", text: "text-rose-400", width: "w-1/4" };
    if (strengthScore <= 3) return { label: "Moderate", color: "bg-amber-500", text: "text-amber-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400", width: "w-full" };
  };

  const strength = getStrengthLabel();

  // Step 1: Submit identifier
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError("Please enter your registered Staff ID or hospital email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(60);
      setCanResend(false);
    }, 600);
  };

  // Step 2: Submit OTP
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);

    // Auto focus next input if character entered
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 600);
  };

  const handleResendOtp = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(["4", "8", "2", "9", "1", "0"]);
    setError(null);
  };

  // Step 3: Submit New Password
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPin.length !== 4) {
      setError("Terminal unlock PIN must be exactly 4 digits.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
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
              Terminal Credential Recovery
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="text-xs font-semibold text-slate-300 hover:text-teal-300 transition"
        >
          ← Return to Sign In
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Steps Progress Indicator (if not in success step 4) */}
            {step < 4 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                  <span className={step >= 1 ? "text-teal-400" : ""}>1. Identify</span>
                  <span className={step >= 2 ? "text-teal-400" : ""}>2. Verify OTP</span>
                  <span className={step >= 3 ? "text-teal-400" : ""}>3. Reset</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full bg-teal-500 transition-all duration-300 ${
                      step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2 text-xs text-rose-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* ================= STEP 1: Identification ================= */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
                    <KeyRound className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Reset Staff Credentials
                  </h2>
                  <p className="text-xs text-slate-400">
                    Enter your hospital staff ID or registered clinical email to receive a recovery OTP code.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hospital Staff ID / Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. CP-DOC-401 or doctor@VitalSync.hms"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hospital Department / Unit
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                  >
                    <option value="Internal Medicine">Internal Medicine (OPD)</option>
                    <option value="Nursing Administration">Nursing Administration</option>
                    <option value="Front Desk & Triage">Front Desk &amp; Triage</option>
                    <option value="Central Pharmacy">Central Pharmacy</option>
                    <option value="Diagnostic Laboratory">Diagnostic Laboratory</option>
                    <option value="Accounts & Cash Desk">Accounts &amp; Cash Desk</option>
                    <option value="Clinical Executive / CMO">Clinical Executive / CMO</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer mt-6 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Verifying Staff ID...</span>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("CP-DOC-401");
                      setDepartment("Internal Medicine");
                    }}
                    className="text-[11px] text-teal-400 hover:text-teal-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Use Demo Staff ID (CP-DOC-401)
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 2: OTP Verification ================= */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-5">
                <div className="text-center space-y-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Verify 2-Factor OTP
                  </h2>
                  <p className="text-xs text-slate-400">
                    A 6-digit security code was dispatched to the mobile device and email registered with{" "}
                    <span className="text-teal-300 font-mono font-bold">{identifier}</span>.
                  </p>
                </div>

                {/* 6-Digit Code Inputs */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 text-center mb-2.5">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-10 sm:w-12 h-12 sm:h-14 bg-slate-950 border border-slate-700/80 rounded-xl text-center text-lg font-bold font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
                      />
                    ))}
                  </div>
                  <div className="text-center mt-2.5">
                    <span className="text-[11px] text-slate-400">
                      Demo Code: <span className="font-mono text-teal-300 font-bold">482910</span>
                    </span>
                  </div>
                </div>

                {/* Resend & Timer */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Change Staff ID
                  </button>

                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-slate-400 font-mono">
                      Resend code in {timer}s
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Validating OTP Code...</span>
                  ) : (
                    <>
                      <span>Verify &amp; Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= STEP 3: Set New Password ================= */}
            {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <div className="text-center space-y-2 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
                    <KeyRound className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Set New Clinical Password
                  </h2>
                  <p className="text-xs text-slate-400">
                    Create a strong, HIPAA-compliant password to secure your hospital station.
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      New Password *
                    </label>
                    <span className={`text-[10px] font-bold ${strength.text}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 digit"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                {/* 4-digit quick unlock PIN */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New 4-Digit Terminal Quick Unlock PIN
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="1234"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer mt-5 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Committing Security Changes...</span>
                  ) : (
                    <>
                      <span>Update Staff Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= STEP 4: Success ================= */}
            {step === 4 && (
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/40 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Credentials Updated!
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Your password and quick terminal unlock PIN have been securely reset. You can now log into your clinical workstation.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Terminal Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0c1322] px-4 py-3 text-center text-xs text-slate-500">
        VitalSync HMS • Patient Record Privacy &amp; Credential Recovery
      </footer>
    </div>
  );
}
