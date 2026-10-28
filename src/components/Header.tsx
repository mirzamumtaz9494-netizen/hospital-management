"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ChevronDown,
  Bell,
  Search,
  Command,
  LogOut,
  User,
  Shield,
  Stethoscope,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Wallet,
  Calendar,
  X,
  Menu,
  BedDouble,
  FlaskConical,
  Pill,
  Users,
  FileBarChart,
  Settings,
  Sparkles,
  ChevronRight,
  Smartphone,
  UserCheck,
  Check,
  KeyRound,
  Lock,
  UserPlus,
  LogIn,
  Droplet,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/data/notificationsMockData";
import { HospitalNotificationItem, TenantModuleKey } from "@/types";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useRole, RoleKey } from "@/context/RoleContext";
import { useTenant } from "@/context/TenantContext";
import { useOwner } from "@/context/OwnerContext";
import { useOfflineSync } from "@/context/OfflineSyncContext";
import { LogoutModal } from "@/components/auth/LogoutModal";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { LockScreenModal } from "@/components/auth/LockScreenModal";

interface HeaderProps {
  onOpenQuickMenu: () => void;
  activeNav?: string;
  onSelectNav?: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickMenu,
  activeNav = "Dashboard",
  onSelectNav,
}) => {
  const {
    currentRole,
    setRole,
    roleConfig,
    canAccessRoute,
    allRoles,
    lockSession,
  } = useRole();

  const {
    currentTenant,
    allTenants,
    switchTenant,
    isModuleLicensed,
  } = useTenant();

  const { isOwner, lockOwner } = useOwner();
  const {
    isOnline,
    syncState,
    pendingCount,
    lastSyncTime,
    triggerSyncNow,
    clearOutboxNow,
  } = useOfflineSync();

  const [profileOpen, setProfileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [syncHudOpen, setSyncHudOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<HospitalNotificationItem[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Primary clinical navigation items (frequently accessed)
  const primaryNavItems: {
    label: string;
    href: string;
    moduleKey: TenantModuleKey;
    isBloodBank?: boolean;
  }[] = [
    { label: "OPD", href: "/opd", moduleKey: "opd" },
    { label: "IPD", href: "/ipd", moduleKey: "ipd" },
    {
      label: "Blood Bank",
      href: "/blood-bank",
      moduleKey: "blood_bank",
      isBloodBank: true,
    },
    { label: "Pharmacy", href: "/pharmacy", moduleKey: "pharmacy" },
    { label: "Laboratory", href: "/laboratory", moduleKey: "laboratory" },
    { label: "Doctors", href: "/doctors", moduleKey: "doctors" },
  ];

  // Secondary management/tariff items
  const secondaryNavItems: {
    label: string;
    href: string;
    icon: any;
    desc: string;
    moduleKey?: TenantModuleKey;
  }[] = [
    {
      label: "Services",
      href: "/services",
      icon: Layers,
      desc: "Hospital Tariff & Diagnostic Catalog",
      moduleKey: "services",
    },
    {
      label: "Accounts",
      href: "/accounts",
      icon: Wallet,
      desc: "Cash Desk, Billing & Day Book",
      moduleKey: "accounts",
    },
    {
      label: "Reports",
      href: "/reports",
      icon: FileBarChart,
      desc: "Clinical Analytics & Revenue Exports",
      moduleKey: "reports",
    },
    {
      label: "Admin",
      href: "/admin",
      icon: Shield,
      desc: "Audit Trail & Hospital Governance",
      moduleKey: "admin",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      desc: "Clinic Profile, Printers & Tax Config",
    },
  ];

  const fullNavItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: Activity,
      desc: "Live Census & Patient Registry",
      badge: "Live",
    },
    {
      label: "OPD",
      href: "/opd",
      icon: Stethoscope,
      desc: "Outpatient Clinic & Queue",
      badge: "Active",
      moduleKey: "opd" as TenantModuleKey,
    },
    {
      label: "IPD",
      href: "/ipd",
      icon: BedDouble,
      desc: "Inpatient Wards & Bed Grid",
      badge: currentTenant.bedCapacity > 0 ? `${currentTenant.bedCapacity} Beds` : "No Beds",
      moduleKey: "ipd" as TenantModuleKey,
    },
    {
      label: "Blood Bank",
      href: "/blood-bank",
      icon: Droplet,
      desc: "Donor Registry, Blood Stock & Crossmatch",
      badge: "Live Stock",
      moduleKey: "blood_bank" as TenantModuleKey,
    },
    {
      label: "Laboratory",
      href: "/laboratory",
      icon: FlaskConical,
      desc: "Diagnostic Test Orders & Lab Reports",
      badge: "14 Orders",
      moduleKey: "laboratory" as TenantModuleKey,
    },
    {
      label: "Pharmacy",
      href: "/pharmacy",
      icon: Pill,
      desc: "Prescription Dispense & Drug Inventory",
      badge: "POS",
      moduleKey: "pharmacy" as TenantModuleKey,
    },
    {
      label: "Doctors",
      href: "/doctors",
      icon: Users,
      desc: "Specialists Roster & Schedules",
      badge: "18 On Duty",
      moduleKey: "doctors" as TenantModuleKey,
    },
    {
      label: "Services",
      href: "/services",
      icon: Layers,
      desc: "Hospital Tariff & Diagnostic Catalog",
      badge: "86 Items",
      moduleKey: "services" as TenantModuleKey,
    },
    {
      label: "Accounts",
      href: "/accounts",
      icon: Wallet,
      desc: "Cash Desk, Billing & Day Book",
      badge: "Audited",
      moduleKey: "accounts" as TenantModuleKey,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: FileBarChart,
      desc: "Clinical Analytics & Revenue Exports",
      badge: "PDF / CSV",
      moduleKey: "reports" as TenantModuleKey,
    },
    {
      label: "Admin",
      href: "/admin",
      icon: Shield,
      desc: "Audit Trail & Hospital Governance",
      badge: "RBAC",
      moduleKey: "admin" as TenantModuleKey,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      desc: "Clinic Profile, Printers & Tax Config",
      badge: "v2.4",
    },
  ];

  // Dynamically filter navigation links based on:
  // 1. User Staff Role Permissions (canAccessRoute)
  // 2. Hospital Tenant Licensed Modules (isModuleLicensed)
  const visiblePrimaryNavItems = primaryNavItems.filter(
    (item) => canAccessRoute(item.href) && isModuleLicensed(item.moduleKey)
  );

  const visibleSecondaryNavItems = secondaryNavItems.filter(
    (item) =>
      canAccessRoute(item.href) &&
      (!item.moduleKey || isModuleLicensed(item.moduleKey))
  );

  const visibleFullNavItems = fullNavItems.filter(
    (item) =>
      canAccessRoute(item.href) &&
      (!item.moduleKey || isModuleLicensed(item.moduleKey))
  );

  const isSecondaryActive = visibleSecondaryNavItems.some(
    (item) => activeNav === item.label
  );
  const activeSecondaryItem = visibleSecondaryNavItems.find(
    (item) => activeNav === item.label
  );

  return (
    <>
      {/* SaaS Multi-Tenant Owner Simulation Ribbon - Visible ONLY to the Platform Owner */}
      {isOwner && (
        <div className="bg-[#070b14] border-b border-amber-500/30 text-xs text-slate-300 px-3 sm:px-6 py-1.5 flex items-center justify-between z-50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              👑 OWNER MODE
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">Active Hospital:</span>
            <span className="font-bold text-white text-[11px] sm:text-xs truncate">
              {currentTenant.name}
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 truncate">
              {currentTenant.planLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cloud Database Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-emerald-950/60 text-emerald-300 border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Supabase Cloud (ap-south-1)</span>
            </div>

            {/* Quick Hospital Switcher Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 hidden lg:inline">Switch Client:</span>
              <select
                value={currentTenant.id}
                onChange={(e) => switchTenant(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 text-teal-300 hover:text-white rounded-lg px-2 py-0.5 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
                title="Switch Hospital Tenant Workspace"
              >
                {allTenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.bedCapacity > 0 ? `${t.bedCapacity} Beds` : "Day Clinic"})
                  </option>
                ))}
              </select>
            </div>

            {/* Super Admin Console Button */}
            <Link
              href="/super-admin"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-lg px-2.5 py-0.5 text-[11px] font-black transition shadow-sm active:scale-95"
              title="Open Platform Super Admin Console (Configure Modules & Pricing)"
            >
              <Shield className="w-3 h-3 text-slate-950" />
              <span>Super Admin Console</span>
            </Link>

            {/* Lock Owner Mode */}
            <button
              onClick={lockOwner}
              className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition cursor-pointer"
              title="Lock and hide Super Admin controls from this browser"
            >
              Lock &amp; Hide
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full bg-[#0c1322] border-b border-slate-800 text-white shadow-md">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Side: Mobile Hamburger + Brand Logo & Dynamic Tenant Identifier */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Mobile Hamburger Drawer Button */}
            <button
              onClick={() => {
                setMobileDrawerOpen(true);
                setProfileOpen(false);
                setNotificationsOpen(false);
                setRoleSwitcherOpen(false);
                setMoreOpen(false);
              }}
              aria-label="Open Navigation Drawer"
              className="xl:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo & Multi-Tenant Hospital Indicator */}
            <Link
              href="/"
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-teal-400 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1">
                    VitalSync{" "}
                    <span className="text-teal-400 font-semibold">HMS</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {currentTenant.logoBadge || `${currentTenant.unitName}`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block truncate max-w-[200px]">
                  {currentTenant.name} • {currentTenant.unitName}
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation: Primary clinical links + More dropdown (Desktop >= xl screens) */}
          <nav className="hidden xl:flex items-center justify-center gap-1 flex-1 min-w-0 px-2">
            {/* Primary Clinical Items */}
            {visiblePrimaryNavItems.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? "text-teal-300 bg-teal-500/15 border border-teal-500/30 font-semibold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent"
                  }`}
                >
                  {item.isBloodBank && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50"></span>
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Direct Secondary Links (visible on large displays >= 2xl) */}
            <div className="hidden 2xl:flex items-center gap-1">
              {visibleSecondaryNavItems.map((item) => {
                const isActive = activeNav === item.label;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "text-teal-300 bg-teal-500/15 border border-teal-500/30 font-semibold shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* "More" Dropdown on xl to 2xl screens (< 1536px) */}
            {visibleSecondaryNavItems.length > 0 && (
              <div className="relative 2xl:hidden shrink-0">
                <button
                  onClick={() => {
                    setMoreOpen(!moreOpen);
                    setProfileOpen(false);
                    setNotificationsOpen(false);
                    setRoleSwitcherOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isSecondaryActive
                      ? "text-teal-300 bg-teal-500/15 border border-teal-500/30 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent"
                  }`}
                >
                  <span>
                    {isSecondaryActive ? activeSecondaryItem?.label : "More"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {moreOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      Operations &amp; Admin
                    </div>
                    {visibleSecondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeNav === item.label;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 text-xs transition ${
                            isActive
                              ? "bg-teal-500/15 text-teal-300 font-semibold"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{item.label}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Side: Role Switcher + Quick Menu + Notifications + Dynamic User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Offline Local Storage & Transactional Cloud Sync HUD Pill */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setSyncHudOpen(!syncHudOpen);
                  setProfileOpen(false);
                  setNotificationsOpen(false);
                  setRoleSwitcherOpen(false);
                  setMoreOpen(false);
                }}
                className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold transition shadow-sm active:scale-95 cursor-pointer whitespace-nowrap border ${
                  syncState === "ONLINE_SYNCED"
                    ? "bg-emerald-950/50 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300"
                    : syncState === "SYNCING"
                    ? "bg-sky-950/50 hover:bg-sky-900/60 border-sky-500/40 text-sky-300"
                    : syncState === "OFFLINE_ACTIVE"
                    ? "bg-amber-950/60 hover:bg-amber-900/70 border-amber-500/50 text-amber-300"
                    : "bg-rose-950/50 hover:bg-rose-900/60 border-rose-500/40 text-rose-300"
                }`}
                title="Local Storage & Cloud Sync Status"
              >
                {syncState === "SYNCING" ? (
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                ) : syncState === "OFFLINE_ACTIVE" ? (
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                ) : syncState === "ONLINE_SYNCED" ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                )}

                <span className="hidden md:inline text-[11px] font-bold">
                  {syncState === "ONLINE_SYNCED"
                    ? "Cloud Synced"
                    : syncState === "SYNCING"
                    ? "Syncing..."
                    : syncState === "OFFLINE_ACTIVE"
                    ? "Offline Mode"
                    : "Sync Alert"}
                </span>

                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black bg-amber-400 text-slate-950 animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Sync Details Dropdown Modal/Card */}
              {syncHudOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs text-white animate-in zoom-in-95 duration-150 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-white text-xs">
                        Offline Engine &amp; Sync Outbox
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        isOnline
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {isOnline ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Local Hard-Drive Storage:</span>
                      <span className="text-teal-300 font-bold font-mono">
                        IndexedDB Active
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Outbox Queue Pending:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {pendingCount} records
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Successful Sync:</span>
                      <span className="font-mono text-slate-300">
                        {lastSyncTime || "Just now"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Zero Data Loss Guarantee: Patient registrations, OPD visits, and bills are automatically committed to your local browser storage and queue up for automatic two-way cloud sync whenever connectivity resumes.
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={async () => {
                        await triggerSyncNow();
                        setSyncHudOpen(false);
                      }}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Sync Outbox Queue Now
                    </button>

                    {pendingCount > 0 && (
                      <button
                        onClick={async () => {
                          await clearOutboxNow();
                          setSyncHudOpen(false);
                        }}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                        title="Force reconcile local outbox queue and restore green cloud sync state"
                      >
                        <Check className="w-3 h-3" />
                        Force Clear &amp; Reconcile Queue
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Role Switcher Pill */}
            <div className="relative hidden lg:block shrink-0">
              <button
                onClick={() => {
                  setRoleSwitcherOpen(!roleSwitcherOpen);
                  setProfileOpen(false);
                  setNotificationsOpen(false);
                  setMoreOpen(false);
                }}
                className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold text-slate-200 transition shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                title="Switch Clinical Role (Live RBAC Simulation)"
              >
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0"></span>
                <span className="hidden xl:inline text-[11px] text-slate-400 font-normal">
                  Role:
                </span>
                <span className="text-[11px] text-teal-300 font-semibold truncate max-w-[110px]">
                  {roleConfig.profile.badge}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* Role Switcher Dropdown */}
              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                    <div>
                      <span className="font-bold text-white text-xs block">
                        Switch Clinical Role
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Live Role-Based Access Control
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono font-bold">
                      {currentRole.toUpperCase()}
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
                    {allRoles.map((r) => {
                      const isSelected = r.key === currentRole;
                      return (
                        <button
                          key={r.key}
                          onClick={() => {
                            setRole(r.key);
                            setRoleSwitcherOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition flex items-center gap-2.5 cursor-pointer ${
                            isSelected
                              ? "bg-teal-500/15 border border-teal-500/30 text-white"
                              : "hover:bg-slate-800 text-slate-300 hover:text-white"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.profile.avatar}
                            alt={r.profile.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs truncate">
                                {r.profile.name}
                              </span>
                              {isSelected ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500 text-slate-950 font-bold flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" />
                                  Active
                                </span>
                              ) : (
                                <span className="text-[9px] text-slate-500">
                                  Select
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-teal-400/90 font-medium truncate">
                              {r.profile.roleLabel}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {r.profile.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Menu Button */}
            <button
              onClick={onOpenQuickMenu}
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-200 transition shadow-sm group active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="group-hover:text-teal-300 text-[11px] sm:text-xs">
                Quick Menu
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-slate-900 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
                ⌘ K
              </kbd>
            </button>

            {/* Notifications Bell with Interactive Drawer */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                  setRoleSwitcherOpen(false);
                  setMoreOpen(false);
                }}
                title="Hospital Alerts & Notifications"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition relative cursor-pointer active:scale-95"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0c1322]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Window */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        Clinical Alerts &amp; Notices
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[10px] font-bold">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold text-teal-400 hover:text-teal-300 transition cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-slate-800/80">
                    {notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.linkHref}
                        onClick={() => setNotificationsOpen(false)}
                        className={`p-3.5 block hover:bg-slate-800/50 transition ${
                          notif.unread ? "bg-slate-800/20" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              notif.category === "Critical Alert"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                : notif.category === "Access"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : notif.category === "Inventory"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                            }`}
                          >
                            {notif.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>
                        <div className="font-bold text-slate-100 text-xs mb-0.5">
                          {notif.title}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                          {notif.description}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-800 bg-slate-950/80 text-center">
                    <Link
                      href={canAccessRoute("/admin") ? "/admin" : "/"}
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-teal-400 transition"
                    >
                      View All Hospital Governance Logs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Active User Profile Info & Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                  setRoleSwitcherOpen(false);
                  setMoreOpen(false);
                }}
                className="flex items-center gap-2 pl-1.5 sm:pl-2 pr-1 py-1 rounded-xl hover:bg-slate-800/60 transition group cursor-pointer"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={roleConfig.profile.avatar}
                        alt={roleConfig.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0c1322]"></span>
                </div>

                {/* Text */}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white group-hover:text-teal-300 transition">
                    {roleConfig.profile.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                    {roleConfig.profile.roleLabel}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="font-semibold text-white">
                      {roleConfig.profile.name}
                    </p>
                    <p className="text-slate-400 text-[11px] font-mono">
                      {roleConfig.profile.email}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mt-1.5 ${roleConfig.profile.badgeColor}`}
                    >
                      {roleConfig.profile.roleLabel}
                    </span>
                  </div>

                  <div className="px-4 py-2 border-b border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Hospital Tenant:</span>
                      <span className="text-teal-400 font-medium">{currentTenant.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Department:</span>
                      <span className="text-white font-medium truncate max-w-[130px]">
                        {roleConfig.profile.department}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Session Status:</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active Shift
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        lockSession();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer text-xs"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Lock Clinical Terminal
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setChangePasswordModalOpen(true);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer text-xs"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                      Change Password
                    </button>

                    {isOwner && (
                      <Link
                        href="/super-admin"
                        onClick={() => setProfileOpen(false)}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-1.5 text-amber-300 hover:bg-slate-800 transition text-xs font-semibold"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        Platform Super Admin
                      </Link>
                    )}

                    <Link
                      href="/register"
                      onClick={() => setProfileOpen(false)}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition text-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                      Register New Staff
                    </Link>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setLogoutModalOpen(true);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      End Shift &amp; Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer (< xl screens) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex xl:hidden animate-in fade-in duration-200">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#0c1322] border-r border-slate-800 text-white h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Activity className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    VitalSync <span className="text-teal-400">HMS</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                    {currentTenant.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hospital Tenant Identifier inside Mobile Drawer */}
            <div className="p-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hospital Facility
                </span>
                {isOwner && (
                  <Link
                    href="/super-admin"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Shield className="w-2.5 h-2.5" />
                    SaaS Admin
                  </Link>
                )}
              </div>
              {isOwner ? (
                <select
                  value={currentTenant.id}
                  onChange={(e) => switchTenant(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-teal-300 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  {allTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.bedCapacity > 0 ? `${t.bedCapacity} Beds` : "Day Clinic"})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white flex items-center justify-between">
                  <span>{currentTenant.name}</span>
                  <span className="text-[10px] font-mono text-teal-400">{currentTenant.unitName}</span>
                </div>
              )}
            </div>

            {/* Role indicator & switcher inside Drawer */}
            <div className="p-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Clinical Role
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${roleConfig.profile.badgeColor}`}
                >
                  {roleConfig.profile.badge}
                </span>
              </div>
              {/* Role Select Dropdown in Drawer */}
              <select
                value={currentRole}
                onChange={(e) => setRole(e.target.value as RoleKey)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                {allRoles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.profile.badge} ({r.profile.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Action Trigger inside Drawer */}
            <div className="p-3 bg-gradient-to-r from-teal-950/40 to-slate-900 border-b border-slate-800/80">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenQuickMenu();
                }}
                className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 rounded-xl font-bold text-xs shadow-md shadow-teal-500/20 active:scale-95 transition"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Quick Action Center
                </span>
                <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-mono">
                  ⌘ K
                </span>
              </button>
            </div>

            {/* Navigation Modules List - Filtered by Tenant License & Role */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Licensed Modules ({visibleFullNavItems.length})</span>
                <span className="text-[9px] text-teal-400 font-normal">
                  {currentTenant.name}
                </span>
              </div>
              {visibleFullNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeNav === item.label ||
                  (item.label === "Dashboard" && activeNav === "Dashboard");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                      isActive
                        ? "bg-teal-500/10 border border-teal-500/30 text-teal-300 font-semibold"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive
                            ? "bg-teal-500/20 text-teal-400"
                            : "bg-slate-800/80 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isActive
                            ? "bg-teal-500/30 text-teal-200"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer: Active Profile & PWA status */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                  PWA Mobile Enabled
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  ● Standalone
                </span>
              </div>

              {/* Active Profile Info */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={roleConfig.profile.avatar}
                    alt={roleConfig.profile.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500/40"
                  />
                  <div className="text-[11px]">
                    <p className="font-semibold text-white leading-tight">
                      {roleConfig.profile.name}
                    </p>
                    <p className="text-[9px] text-teal-400">
                      {roleConfig.profile.roleLabel}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    lockSession();
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 transition"
                  title="Lock Terminal"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mobile Drawer Auth Actions */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setChangePasswordModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-teal-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Password</span>
                </button>

                <Link
                  href="/register"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Register</span>
                </Link>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>End Duty Shift &amp; Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar (Mobile / Tablet) */}
      <MobileBottomNav
        onOpenQuickMenu={onOpenQuickMenu}
        onOpenMenu={() => setMobileDrawerOpen(true)}
      />

      {/* Global Auth & Session Modals */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />

      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />

      <LockScreenModal />
    </>
  );
};
