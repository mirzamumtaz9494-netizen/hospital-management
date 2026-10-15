"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  BedDouble,
  FlaskConical,
  Pill,
  Layers,
  Receipt,
  AlertOctagon,
  CreditCard,
  CheckCircle,
  Search,
  UserCheck,
  FileText,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";

interface QuickMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect: (actionId: string) => void;
}

export const QuickMenuModal: React.FC<QuickMenuModalProps> = ({
  isOpen,
  onClose,
  onActionSelect,
}) => {
  const router = useRouter();
  const { canAccessAction, roleConfig } = useRole();
  const [filter, setFilter] = useState("");

  // Keyboard shortcut: close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allActions = [
    {
      id: "create_op",
      title: "Create New OP",
      description: "Register new outpatient consultation",
      icon: UserPlus,
      color: "text-teal-600 bg-teal-50 border-teal-200",
      href: null, // triggers modal
    },
    {
      id: "create_ip",
      title: "Create New IP",
      description: "Admit patient to ward / bed",
      icon: BedDouble,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      href: null, // triggers modal
    },
    {
      id: "lab_billing",
      title: "Lab Billing",
      description: "Diagnostic test invoice & order",
      icon: FlaskConical,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      href: "/laboratory",
    },
    {
      id: "pharmacy_billing",
      title: "Pharmacy Billing",
      description: "Medicine POS & prescription sales",
      icon: Pill,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      href: "/pharmacy",
    },
    {
      id: "other_services",
      title: "Add Other Services",
      description: "Nursing, ambulance, physiotherapy",
      icon: Layers,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      href: "/services",
    },
    {
      id: "add_expenses",
      title: "Add Expenses",
      description: "Daily hospital vouchers & maintenance",
      icon: Receipt,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      href: "/accounts",
    },
    {
      id: "emergency_services",
      title: "Emergency Services",
      description: "Immediate triage & trauma admission",
      icon: AlertOctagon,
      color: "text-red-600 bg-red-50 border-red-200",
      href: "/ipd",
    },
    {
      id: "advance_payment",
      title: "Collect Advance Payment",
      description: "Deposit ledger for admitted patients",
      icon: CreditCard,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
      href: "/accounts",
    },
    {
      id: "bill_settlement",
      title: "Bill Settlements",
      description: "Final IP discharge billing & receipts",
      icon: CheckCircle,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      href: "/accounts",
    },
    {
      id: "doctor_roster",
      title: "Doctors Directory",
      description: "Duty schedules & consultation suites",
      icon: UserCheck,
      color: "text-teal-700 bg-teal-50 border-teal-200",
      href: "/doctors",
    },
    {
      id: "mis_reports",
      title: "Hospital Reports",
      description: "Financial analytics & clinical census",
      icon: FileText,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      href: "/reports",
    },
    {
      id: "hospital_settings",
      title: "Hospital Settings",
      description: "System parameters, backups & DLT",
      icon: Settings,
      color: "text-slate-700 bg-slate-100 border-slate-300",
      href: "/settings",
    },
  ];

  // Filter actions allowed for current active role
  const roleAllowedActions = allActions.filter((act) =>
    canAccessAction(act.id)
  );

  const filteredActions = roleAllowedActions.filter(
    (act) =>
      act.title.toLowerCase().includes(filter.toLowerCase()) ||
      act.description.toLowerCase().includes(filter.toLowerCase())
  );

  const handleActionClick = (action: (typeof allActions)[0]) => {
    onActionSelect(action.id);
    onClose();
    if (action.href) {
      router.push(action.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Quick Menu • Clinical Action Tray
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono ${roleConfig.profile.badgeColor}`}
              >
                {roleConfig.profile.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Direct access shortcuts authorized for{" "}
              <strong className="text-slate-700">
                {roleConfig.profile.roleLabel}
              </strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search inside modal */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter quick actions (e.g. OP, IP, Lab, Bill, Services, Doctor)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Action Tiles Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
          {filteredActions.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-slate-400 text-xs">
              No matching actions found for {roleConfig.profile.badge}.
            </div>
          ) : (
            filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="group p-3.5 rounded-2xl border border-slate-200/90 hover:border-teal-500/60 bg-white hover:bg-teal-50/30 text-left transition-all duration-150 hover:shadow-md flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-teal-600 transition font-bold">
                      {action.href ? "NAVIGATE" : "MODAL"}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900 transition">
                      {action.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                      {action.description}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
              ESC
            </kbd>{" "}
            to exit
          </span>
          <span className="text-teal-600 font-semibold">
            {filteredActions.length} Authorized Actions for{" "}
            {roleConfig.profile.badge}
          </span>
        </div>
      </div>
    </div>
  );
};
