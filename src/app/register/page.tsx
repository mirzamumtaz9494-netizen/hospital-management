"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  User,
  Shield,
  Stethoscope,
  Building,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileBadge,
  Phone,
  Mail,
  Lock,
  Pill,
  FlaskConical,
  Wallet,
  BedDouble,
  HeartPulse,
} from "lucide-react";
import { useRole, RoleKey, ROLES_REGISTRY } from "@/context/RoleContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useRole();

  // Basic Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleKey>("doctor");

  // Role-Specific Dynamic Fields
  // Doctor
  const [mciRegNo, setMciRegNo] = useState("");
  const [specialization, setSpecialization] = useState("General Medicine");
  const [chamberNumber, setChamberNumber] = useState("Chamber 04");
  const [consultationFee, setConsultationFee] = useState("600");
  const [qualification, setQualification] = useState("MBBS, MD (Medicine)");

  // Nurse
  const [nursingPin, setNursingPin] = useState("");
  const [nurseCadre, setNurseCadre] = useState("Senior Staff Nurse");
  const [assignedWard, setAssignedWard] = useState("ICU & Post-Op Ward");

  // Receptionist
  const [counterId, setCounterId] = useState("Counter 01 - Main Triage");
  const [shiftSlot, setShiftSlot] = useState("Morning Shift (07:00 - 15:00)");
  const [languages, setLanguages] = useState("English, Hindi, Regional");

  // Pharmacist
  const [pharmacyLicense, setPharmacyLicense] = useState("");
  const [pharmacyTier, setPharmacyTier] = useState("Central Formulary & Inpatient Stock");

  // Lab Technician
  const [paramedicalReg, setParamedicalReg] = useState("");
  const [labSection, setLabSection] = useState("Biochemistry & Pathology");

  // Cashier
  const [cashRegisterId, setCashRegisterId] = useState("Desk 02 - Inpatient Billing");
  const [floatLimit, setFloatLimit] = useState("50000");

  // CMO
  const [adminAuthKey, setAdminAuthKey] = useState("EXEC-METRO-ROOT-2026");

  // Security Credentials
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [quickPin, setQuickPin] = useState("1234");
  const [hospitalAuthCode, setHospitalAuthCode] = useState("HOSP-CAREPULSE-2026");
  const [agreedToHipaa, setAgreedToHipaa] = useState(true);

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const getStrengthLabel = () => {
    if (!password) return { label: "Required", color: "bg-slate-700", text: "text-slate-500", width: "w-0" };
    if (strengthScore <= 1) return { label: "Weak", color: "bg-rose-500", text: "text-rose-400", width: "w-1/4" };
    if (strengthScore <= 3) return { label: "Moderate", color: "bg-amber-500", text: "text-amber-400", width: "w-3/4" };
    return { label: "Strong & HIPAA Compliant", color: "bg-emerald-500", text: "text-emerald-400", width: "w-full" };
  };

  const strength = getStrengthLabel();

  // 1-Click Sample Pre-fill
  const handleAutoFillSample = () => {
    setError(null);
    setPassword("Hospital@2026");
    setConfirmPassword("Hospital@2026");
    setQuickPin("1234");
    setHospitalAuthCode("HOSP-CAREPULSE-2026");
    setAgreedToHipaa(true);

    switch (selectedRole) {
      case "doctor":
        setFullName("Dr. Aris Thorne");
        setEmail("dr.aris@carepulse.hms");
        setPhone("+91 98765 43210");
        setNationalId("9481-2831-9012");
        setMciRegNo("NMC-REG-2024-8192");
        setSpecialization("Interventional Cardiology");
        setChamberNumber("Chamber 08 - Specialty Wing");
        setConsultationFee("850");
        setQualification("MBBS, MD, DM (Cardiology)");
        break;
      case "nurse":
        setFullName("Nurse Anita Roy");
        setEmail("anita.roy@carepulse.hms");
        setPhone("+91 98450 12345");
        setNationalId("7482-1928-3819");
        setNursingPin("SNC-RN-92819");
        setNurseCadre("ICU Clinical Specialist");
        setAssignedWard("Cardiac ICU - Floor 3");
        break;
      case "receptionist":
        setFullName("Pooja Verma");
        setEmail("pooja.v@carepulse.hms");
        setPhone("+91 91234 56789");
        setNationalId("4918-2940-1092");
        setCounterId("Counter 02 - OPD Triage");
        setShiftSlot("Morning Shift (07:00 - 15:00)");
        setLanguages("English, Hindi, Bengali");
        break;
      case "pharmacist":
        setFullName("Karthik Subramanian");
        setEmail("karthik.s@carepulse.hms");
        setPhone("+91 94440 98765");
        setNationalId("6281-9102-4829");
        setPharmacyLicense("SPC-REG-58291");
        setPharmacyTier("Central Inpatient Formulary");
        break;
      case "lab_tech":
        setFullName("Deepak Chawla");
        setEmail("deepak.c@carepulse.hms");
        setPhone("+91 99887 66554");
        setNationalId("3819-2019-4827");
        setParamedicalReg("PMC-CERT-74819");
        setLabSection("Hematology & Molecular Diagnostics");
        break;
      case "cashier":
        setFullName("Vikram Sen");
        setEmail("vikram.sen@carepulse.hms");
        setPhone("+91 97654 32109");
        setNationalId("5920-1829-4720");
        setCashRegisterId("Counter 03 - Discharge Desk");
        setFloatLimit("100000");
        break;
      case "cmo":
        setFullName("Dr. Rajeshwar Rao");
        setEmail("dr.rajeshwar@carepulse.hms");
        setPhone("+91 98111 22334");
        setNationalId("1029-3847-5610");
        setAdminAuthKey("EXEC-METRO-ROOT-2026");
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError("Please complete all mandatory staff contact details.");
      return;
    }

    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (quickPin.length !== 4) {
      setError("Quick Unlock PIN must be exactly 4 digits.");
      return;
    }

    if (!agreedToHipaa) {
      setError("You must acknowledge the clinical confidentiality and HIPAA agreement.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      // Auto login with new role and custom staff name
      login(selectedRole, fullName);

      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 800);
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
              CarePulse <span className="text-teal-400">HMS</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-400 font-mono">
              Staff Credentialing Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-teal-300 transition"
          >
            ← Back to Login
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Hospital Staff Credentialing
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                New Clinical Staff Registration
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Register clinical terminal access with role-specific departmental allocations.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoFillSample}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-teal-300 hover:text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
              title="Populate test data for selected role"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Auto-Fill Sample Data</span>
            </button>
          </div>

          {/* Error / Success Alerts */}
          {error && (
            <div className="mt-5 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-5 p-4 bg-emerald-950/50 border border-emerald-800/80 rounded-2xl flex items-center gap-3 text-xs text-emerald-200 animate-in zoom-in-95">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-emerald-100">
                  Staff Registration Approved &amp; Credentialed!
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  Clinical profile initialized for {fullName}. Redirecting to CarePulse Terminal...
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            {/* 1. Basic Staff Identity Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">
                  1
                </span>
                Personal &amp; Professional Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Aris Thorne"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hospital Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dr.aris@carepulse.hms"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    National ID / Aadhaar / Passport
                  </label>
                  <div className="relative">
                    <FileBadge className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="e.g. 9481-2831-9012"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Clinical Role Selection & Dynamic Fields */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">
                  2
                </span>
                Clinical Role &amp; Station Allocation
              </h3>

              {/* Role Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {(Object.keys(ROLES_REGISTRY) as RoleKey[]).map((rKey) => {
                  const role = ROLES_REGISTRY[rKey];
                  const isSelected = selectedRole === rKey;
                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => {
                        setSelectedRole(rKey);
                        setError(null);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                        isSelected
                          ? "bg-teal-950/50 border-teal-500 text-teal-300 ring-1 ring-teal-500/50 shadow-md shadow-teal-500/10"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={role.profile.avatar}
                        alt={role.profile.roleLabel}
                        className="w-8 h-8 rounded-lg object-cover mb-1.5 ring-1 ring-slate-700"
                      />
                      <span className="text-[11px] font-bold block truncate max-w-[90px]">
                        {role.profile.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC ROLE FIELDS CONTAINER */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-white">
                    {ROLES_REGISTRY[selectedRole].profile.roleLabel} Configuration
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${ROLES_REGISTRY[selectedRole].profile.badgeColor}`}
                  >
                    Role: {selectedRole.toUpperCase()}
                  </span>
                </div>

                {/* DOCTOR FIELDS */}
                {selectedRole === "doctor" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Medical Council Registration No. (MCI / NMC) *
                      </label>
                      <input
                        type="text"
                        value={mciRegNo}
                        onChange={(e) => setMciRegNo(e.target.value)}
                        placeholder="e.g. NMC-REG-2024-8192"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Specialization
                      </label>
                      <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      >
                        <option value="Internal Medicine">Internal Medicine</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                        <option value="General Surgery">General Surgery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Assigned Consultation Chamber
                      </label>
                      <input
                        type="text"
                        value={chamberNumber}
                        onChange={(e) => setChamberNumber(e.target.value)}
                        placeholder="e.g. Chamber 04"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Standard OPD Consultation Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        placeholder="600"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                )}

                {/* NURSE FIELDS */}
                {selectedRole === "nurse" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        State Nursing Council PIN / License *
                      </label>
                      <input
                        type="text"
                        value={nursingPin}
                        onChange={(e) => setNursingPin(e.target.value)}
                        placeholder="e.g. SNC-RN-92819"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Clinical Nursing Cadre
                      </label>
                      <select
                        value={nurseCadre}
                        onChange={(e) => setNurseCadre(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      >
                        <option value="Staff Nurse (Floor Duty)">Staff Nurse (Floor Duty)</option>
                        <option value="Senior Staff Nurse">Senior Staff Nurse</option>
                        <option value="ICU Clinical Specialist">ICU Clinical Specialist</option>
                        <option value="Nurse Supervisor / Ward In-Charge">Nurse Supervisor / Ward In-Charge</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Assigned Ward / Department
                      </label>
                      <input
                        type="text"
                        value={assignedWard}
                        onChange={(e) => setAssignedWard(e.target.value)}
                        placeholder="e.g. ICU & Post-Op Ward, Male Medical Ward"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                )}

                {/* RECEPTIONIST FIELDS */}
                {selectedRole === "receptionist" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Front Desk Counter Allocation
                      </label>
                      <input
                        type="text"
                        value={counterId}
                        onChange={(e) => setCounterId(e.target.value)}
                        placeholder="e.g. Counter 01 - Main Triage"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Assigned Shift Timing
                      </label>
                      <select
                        value={shiftSlot}
                        onChange={(e) => setShiftSlot(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      >
                        <option value="Morning Shift (07:00 - 15:00)">Morning Shift (07:00 - 15:00)</option>
                        <option value="Evening Shift (15:00 - 23:00)">Evening Shift (15:00 - 23:00)</option>
                        <option value="Night Shift (23:00 - 07:00)">Night Shift (23:00 - 07:00)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Patient Communication Languages
                      </label>
                      <input
                        type="text"
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        placeholder="e.g. English, Hindi, Regional"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                )}

                {/* PHARMACIST FIELDS */}
                {selectedRole === "pharmacist" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Pharmacy Council Registration No. *
                      </label>
                      <input
                        type="text"
                        value={pharmacyLicense}
                        onChange={(e) => setPharmacyLicense(e.target.value)}
                        placeholder="e.g. SPC-REG-58291"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Dispensing Counter Tier
                      </label>
                      <select
                        value={pharmacyTier}
                        onChange={(e) => setPharmacyTier(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      >
                        <option value="Retail Outpatient Pharmacy">Retail Outpatient Pharmacy</option>
                        <option value="Central Formulary & Inpatient Stock">Central Formulary &amp; Inpatient Stock</option>
                        <option value="Emergency & Trauma Pharmacy">Emergency &amp; Trauma Pharmacy</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* LAB TECH FIELDS */}
                {selectedRole === "lab_tech" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Paramedical Council Certificate No. *
                      </label>
                      <input
                        type="text"
                        value={paramedicalReg}
                        onChange={(e) => setParamedicalReg(e.target.value)}
                        placeholder="e.g. PMC-CERT-74819"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Diagnostic Testing Section
                      </label>
                      <select
                        value={labSection}
                        onChange={(e) => setLabSection(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      >
                        <option value="Biochemistry & Pathology">Biochemistry &amp; Pathology</option>
                        <option value="Hematology & Coagulation">Hematology &amp; Coagulation</option>
                        <option value="Microbiology & Serology">Microbiology &amp; Serology</option>
                        <option value="Blood Bank & Crossmatch">Blood Bank &amp; Crossmatch</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* CASHIER FIELDS */}
                {selectedRole === "cashier" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Billing Counter ID
                      </label>
                      <input
                        type="text"
                        value={cashRegisterId}
                        onChange={(e) => setCashRegisterId(e.target.value)}
                        placeholder="e.g. Desk 02 - Inpatient Billing"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Authorized Float Cash Limit (₹)
                      </label>
                      <input
                        type="number"
                        value={floatLimit}
                        onChange={(e) => setFloatLimit(e.target.value)}
                        placeholder="50000"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                )}

                {/* CMO FIELDS */}
                {selectedRole === "cmo" && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Executive Governance Authority Key *
                      </label>
                      <input
                        type="text"
                        value={adminAuthKey}
                        onChange={(e) => setAdminAuthKey(e.target.value)}
                        placeholder="EXEC-METRO-ROOT-2026"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Super Admin clearance requires verified board approval.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Security Credentials & Station Auth */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">
                  3
                </span>
                Terminal Security &amp; Quick Unlock PIN
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Master Password *
                    </label>
                    <span className={`text-[10px] font-bold ${strength.text}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
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

                  {/* Password strength progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                {/* 4-digit PIN for Terminal Lock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    4-Digit Quick Terminal PIN *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={4}
                      value={quickPin}
                      onChange={(e) => setQuickPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="1234"
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used to rapidly unlock clinical station when stepping away.
                  </p>
                </div>

                {/* Hospital Station Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hospital Station Authorization Code
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={hospitalAuthCode}
                      onChange={(e) => setHospitalAuthCode(e.target.value)}
                      placeholder="HOSP-CAREPULSE-2026"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Confidentiality agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreedToHipaa}
                    onChange={(e) => setAgreedToHipaa(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500/20 mt-0.5"
                  />
                  <span>
                    I confirm that I am a verified hospital staff member and agree to adhere to strict NABH &amp; HIPAA patient data confidentiality, bio-medical ethics, and clinical auditing protocols.
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <Link
                href="/login"
                className="text-xs text-slate-400 hover:text-slate-200 transition order-2 sm:order-1"
              >
                Already credentialed? <span className="text-teal-400 font-bold">Log in here</span>
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer order-1 sm:order-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Authorizing Clinical Credentials...</span>
                ) : (
                  <>
                    <span>Submit &amp; Credential Staff Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0c1322] px-4 py-3 text-center text-xs text-slate-500">
        CarePulse EHR • NABH Hospital Information System • ISO 27001 Security Standard
      </footer>
    </div>
  );
}
