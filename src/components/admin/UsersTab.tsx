"use client";

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Plus,
  KeyRound,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  AlertCircle,
  Building,
} from "lucide-react";
import { AdminStaffUser, PendingAccessRequest } from "@/types";

interface UsersTabProps {
  users: AdminStaffUser[];
  pendingRequests: PendingAccessRequest[];
  onAddUser: () => void;
  onOpenPendingModal: () => void;
  onToggleUserStatus: (userId: string) => void;
  onResetPassword: (user: AdminStaffUser) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  pendingRequests,
  onAddUser,
  onOpenPendingModal,
  onToggleUserStatus,
  onResetPassword,
  onApproveRequest,
  onRejectRequest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");

  const roles = [
    "All",
    "Medical Director",
    "Super Administrator",
    "Consultant Doctor",
    "Head Nurse",
    "Senior Pharmacist",
    "Chief Biochemist",
    "Billing Cashier",
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRoleFilter === "All" || u.role === selectedRoleFilter;
    const matchesStatus =
      selectedStatusFilter === "All" || u.status === selectedStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;
  const twoFactorCount = users.filter((u) => u.twoFactorEnabled).length;

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Staff Accounts
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            148
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-700 font-bold">12 active depts</span>
            <span>• Full roster</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Sessions Now
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            42
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
            <span className="text-emerald-700 font-bold">Live terminals</span>
            <span>• No lockouts</span>
          </div>
        </div>

        <div
          onClick={onOpenPendingModal}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-800 tracking-tight">
            {pendingRequests.length} Pending
          </div>
          <div className="text-xs text-amber-800 mt-1 font-semibold flex items-center gap-1">
            <span>Action needed</span>
            <span>→ Click to review</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              2FA Security Coverage
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            92.4%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-blue-700 font-bold">MFA Enforced</span>
            <span>• Biometric / OTP</span>
          </div>
        </div>
      </div>

      {/* 2. Pending Requests Quick Tray (If any pending) */}
      {pendingRequests.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                {pendingRequests.length}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Staff Access &amp; Elevation Requests Awaiting Approval
                </h3>
                <p className="text-xs text-slate-500">
                  New registrations and privilege elevation requests matching dashboard governance queue
                </p>
              </div>
            </div>
            <button
              onClick={onOpenPendingModal}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
            >
              Open Review Drawer ({pendingRequests.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.slice(0, 2).map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl p-3.5 border border-amber-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-900 text-xs">
                      {req.applicantName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {req.requestedRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 italic">
                    &ldquo;{req.justification}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>{req.department} • {req.requestDate}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRejectRequest(req.id)}
                      className="px-2 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onApproveRequest(req.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by staff name, employee ID, email, or dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All Roles" : r}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddUser}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Staff Member
          </button>
        </div>
      </div>

      {/* 4. Staff Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Hospital Staff Directory &amp; RBAC Credentials
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredUsers.length} staff records • Role assignments and authentication controls
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role &amp; Privilege</th>
                <th className="py-3 px-4">Department &amp; Designation</th>
                <th className="py-3 px-4">Security / 2FA</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No staff users found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initials = user.name
                    .replace("Dr. ", "")
                    .replace("Sister ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {user.employeeId} • {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            user.role === "Super Administrator"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : user.role === "Medical Director"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : user.role === "Consultant Doctor"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : user.role === "Head Nurse"
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : user.role === "Senior Pharmacist"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : user.role === "Chief Biochemist"
                              ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {user.department}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {user.designation}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {user.twoFactorEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="w-3 h-3" />
                            Enforced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            <ShieldAlert className="w-3 h-3" />
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-medium text-[11px]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {user.lastActive}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            user.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          ></span>
                          {user.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Reset Credentials / OTP"
                            onClick={() => onResetPassword(user)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title={
                              user.status === "Active"
                                ? "Suspend Account"
                                : "Activate Account"
                            }
                            onClick={() => onToggleUserStatus(user.id)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition border ${
                              user.status === "Active"
                                ? "text-rose-600 hover:bg-rose-50 border-rose-200"
                                : "text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                            }`}
                          >
                            {user.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
