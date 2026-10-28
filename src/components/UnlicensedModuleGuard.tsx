"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Layers, Shield, Sparkles } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { TenantModuleKey } from "@/types";

interface UnlicensedModuleGuardProps {
  moduleName: string;
  moduleKey: TenantModuleKey;
}

export const UnlicensedModuleGuard: React.FC<UnlicensedModuleGuardProps> = ({
  moduleName,
  moduleKey,
}) => {
  const { currentTenant, switchTenant, toggleModule } = useTenant();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Amber Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mb-5 shadow-inner">
          <Layers className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          Module Unlicensed • Multi-Tenant SaaS
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          {moduleName} Not Included
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          <strong className="text-slate-900">{currentTenant.name}</strong> is currently on the{" "}
          <strong className="text-teal-700">{currentTenant.planLabel}</strong>.{" "}
          The <strong>{moduleName}</strong> module is an optional component not licensed for this hospital.
        </p>

        {/* Plan Feature Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 text-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Hospital Active License</span>
            <span className="font-mono text-teal-600 font-bold">{currentTenant.tenantCode}</span>
          </div>
          <div className="space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span>Beds Licensed:</span>
              <span className="font-bold">{currentTenant.bedCapacity > 0 ? `${currentTenant.bedCapacity} Beds` : "0 (Outpatient Only)"}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Subscription:</span>
              <span className="font-bold text-slate-900">₹{currentTenant.monthlyFee.toLocaleString("en-IN")}/mo</span>
            </div>
            <div className="flex justify-between">
              <span>Module Status:</span>
              <span className="text-amber-600 font-bold">Unsubscribed / Disabled</span>
            </div>
          </div>
        </div>

        {/* Quick Activation Action for Demo */}
        <div className="space-y-2">
          <button
            onClick={() => toggleModule(currentTenant.id, moduleKey, true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enable {moduleName} for This Hospital (1-Click Demo)</span>
          </button>

          <Link
            href="/super-admin"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Open Platform Super Admin Console</span>
          </Link>

          <Link
            href="/"
            className="w-full py-2 px-4 text-slate-600 hover:text-slate-900 text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Hospital Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
