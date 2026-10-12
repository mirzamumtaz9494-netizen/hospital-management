"use client";

import React, { useState } from "react";
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
} from "lucide-react";

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
  const [selectedBranch, setSelectedBranch] = useState("Metro Multispecialty - Main Branch");

  const navItems = [
    { label: "OPD", href: "#opd" },
    { label: "IPD", href: "#ipd" },
    { label: "Laboratory", href: "#laboratory" },
    { label: "Pharmacy", href: "#pharmacy" },
    { label: "Reports", href: "#reports" },
    { label: "Admin", href: "#admin" },
    { label: "Settings", href: "#settings" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c1322] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo + Branch Selector + Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Activity className="w-5 h-5 text-teal-400 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                CarePulse <span className="text-teal-400 font-semibold">HMS</span>
              </span>
            </div>
          </div>

          {/* Branch Dropdown Pill */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setBranchOpen(!branchOpen)}
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
                      selectedBranch === branch ? "text-teal-400 font-semibold bg-slate-800/50" : "text-slate-300"
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectNav?.(item.label);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeNav === item.label
                    ? "text-teal-400 bg-slate-800 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side: Quick Menu + Notifications + Doctor Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Menu (ShortMenus) Button */}
          <button
            onClick={onOpenQuickMenu}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 rounded-xl px-3.5 py-1.5 text-xs font-medium text-slate-200 transition shadow-sm group"
          >
            <span className="group-hover:text-teal-300">Quick Menu</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-slate-900 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
              ⌘ K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0c1322]"></span>
            </button>
          </div>

          {/* Doctor Profile Info */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-800/60 transition group"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 p-[1.5px]">
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
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="font-semibold text-white">Dr. Bhargav</p>
                  <p className="text-slate-400 text-[11px]">dr.bhargav@metrocaredemo.com</p>
                </div>
                <div className="py-1">
                  <a
                    href="#profile"
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Doctor Profile & Schedule
                  </a>
                  <a
                    href="#hospital-settings"
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Hospital Settings
                  </a>
                  <a
                    href="#admin"
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    Role & Permissions
                  </a>
                </div>
                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={() => alert("Logging out of CarePulse HMS...")}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10"
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
