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
} from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/data/notificationsMockData";
import { HospitalNotificationItem } from "@/types";

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
  const [branchOpen, setBranchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<HospitalNotificationItem[]>(MOCK_NOTIFICATIONS);
  const [selectedBranch, setSelectedBranch] = useState(
    "Metro Multispecialty - Main Branch"
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const navItems = [
    { label: "OPD", href: "/opd" },
    { label: "IPD", href: "/ipd" },
    { label: "Laboratory", href: "/laboratory" },
    { label: "Pharmacy", href: "/pharmacy" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Accounts", href: "/accounts" },
    { label: "Reports", href: "/reports" },
    { label: "Admin", href: "/admin" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c1322] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo + Branch Selector + Nav Links */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-teal-400 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                CarePulse <span className="text-teal-400 font-semibold">HMS</span>
              </span>
            </div>
          </Link>

          {/* Branch Dropdown Pill */}
          <div className="relative hidden 2xl:block">
            <button
              onClick={() => {
                setBranchOpen(!branchOpen);
                setProfileOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-teal-400" />
              <span>{selectedBranch}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {branchOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Select Hospital Branch
                </div>
                {[
                  "Metro Multispecialty - Main Branch",
                  "CarePulse North Wing - Day Care",
                  "CarePulse Diagnostic & Specialty Center",
                ].map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setBranchOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-800 transition flex items-center justify-between ${
                      selectedBranch === branch
                        ? "text-teal-400 font-semibold bg-slate-800/50"
                        : "text-slate-300"
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="hidden xl:flex items-center gap-0.5 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeNav === item.label
                    ? "text-teal-400 bg-slate-800 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Quick Menu + Notifications + Doctor Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Menu (ShortMenus) Button */}
          <button
            onClick={onOpenQuickMenu}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 transition shadow-sm group"
          >
            <span className="group-hover:text-teal-300">Quick Menu</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-slate-900 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
              ⌘ K
            </kbd>
          </button>

          {/* Notifications Bell with Interactive Drawer */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
                setBranchOpen(false);
              }}
              title="Hospital Alerts & Notifications"
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition relative cursor-pointer"
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

                <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/80">
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
                    href="/admin"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-teal-400 transition"
                  >
                    View All Hospital Governance Logs →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Doctor Profile Info & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
                setBranchOpen(false);
              }}
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-800/60 transition group cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop"
                      alt="Dr. Bhargav"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0c1322]"></span>
              </div>

              {/* Text */}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white group-hover:text-teal-300 transition">
                  Dr. Bhargav
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Chief Medical Officer
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="font-semibold text-white">Dr. Bhargav</p>
                  <p className="text-slate-400 text-[11px] font-mono">
                    dr.bhargav@metrocaredemo.com
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-md text-[10px] font-bold mt-1">
                    Chief Medical Officer (CMO)
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/doctors"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    Doctors Profile &amp; Schedule
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    Hospital Settings
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    Role &amp; Permissions (RBAC)
                  </Link>

                  <Link
                    href="/services"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Services Catalog (86 listed)
                  </Link>

                  <Link
                    href="/accounts"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    Accounts &amp; Day Book
                  </Link>
                </div>

                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Session active. Use logout to terminate credentials.");
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
