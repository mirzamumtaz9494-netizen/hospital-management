"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Building2,
  BedDouble,
  DollarSign,
  Plus,
  CheckCircle2,
  Check,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
  Copy,
  Activity,
  Calendar,
  Smartphone,
  Stethoscope,
  Pill,
  FlaskConical,
  Droplet,
  Users,
  Wallet,
  FileBarChart,
  RefreshCw,
  Info,
  ShieldCheck,
  Loader2,
  Clock,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useOwner } from "@/context/OwnerContext";
import { TenantModuleKey, HospitalTenant } from "@/types";
import { ALL_TENANT_MODULES } from "@/data/tenantMockData";
import { AddHospitalModal } from "@/components/superadmin/AddHospitalModal";
import {
  fetchAllStaff,
  approveStaff,
  rejectStaff,
  StaffUserRecord,
} from "@/lib/staffService";

export default function SuperAdminPage() {
  const {
    currentTenant,
    allTenants,
    switchTenant,
    toggleModule,
    addTenant,
    totalMonthlyRevenue,
    totalMonitoredBeds,
    resetToDefaults,
    isCloudConnected,
    isSyncing,
    refreshFromCloud,
  } = useTenant();

  const { isOwner, unlockOwner, lockOwner } = useOwner();
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [showPasskey, setShowPasskey] = useState(false);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasskeyError(null);
    const ok = unlockOwner(passkeyInput);
    if (!ok) {
      setPasskeyError("Invalid Passkey. Access is restricted strictly to the SaaS Platform Software Owner.");
    }
  };

  const [activeTab, setActiveTab] = useState<
    "Switchboard" | "Quote Generator" | "Subscriptions" | "Staff Verifications"
  >("Switchboard");

  const [staffList, setStaffList] = useState<StaffUserRecord[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  const loadStaff = async () => {
    setIsLoadingStaff(true);
    try {
      const list = await fetchAllStaff();
      setStaffList(list);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [activeTab]);

  const handleApprove = async (userId: string, userName: string) => {
    const ok = await approveStaff(userId);
    if (ok) {
      showToast(`Staff member ${userName} approved and activated!`);
      loadStaff();
    }
  };

  const handleReject = async (userId: string, userName: string) => {
    const ok = await rejectStaff(userId);
    if (ok) {
      showToast(`Staff registration for ${userName} rejected.`);
      loadStaff();
    }
  };

  const pendingStaff = staffList.filter((s) => s.status === "PENDING_APPROVAL");
  const activeStaff = staffList.filter((s) => s.status === "ACTIVE");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quote Generator State
  const [quoteHospitalName, setQuoteHospitalName] = useState("Apollo Clinic & Care");
  const [quoteBeds, setQuoteBeds] = useState(20);
  const [quoteModules, setQuoteModules] = useState<Record<TenantModuleKey, boolean>>({
    opd: true,
    ipd: true,
    pharmacy: true,
    laboratory: true,
    doctors: true,
    services: true,
    blood_bank: false,
    accounts: false,
    reports: false,
    admin: false,
    referrals: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggle = (
    tenantId: string,
    hospitalName: string,
    modKey: TenantModuleKey,
    currentVal: boolean
  ) => {
    toggleModule(tenantId, modKey, !currentVal);
    const modLabel =
      ALL_TENANT_MODULES.find((m) => m.key === modKey)?.label || modKey;
    showToast(
      `${!currentVal ? "Enabled" : "Disabled"} ${modLabel} for ${hospitalName}`
    );
  };

  // Quote calculation
  let quoteMonthlyFee = 0;
  ALL_TENANT_MODULES.forEach((mod) => {
    if (quoteModules[mod.key]) quoteMonthlyFee += mod.basePricePerMonth;
  });
  quoteMonthlyFee += quoteBeds * 250;

  const quoteWhatsAppText = `*VitalSync HMS - Commercial SaaS Proposal*
*Client:* ${quoteHospitalName}
*Capacity:* ${quoteBeds > 0 ? `${quoteBeds} Inpatient Beds` : "Day Clinic (Outpatient)"}

*Licensed Software Modules Included:*
${Object.entries(quoteModules)
  .filter(([_, enabled]) => enabled)
  .map(
    ([key]) =>
      `• ${ALL_TENANT_MODULES.find((m) => m.key === key)?.label || key}`
  )
  .join("\n")}

*Commercial Terms:*
• One-time Onboarding & Staff Training: ₹15,000
• Monthly SaaS Cloud License: ₹${quoteMonthlyFee.toLocaleString("en-IN")}/month
• Cloud Hosting & Daily Automated Backups: Included
• Live Go-Live Timeline: 2 to 3 Business Days

_Contact us to schedule your personalized live demo or begin onboarding._`;

  const copyQuoteToClipboard = () => {
    navigator.clipboard.writeText(quoteWhatsAppText);
    showToast("Proposal text copied to clipboard! Ready to paste into WhatsApp.");
  };

  // Restrict Super Admin Console to Owner Only
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-white">
        <div className="w-full max-w-md bg-[#0c1322] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 space-y-6 animate-in zoom-in-95">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-white">
                  Platform Owner Access
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Restricted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                SaaS Tenant Provisioning &amp; Master Feature Entitlements
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed">
            🔒 This console is restricted strictly to the SaaS Platform Software Owner. Hospital clients and public users cannot view or modify these controls.
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            {passkeyError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 animate-in fade-in">
                {passkeyError}
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
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter Owner Passkey"
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
              <span>Unlock Super Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              ← Return to Hospital Client Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-teal-500/50 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Super Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0c1322]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0c1322] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                VitalSync <span className="text-amber-400">Platform Super Admin</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SaaS Master Console
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tenant Provisioning, Feature Entitlements &amp; Subscription Licensing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Cloud Database Live Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Supabase Cloud (ap-south-1 Mumbai)</span>
            {isSyncing && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 ml-1" />}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Hospital</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <span>Hospital Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {/* Lock & Exit Owner Mode */}
          <button
            onClick={lockOwner}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 rounded-xl text-xs font-semibold border border-slate-800 transition cursor-pointer"
            title="Lock Owner Mode on this browser"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1720px] w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* SaaS Platform Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Active Hospital Tenants</span>
              <Building2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {allTenants.length}{" "}
              <span className="text-xs font-normal text-slate-400">Clients</span>
            </div>
            <div className="text-[11px] text-teal-400 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              All instances active &amp; healthy
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Monitored Beds</span>
              <BedDouble className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {totalMonitoredBeds}{" "}
              <span className="text-xs font-normal text-slate-400">Total IP Beds</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Apex Care (20) • Metro (50)
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Monthly Recurring Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              ₹{totalMonthlyRevenue.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-1">
              +100% On-time collected
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Multi-Tenant Architecture</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">
              10 <span className="text-xs font-normal text-slate-400">Feature Modules</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Dynamic RBAC &amp; Tenant isolation
            </div>
          </div>
        </div>

        {/* Pending Verification Notice Banner */}
        {pendingStaff.length > 0 && activeTab !== "Staff Verifications" && (
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">
                    {pendingStaff.length} New Staff Registration Awaiting Verification
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                    ACTION NEEDED
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  <strong>{pendingStaff[0].name}</strong> ({pendingStaff[0].email}) registered as {pendingStaff[0].role_label}. Review credentials to grant access.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("Staff Verifications")}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Review &amp; Approve Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "Switchboard", label: "Hospital Feature Switchboard", icon: Layers },
              { id: "Quote Generator", label: "Sales & WhatsApp Quote Calculator", icon: Wallet },
              { id: "Subscriptions", label: "Tenant Directory & Invoices", icon: Building2 },
              {
                id: "Staff Verifications",
                label: "Staff Approvals & Verification Gate",
                badge: pendingStaff.length > 0 ? `${pendingStaff.length} Pending` : undefined,
                icon: ShieldCheck,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer shadow-sm ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-amber-500/20 font-black"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive
                          ? "bg-slate-950 text-amber-300"
                          : "bg-amber-400 text-slate-950 animate-pulse"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
            title="Reset demo hospitals to initial factory state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* TAB 1: SWITCHBOARD */}
        {activeTab === "Switchboard" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 rounded-2xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    Live Feature Entitlement Switchboard
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                    Toggle modules ON or OFF for each hospital client below. When a hospital staff member logs in, their top navbar, quick menu, and dashboard widgets dynamically adapt to only show the modules enabled by you.
                  </p>
                </div>
              </div>
            </div>

            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 gap-6">
              {allTenants.map((tenant) => {
                const isCurrentActive = currentTenant.id === tenant.id;
                const activeCount = Object.values(tenant.modules).filter(Boolean).length;

                return (
                  <div
                    key={tenant.id}
                    className={`bg-slate-900/90 border rounded-3xl p-5 sm:p-6 transition shadow-lg ${
                      isCurrentActive
                        ? "border-teal-500/60 ring-1 ring-teal-500/30"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Hospital Card Top Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg">
                          <Building2 className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-base sm:text-lg text-white">
                              {tenant.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-teal-300 border border-slate-700">
                              {tenant.tenantCode}
                            </span>
                            {isCurrentActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Currently Viewing
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {tenant.unitName} • {tenant.city}, {tenant.state} • Plan:{" "}
                            <span className="text-teal-400 font-semibold">
                              {tenant.planLabel}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Right Meta & Switch Workspace Button */}
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-slate-400">Monthly Contract:</div>
                          <div className="text-sm font-bold text-emerald-400">
                            ₹{tenant.monthlyFee.toLocaleString("en-IN")}/mo
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            switchTenant(tenant.id);
                            showToast(`Switched active workspace to ${tenant.name}!`);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer ${
                            isCurrentActive
                              ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                          }`}
                        >
                          <span>{isCurrentActive ? "Active Workspace" : "Switch to Hospital"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Module Toggles Grid */}
                    <div className="pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Licensed Module Entitlements ({activeCount}/10 Enabled)
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Click any switch to toggle in real time
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                        {ALL_TENANT_MODULES.map((mod) => {
                          const isEnabled = !!tenant.modules[mod.key];
                          return (
                            <div
                              key={mod.key}
                              onClick={() =>
                                handleToggle(
                                  tenant.id,
                                  tenant.name,
                                  mod.key,
                                  isEnabled
                                )
                              }
                              className={`p-3 rounded-2xl border transition cursor-pointer select-none flex flex-col justify-between ${
                                isEnabled
                                  ? "bg-slate-800/90 border-teal-500/50 text-white shadow-sm"
                                  : "bg-slate-950/60 border-slate-800/80 text-slate-500 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className="font-bold text-xs flex items-center gap-1.5">
                                  {mod.key === "blood_bank" && (
                                    <Droplet className={`w-3.5 h-3.5 ${isEnabled ? "text-rose-400" : "text-slate-600"}`} />
                                  )}
                                  {mod.key === "ipd" && (
                                    <BedDouble className={`w-3.5 h-3.5 ${isEnabled ? "text-blue-400" : "text-slate-600"}`} />
                                  )}
                                  {mod.key === "opd" && (
                                    <Stethoscope className={`w-3.5 h-3.5 ${isEnabled ? "text-teal-400" : "text-slate-600"}`} />
                                  )}
                                  {mod.key === "pharmacy" && (
                                    <Pill className={`w-3.5 h-3.5 ${isEnabled ? "text-purple-400" : "text-slate-600"}`} />
                                  )}
                                  {mod.key === "laboratory" && (
                                    <FlaskConical className={`w-3.5 h-3.5 ${isEnabled ? "text-amber-400" : "text-slate-600"}`} />
                                  )}
                                  {mod.key === "accounts" && (
                                    <Wallet className={`w-3.5 h-3.5 ${isEnabled ? "text-emerald-400" : "text-slate-600"}`} />
                                  )}
                                  {mod.key === "reports" && (
                                    <FileBarChart className={`w-3.5 h-3.5 ${isEnabled ? "text-cyan-400" : "text-slate-600"}`} />
                                  )}
                                  <span>{mod.label}</span>
                                </span>

                                {/* Toggle Pill */}
                                <div
                                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                                    isEnabled ? "bg-teal-500" : "bg-slate-700"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                      isEnabled ? "translate-x-4" : "translate-x-0"
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-400 line-clamp-2">
                                {mod.description}
                              </div>

                              <div className="text-[10px] font-mono mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                                <span className={isEnabled ? "text-teal-400 font-bold" : "text-slate-500"}>
                                  {isEnabled ? "● Licensed" : "○ Disabled"}
                                </span>
                                <span className="text-slate-400">
                                  +₹{mod.basePricePerMonth.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: QUOTE GENERATOR */}
        {activeTab === "Quote Generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Interactive Commercial SaaS Quote Builder
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize the hospital name, bed capacity, and modules to generate an instant quote ready to send on WhatsApp or email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Prospective Hospital / Client Name
                  </label>
                  <input
                    type="text"
                    value={quoteHospitalName}
                    onChange={(e) => setQuoteHospitalName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bed Capacity (Ward Grid Quota)
                  </label>
                  <select
                    value={quoteBeds}
                    onChange={(e) => setQuoteBeds(parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    <option value={0}>0 Beds (Outpatient Day Clinic Only)</option>
                    <option value={20}>20 Beds (Standard Nursing Home / Unit 1)</option>
                    <option value={35}>35 Beds (Mid-size Hospital)</option>
                    <option value={50}>50 Beds (Multispecialty Hospital)</option>
                    <option value={100}>100 Beds (Tertiary Care Center)</option>
                  </select>
                </div>
              </div>

              {/* Module Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Modules for This Quote
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_TENANT_MODULES.map((mod) => {
                    const isChecked = !!quoteModules[mod.key];
                    return (
                      <div
                        key={mod.key}
                        onClick={() =>
                          setQuoteModules((prev) => ({
                            ...prev,
                            [mod.key]: !prev[mod.key],
                          }))
                        }
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                          isChecked
                            ? "bg-slate-800 border-teal-500/70 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs">{mod.label}</div>
                          <div className="text-[10px] text-slate-400">{mod.description}</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isChecked ? "bg-teal-500 text-slate-950" : "border border-slate-700"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Quote Preview Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-[#080d1a] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-white">Commercial Summary</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                    Official Quotation
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Client Name:</span>
                    <span className="font-bold text-white">{quoteHospitalName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Bed Allocation:</span>
                    <span className="font-bold text-white">
                      {quoteBeds > 0 ? `${quoteBeds} Inpatient Beds` : "Day Clinic"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Active Modules:</span>
                    <span className="font-bold text-teal-400">
                      {Object.values(quoteModules).filter(Boolean).length} of 10 Modules
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-400">
                    <span>One-time Setup &amp; Training:</span>
                    <span className="font-bold text-slate-200">₹15,000</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-white">Monthly SaaS License:</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      ₹{quoteMonthlyFee.toLocaleString("en-IN")}{" "}
                      <span className="text-xs font-normal text-slate-400">/mo</span>
                    </span>
                  </div>
                </div>

                {/* WhatsApp Text Preview */}
                <div className="mt-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Pitch Text Preview</span>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {quoteWhatsAppText}
                  </pre>
                </div>
              </div>

              <button
                onClick={copyQuoteToClipboard}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy WhatsApp Quote for Client</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS DIRECTORY */}
        {activeTab === "Subscriptions" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="font-bold text-base text-white">Client Hospital Contracts</h3>
                <p className="text-xs text-slate-400">
                  Billing schedules, renewal dates, and license compliance
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full">
                Combined MRR: ₹{totalMonthlyRevenue.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Hospital Client</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Beds Quota</th>
                    <th className="py-3 px-4">Modules</th>
                    <th className="py-3 px-4">Monthly Fee</th>
                    <th className="py-3 px-4">Renewal Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {allTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs">{t.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {t.unitName} • {t.city}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                        {t.tenantCode}
                      </td>
                      <td className="py-3.5 px-4">{t.planLabel}</td>
                      <td className="py-3.5 px-4 font-bold">
                        {t.bedCapacity > 0 ? `${t.bedCapacity} Beds` : "Day Clinic"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-mono">
                          {Object.values(t.modules).filter(Boolean).length}/10 Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ₹{t.monthlyFee.toLocaleString("en-IN")}/mo
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {t.renewalDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          ● {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            switchTenant(t.id);
                            showToast(`Switched active hospital to ${t.name}!`);
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                        >
                          Open Workspace
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STAFF VERIFICATIONS & APPROVAL GATE */}
        {activeTab === "Staff Verifications" && (
          <div className="space-y-6">
            {/* Banner explaining NABH/HIPAA approval gate */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    Staff Credentialing &amp; Verification Gate
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      NABH &amp; ISO 27001 Access Control
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    When candidate doctors, nurses, or receptionists register online, their access is quarantined in{" "}
                    <code className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded font-mono">PENDING_APPROVAL</code>.
                    Only when you (Super Admin) or the Hospital Chief Medical Officer clicks <strong>Approve Credential</strong>, the cloud database activates the user to <code className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">ACTIVE</code> status.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={loadStaff}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStaff ? "animate-spin text-teal-400" : ""}`} />
                  <span>Refresh Cloud Data</span>
                </button>
                <Link
                  href="/register"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Test New Registration ↗</span>
                </Link>
              </div>
            </div>

            {/* Section 1: Pending Approvals Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
                  <h3 className="font-bold text-base text-white">
                    Pending Credential Verification Queue ({pendingStaff.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {pendingStaff.length === 0 ? "All candidate registrations cleared" : "Action required"}
                </span>
              </div>

              {pendingStaff.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white">No Pending Registrations</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    All hospital staff accounts are currently verified and active. Any new candidate registering at <code className="text-teal-400">/register</code> will instantly appear here for 1-click verification.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Staff Member</th>
                        <th className="py-3 px-4">Target Hospital</th>
                        <th className="py-3 px-4">Role &amp; Department</th>
                        <th className="py-3 px-4">Phone / Contact</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Verification Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {pendingStaff.map((staff) => {
                        const hospital = allTenants.find((t) => t.id === staff.hospital_id);
                        return (
                          <tr key={staff.id} className="hover:bg-slate-800/30 transition">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white text-xs">{staff.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{staff.email}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-teal-300">
                                {hospital?.name || "Apex Care Hospital"}
                              </span>
                              <div className="text-[10px] text-slate-500 font-mono">
                                ID: {staff.hospital_id ? staff.hospital_id.substring(0, 8) : "—"}...
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-200 capitalize">{staff.role_label}</div>
                              <div className="text-[11px] text-slate-400">{staff.department}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              {staff.phone || "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1.5 w-fit">
                                <Clock className="w-3 h-3 animate-spin" />
                                PENDING APPROVAL
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleApprove(staff.id, staff.name)}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/20 cursor-pointer"
                              >
                                ✓ Approve Credential
                              </button>
                              <button
                                onClick={() => handleReject(staff.id, staff.name)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 2: Active Verified Staff Directory */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div>
                  <h3 className="font-bold text-base text-white">
                    Active Hospital Staff Directory ({activeStaff.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live credentialed clinical and operational personnel in Supabase Cloud
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  ● {activeStaff.length} Active Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Staff Member</th>
                      <th className="py-3 px-4">Assigned Hospital</th>
                      <th className="py-3 px-4">Role &amp; Department</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Access Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeStaff.map((staff) => {
                      const hospital = allTenants.find((t) => t.id === staff.hospital_id);
                      return (
                        <tr key={staff.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-xs">{staff.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{staff.email}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-teal-300">
                            {hospital?.name || "Apex Care Hospital"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-200">{staff.role_label}</div>
                            <div className="text-[10px] text-slate-500">{staff.department}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">{staff.phone || "—"}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              ● ACTIVE
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Onboard Hospital Modal */}
      <AddHospitalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTenant={async (newTenant) => {
          const created = await addTenant(newTenant);
          showToast(`Hospital ${created.name} provisioned successfully!`);
        }}
      />
    </div>
  );
}
