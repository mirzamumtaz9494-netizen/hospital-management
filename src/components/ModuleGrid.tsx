"use client";

import React from "react";
import {
  Users,
  Stethoscope,
  Bed,
  FlaskConical,
  Pill,
  UserCheck,
  Building2,
  FileText,
  Sliders,
  ShieldCheck,
  Wallet,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { MOCK_MODULES } from "@/data/mockData";
import { useRole } from "@/context/RoleContext";

interface ModuleGridProps {
  onSelectModule?: (moduleId: string) => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({ onSelectModule }) => {
  const { canAccessModule } = useRole();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "users":
        return <Users className="w-5 h-5 text-teal-600" />;
      case "stethoscope":
        return <Stethoscope className="w-5 h-5 text-teal-600" />;
      case "bed":
        return <Bed className="w-5 h-5 text-teal-600" />;
      case "flask":
        return <FlaskConical className="w-5 h-5 text-teal-600" />;
      case "pill":
        return <Pill className="w-5 h-5 text-teal-600" />;
      case "user-check":
        return <UserCheck className="w-5 h-5 text-teal-600" />;
      case "bed-single":
        return <Building2 className="w-5 h-5 text-teal-600" />;
      case "file-text":
        return <FileText className="w-5 h-5 text-teal-600" />;
      case "sliders":
        return <Sliders className="w-5 h-5 text-teal-600" />;
      case "shield-check":
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case "wallet":
        return <Wallet className="w-5 h-5 text-teal-600" />;
      case "settings":
        return <Settings className="w-5 h-5 text-teal-600" />;
      default:
        return <Users className="w-5 h-5 text-teal-600" />;
    }
  };

  // Dynamically filter modules based on active role permissions
  const visibleModules = MOCK_MODULES.filter((mod) => canAccessModule(mod.id));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {visibleModules.map((mod) => (
        <div
          key={mod.id}
          onClick={() => onSelectModule?.(mod.id)}
          className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-3.5"
        >
          {/* Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-teal-100/70 transition-transform">
            {getIcon(mod.icon)}
          </div>

          {/* Texts */}
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-1 truncate">
              {mod.title}
              {mod.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 inline-block fill-teal-500 text-white" />
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate">
              {mod.countLabel}
            </div>
            {mod.subtext && (
              <div className="text-[10px] text-slate-400 font-normal truncate">
                {mod.subtext}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
