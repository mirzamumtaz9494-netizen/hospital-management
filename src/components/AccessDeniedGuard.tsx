"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, UserCheck, Lock } from "lucide-react";
import { useRole } from "@/context/RoleContext";

interface AccessDeniedGuardProps {
  moduleName: string;
  requiredRoles?: string[];
}

export const AccessDeniedGuard: React.FC<AccessDeniedGuardProps> = ({
  moduleName,
  requiredRoles = ["Chief Medical Officer (CMO)", "Super Administrator"],
}) => {
  const { currentRole, setRole, roleConfig } = useRole();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Shield Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-5 shadow-inner">
          <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-3">
          <Lock className="w-3.5 h-3.5" />
          Access Restricted • RBAC Security
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          {moduleName} Screen Restricted
        </h2>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          You are currently viewing CarePulse HMS under the{" "}
          <strong className="text-slate-800">{roleConfig.profile.roleLabel}</strong>{" "}
          profile. Access to the <strong className="text-slate-800">{moduleName}</strong>{" "}
          module is restricted by hospital clinical governance protocols.
        </p>

        {/* Roles required info */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left mb-6 text-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Authorized Roles:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {requiredRoles.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Demo Role Switcher & Back Home */}
        <div className="space-y-2.5">
          <button
            onClick={() => setRole("cmo")}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-slate-950" />
            Switch to CMO / Administrator (Full Access)
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
