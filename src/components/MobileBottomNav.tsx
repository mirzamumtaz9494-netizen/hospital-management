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
} from "lucide-react";

interface MobileBottomNavProps {
  onOpenQuickMenu: () => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenQuickMenu,
  onOpenMenu,
}) => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isOpd = pathname?.startsWith("/opd");
  const isIpd = pathname?.startsWith("/ipd");

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1322]/95 backdrop-blur-lg border-t border-slate-800/90 shadow-[0_-8px_20px_rgba(0,0,0,0.4)] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium ${
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

        {/* OPD */}
        <Link
          href="/opd"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium ${
            isOpd
              ? "text-teal-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Stethoscope
            className={`w-5 h-5 mb-0.5 ${
              isOpd ? "text-teal-400 stroke-[2.2]" : "text-slate-400"
            }`}
          />
          <span>OPD</span>
        </Link>

        {/* Floating Quick Action Button (Center FAB) */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            onClick={onOpenQuickMenu}
            aria-label="Quick Actions Menu"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-500 via-teal-400 to-cyan-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all ring-4 ring-[#0c1322]"
          >
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-bold text-teal-400 mt-0.5">Quick</span>
        </div>

        {/* IPD */}
        <Link
          href="/ipd"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium ${
            isIpd
              ? "text-teal-400 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BedDouble
            className={`w-5 h-5 mb-0.5 ${
              isIpd ? "text-teal-400 stroke-[2.2]" : "text-slate-400"
            }`}
          />
          <span>IPD</span>
        </Link>

        {/* Modules Drawer Toggle */}
        <button
          onClick={onOpenMenu}
          aria-label="Open Full Menu"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[11px] font-medium text-slate-400 hover:text-slate-200"
        >
          <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
};
