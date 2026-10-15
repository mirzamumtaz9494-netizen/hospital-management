"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Check,
  X,
  Users,
  Info,
  Sliders,
  Save,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { RoleDefinition, StaffRole } from "@/types";

interface RolesPermissionsTabProps {
  roles: RoleDefinition[];
  onSaveRolePermissions: (updatedRoles: RoleDefinition[]) => void;
}

export const RolesPermissionsTab: React.FC<RolesPermissionsTabProps> = ({
  roles: initialRoles,
  onSaveRolePermissions,
}) => {
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<StaffRole>(
    "Consultant Doctor"
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const permissionLabels: Array<{
    key: keyof RoleDefinition["permissions"];
    title: string;
    description: string;
    category: "Clinical" | "Financial" | "Pharmacy & Lab" | "System";
  }> = [
    {
      key: "canViewMedicalRecords",
      title: "View Patient Medical Records (EMR/EHR)",
      description: "Access diagnostic history, doctor notes, allergies, and vitals",
      category: "Clinical",
    },
    {
      key: "canPrescribeMedication",
      title: "Prescribe Medication & Clinical Orders",
      description: "Issue e-prescriptions, lab investigations, and surgical notes",
      category: "Clinical",
    },
    {
      key: "canAdmitDischargeIP",
      title: "Admit & Discharge Inpatients (IPD)",
      description: "Assign hospital beds, initiate bed transfers, and approve discharges",
      category: "Clinical",
    },
    {
      key: "canWaiveBillDiscounts",
      title: "Authorize Bill Discounts & Fee Waivers",
      description: "Apply clinical concession or management discount waivers on final bills",
      category: "Financial",
    },
    {
      key: "canExportFinancialMIS",
      title: "Export Financial Books & Revenue MIS",
      description: "Download daily collection ledgers, department revenues, and GST reports",
      category: "Financial",
    },
    {
      key: "canDispenseNarcotics",
      title: "Dispense Narcotics & Controlled Substances",
      description: "Access Schedule H1 / NDPS narcotic lockbox and authorize issues",
      category: "Pharmacy & Lab",
    },
    {
      key: "canSignLabResults",
      title: "Sign & Authorize NABL Diagnostic Reports",
      description: "Final verification and digital signature on pathology & biochemistry results",
      category: "Pharmacy & Lab",
    },
    {
      key: "canManageUsers",
      title: "User Provisioning & Role Assignments",
      description: "Create employee logins, reset passwords, and assign system roles",
      category: "System",
    },
    {
      key: "canEditTariffMasters",
      title: "Modify Bed & Tariff Rate Masters",
      description: "Update room tariffs, nursing rates, and clinical consultation fees",
      category: "System",
    },
    {
      key: "canAccessAuditLogs",
      title: "Access System Security Audit Logs",
      description: "Inspect immutable security trails, login timestamps, and event logs",
      category: "System",
    },
  ];

  const handleToggle = (
    roleName: StaffRole,
    permKey: keyof RoleDefinition["permissions"]
  ) => {
    // Prevent changing Super Administrator permissions
    if (roleName === "Super Administrator") return;

    setRoles((prev) =>
      prev.map((r) => {
        if (r.roleName === roleName) {
          return {
            ...r,
            permissions: {
              ...r.permissions,
              [permKey]: !r.permissions[permKey],
            },
          };
        }
        return r;
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSaveRolePermissions(roles);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    setRoles(initialRoles);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Role-Based Access Control (RBAC) &amp; Privilege Matrix
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Zero Trust Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Define granular clinical, financial, and administrative privileges across 7 hospital staff tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
              hasUnsavedChanges
                ? "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            Save Permission Matrix
          </button>
        </div>
      </div>

      {/* 2. Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {roles.map((role) => {
          const isSelected = selectedRole === role.roleName;
          const activePermsCount = Object.values(role.permissions).filter(Boolean).length;

          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.roleName)}
              className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                isSelected
                  ? "bg-teal-50/60 border-teal-500 shadow-xs ring-1 ring-teal-500"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs">
                  {role.roleName}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {role.usersCount} users
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                {role.description}
              </p>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-600 font-medium">
                <span>{activePermsCount} of 10 enabled</span>
                <span
                  className={`font-bold ${
                    isSelected ? "text-teal-700" : "text-slate-400"
                  }`}
                >
                  {isSelected ? "Active View" : "Click to view"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Comprehensive Interactive Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Permission Allocation Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Click any toggle to customize privilege overrides. Super Administrator remains immutable.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            NABH Standard: MUM.4 (Staff Privileging)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold">
                <th className="py-3 px-4 min-w-[260px]">Capability / Security Policy</th>
                {roles.map((r) => (
                  <th
                    key={r.id}
                    className={`py-3 px-2 text-center min-w-[100px] ${
                      selectedRole === r.roleName
                        ? "bg-teal-100/50 text-teal-900 font-black"
                        : ""
                    }`}
                  >
                    <div className="truncate text-[11px]">{r.roleName}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionLabels.map((perm) => (
                <tr key={perm.key} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-xs">
                      {perm.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {perm.description}
                    </div>
                  </td>

                  {roles.map((r) => {
                    const isGranted = r.permissions[perm.key];
                    const isSuperAdmin = r.roleName === "Super Administrator";

                    return (
                      <td
                        key={r.id}
                        className={`py-3 px-2 text-center ${
                          selectedRole === r.roleName ? "bg-teal-50/30" : ""
                        }`}
                      >
                        <button
                          disabled={isSuperAdmin}
                          onClick={() => handleToggle(r.roleName, perm.key)}
                          title={
                            isSuperAdmin
                              ? "Super Admin privileges cannot be revoked"
                              : isGranted
                              ? "Click to revoke privilege"
                              : "Click to grant privilege"
                          }
                          className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition ${
                            isGranted
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200"
                          } ${isSuperAdmin ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
                        >
                          {isGranted ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
