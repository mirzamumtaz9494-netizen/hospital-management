"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  BedDouble,
  Sparkles,
  Menu,
  Pill,
  FlaskConical,
  Wallet,
  Layers,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";

interface MobileBottomNavProps {
  onOpenQuickMenu: () => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenQuickMenu,
  onOpenMenu,
}) => {
  const pathname = usePathname();
  const { currentRole } = useRole();

  const isHome = pathname === "/";

  // Dynamic slot 1 and slot 2 items based on active staff role
  let slot1 = { label: "OPD", href: "/opd", icon: Stethoscope };
  let slot2 = { label: "IPD", href: "/ipd", icon: BedDouble };

  if (currentRole === "pharmacist") {
    slot1 = { label: "Pharmacy", href: "/pharmacy", icon: Pill };
    slot2 = { label: "Services", href: "/services", icon: Layers };
  } else if (currentRole === "lab_tech") {
    slot1 = { label: "Lab", href: "/laboratory", icon: FlaskConical };
    slot2 = { label: "Services", href: "/services", icon: Layers };
  } else if (currentRole === "cashier") {
    slot1 = { label: "Accounts", href: "/accounts", icon: Wallet };
    slot2 = { label: "OPD", href: "/opd", icon: Stethoscope };
  }

  const isSlot1Active = pathname?.startsWith(slot1.href);
  const isSlot2Active = pathname?.startsWith(slot2.href);

  const Slot1Icon = slot1.icon;
  const Slot2Icon = slot2.icon;

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1322]/95 backdrop-blur-lg border-t border-slate-800/90 shadow-[0_-8px_20px_rgba(0,0,0,0.4)] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium active:scale-95 ${
            isHome
              ? "text-teal-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <LayoutDashboard
            className={`w-5 h-5 mb-0.5 ${
              isHome ? "text-teal-400 stroke-[2.2]" : "text-slate-400"
            }`}
          />
          <span>Home</span>
        </Link>

        {/* Slot 1 (Role-specific) */}
        <Link
          href={slot1.href}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium active:scale-95 ${
            isSlot1Active
              ? "text-teal-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Slot1Icon
            className={`w-5 h-5 mb-0.5 ${
              isSlot1Active ? "text-teal-400 stroke-[2.2]" : "text-slate-400"
            }`}
          />
          <span>{slot1.label}</span>
        </Link>

        {/* Floating Quick Action Button (Center FAB) */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            onClick={onOpenQuickMenu}
            aria-label="Quick Actions Menu"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-500 via-teal-400 to-cyan-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all ring-4 ring-[#0c1322] cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-bold text-teal-400 mt-0.5">Quick</span>
        </div>

        {/* Slot 2 (Role-specific) */}
        <Link
          href={slot2.href}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium active:scale-95 ${
            isSlot2Active
              ? "text-teal-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Slot2Icon
            className={`w-5 h-5 mb-0.5 ${
              isSlot2Active ? "text-teal-400 stroke-[2.2]" : "text-slate-400"
            }`}
          />
          <span>{slot2.label}</span>
        </Link>

        {/* Modules Drawer Toggle */}
        <button
          onClick={onOpenMenu}
          aria-label="Open Full Menu"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium text-slate-400 hover:text-slate-200 active:scale-95 cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
};
