"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Building2,
  Wallet,
  Cpu,
  Terminal,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Lock,
  Layers,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { useRole } from "@/context/RoleContext";
import { AccessDeniedGuard } from "@/components/AccessDeniedGuard";
import { UsersTab } from "@/components/admin/UsersTab";
import { RolesPermissionsTab } from "@/components/admin/RolesPermissionsTab";
import { DepartmentsTab } from "@/components/admin/DepartmentsTab";
import { TariffMasterTab } from "@/components/admin/TariffMasterTab";
import { ComplianceAssetsTab } from "@/components/admin/ComplianceAssetsTab";
import { AuditLogTab } from "@/components/admin/AuditLogTab";
import { AddUserModal } from "@/components/admin/AddUserModal";
import { AddDepartmentModal } from "@/components/admin/AddDepartmentModal";
import { PendingApprovalsModal } from "@/components/admin/PendingApprovalsModal";
import { EditTariffModal } from "@/components/admin/EditTariffModal";
import { PrintAuditCertificateModal } from "@/components/admin/PrintAuditCertificateModal";

import {
  AdminStaffUser,
  RoleDefinition,
  HospitalDepartmentItem,
  DoctorRosterSchedule,
  WardTariffMaster,
  BiomedicalAssetItem,
  StatutoryLicenseItem,
  SystemAuditLogItem,
  PendingAccessRequest,
} from "@/types";

import {
  MOCK_ADMIN_STAFF_USERS,
  MOCK_PENDING_ACCESS_REQUESTS,
  MOCK_ROLE_DEFINITIONS,
  MOCK_HOSPITAL_DEPARTMENTS,
  MOCK_DOCTOR_ROSTERS,
  MOCK_WARD_TARIFFS,
  MOCK_BIOMEDICAL_ASSETS,
  MOCK_STATUTORY_LICENSES,
  MOCK_SYSTEM_AUDIT_LOGS,
} from "@/data/adminMockData";

export default function AdminPage() {
  const { canAccessRoute } = useRole();
  const [activeTab, setActiveTab] = useState<
    | "Staff Users (RBAC)"
    | "Roles & Privileges"
    | "Departments & Rosters"
    | "Ward & Tariff Masters"
    | "Biomedical & Compliance"
    | "Security Audit Trail"
  >("Staff Users (RBAC)");

  // State Management
  const [users, setUsers] = useState<AdminStaffUser[]>(MOCK_ADMIN_STAFF_USERS);
  const [pendingRequests, setPendingRequests] = useState<PendingAccessRequest[]>(
    MOCK_PENDING_ACCESS_REQUESTS
  );
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLE_DEFINITIONS);
  const [departments, setDepartments] = useState<HospitalDepartmentItem[]>(
    MOCK_HOSPITAL_DEPARTMENTS
  );
  const [rosters, setRosters] =
    useState<DoctorRosterSchedule[]>(MOCK_DOCTOR_ROSTERS);
  const [tariffs, setTariffs] =
    useState<WardTariffMaster[]>(MOCK_WARD_TARIFFS);
  const [assets, setAssets] =
    useState<BiomedicalAssetItem[]>(MOCK_BIOMEDICAL_ASSETS);
  const [licenses, setLicenses] = useState<StatutoryLicenseItem[]>(
    MOCK_STATUTORY_LICENSES
  );
  const [auditLogs, setAuditLogs] =
    useState<SystemAuditLogItem[]>(MOCK_SYSTEM_AUDIT_LOGS);

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [selectedTariffToEdit, setSelectedTariffToEdit] =
    useState<WardTariffMaster | null>(null);
  const [isAuditCertModalOpen, setIsAuditCertModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Handlers
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "Active" ? "Suspended" : "Active";
          showToast(`User ${u.name} status updated to ${newStatus}.`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (user: AdminStaffUser) => {
    showToast(`Password reset link & OTP sent to ${user.email}`);
  };

  const handleApproveRequest = (requestId: string) => {
    const req = pendingRequests.find((r) => r.id === requestId);
    if (!req) return;

    // Remove from pending
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));

    // Add to staff users
    const newUser: AdminStaffUser = {
      id: `usr-${Date.now()}`,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: req.applicantName,
      email: req.applicantEmail,
      phone: "+91 98000 00000",
      role: req.requestedRole,
      department: req.department,
      designation: `${req.requestedRole} (Approved)`,
      status: "Active",
      twoFactorEnabled: true,
      lastActive: "Just now",
      joinDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setUsers((prev) => [newUser, ...prev]);

    // Add to audit log
    const auditEntry: SystemAuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: "Vikram Sethi",
      userRole: "Super Administrator",
      actionType: "User Access",
      details: `Authorized staff credentials for ${req.applicantName} (${req.requestedRole}) in ${req.department}.`,
      ipAddress: "192.168.1.10",
      severity: "Info",
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    showToast(`Access request approved for ${req.applicantName}!`);
  };

  const handleRejectRequest = (requestId: string) => {
    const req = pendingRequests.find((r) => r.id === requestId);
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    if (req) {
      showToast(`Access elevation request rejected for ${req.applicantName}.`);
    }
  };

  const handleApproveAllRequests = () => {
    const count = pendingRequests.length;
    setPendingRequests([]);
    setIsPendingModalOpen(false);
    showToast(`Successfully authorized all ${count} pending staff access requests!`);
  };

  const handleSaveNewUser = (newUser: AdminStaffUser) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(`New staff member ${newUser.name} provisioned successfully!`);
  };

  const handleSaveNewDept = (newDept: HospitalDepartmentItem) => {
    setDepartments((prev) => [...prev, newDept]);
    showToast(`Department ${newDept.name} (${newDept.code}) created successfully!`);
  };

  const handleSaveTariff = (updated: WardTariffMaster) => {
    setTariffs((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    showToast(`Tariff updated for ${updated.wardName} (₹${updated.totalDailyTariff}/day).`);
  };

  const handleQuickAction = (actionId: string) => {
    setIsQuickMenuOpen(false);
    switch (actionId) {
      case "create_op":
        setIsNewOpModalOpen(true);
        break;
      case "create_ip":
        setIsNewIpModalOpen(true);
        break;
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

  if (!canAccessRoute("/admin")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
        <Header
          activeNav="Admin"
          onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
        />
        <AccessDeniedGuard
          moduleName="Hospital Governance & Administration"
          requiredRoles={[
            "Chief Medical Officer (CMO)",
            "Super Administrator",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeNav="Admin"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link href="/" className="hover:text-slate-600 transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-bold">Administration</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Hospital Administration &amp; System Governance
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 mr-1" />
                NABH &amp; HIPAA Governed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-Based Access Control (RBAC), Department &amp; Tariff Masters, Biomedical Assets, and Statutory Compliance Ledger
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                showToast("Exporting hospital master configuration package...");
                setTimeout(() => {
                  showToast("Configuration package saved as hospital-config-2026.json");
                }, 1200);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Config
            </button>

            <button
              onClick={() => setIsAuditCertModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-teal-800" />
              Audit Certificate
            </button>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Staff Member
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs mb-6 overflow-x-auto flex items-center gap-1">
          <button
            onClick={() => setActiveTab("Staff Users (RBAC)")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Staff Users (RBAC)"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Staff Directory &amp; RBAC ({users.length})
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("Roles & Privileges")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Roles & Privileges"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Roles &amp; Privilege Matrix
          </button>

          <button
            onClick={() => setActiveTab("Departments & Rosters")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Departments & Rosters"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Departments &amp; Duty Rosters ({departments.length})
          </button>

          <button
            onClick={() => setActiveTab("Ward & Tariff Masters")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Ward & Tariff Masters"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            Ward &amp; Tariff Masters ({tariffs.length})
          </button>

          <button
            onClick={() => setActiveTab("Biomedical & Compliance")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Biomedical & Compliance"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Biomedical Assets &amp; Licenses
          </button>

          <button
            onClick={() => setActiveTab("Security Audit Trail")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Security Audit Trail"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Security Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === "Staff Users (RBAC)" && (
          <UsersTab
            users={users}
            pendingRequests={pendingRequests}
            onAddUser={() => setIsAddUserModalOpen(true)}
            onOpenPendingModal={() => setIsPendingModalOpen(true)}
            onToggleUserStatus={handleToggleUserStatus}
            onResetPassword={handleResetPassword}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
          />
        )}

        {activeTab === "Roles & Privileges" && (
          <RolesPermissionsTab
            roles={roles}
            onSaveRolePermissions={(updatedRoles) => {
              setRoles(updatedRoles);
              showToast("Role permission policies updated and enforced across all active sessions.");
            }}
          />
        )}

        {activeTab === "Departments & Rosters" && (
          <DepartmentsTab
            departments={departments}
            rosters={rosters}
            onAddDepartment={() => setIsAddDeptModalOpen(true)}
            onEditDepartment={(dept) => {
              showToast(`Editing configurations for ${dept.name} (${dept.code})`);
            }}
          />
        )}

        {activeTab === "Ward & Tariff Masters" && (
          <TariffMasterTab
            tariffs={tariffs}
            onEditTariff={(tariff) => setSelectedTariffToEdit(tariff)}
          />
        )}

        {activeTab === "Biomedical & Compliance" && (
          <ComplianceAssetsTab
            licenses={licenses}
            assets={assets}
            onDownloadLicense={(lic) => {
              showToast(`Downloading certified copy: ${lic.documentRef}`);
            }}
            onInitiateRenewal={(lic) => {
              showToast(`Renewal workflow initiated with ${lic.authority} for ${lic.licenseNo}.`);
            }}
            onLogAssetService={(asset) => {
              showToast(`Service ticket logged with ${asset.amcVendor} for ${asset.assetName}.`);
            }}
          />
        )}

        {activeTab === "Security Audit Trail" && (
          <AuditLogTab
            logs={auditLogs}
            onExportAuditLog={() => {
              showToast("Exporting immutable SHA-256 audit log ledger (CSV)...");
              setTimeout(() => {
                showToast("Downloaded carepulse-audit-trail-2026.csv");
              }, 1200);
            }}
            onPrintCertificate={() => setIsAuditCertModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSave={handleSaveNewUser}
      />

      <AddDepartmentModal
        isOpen={isAddDeptModalOpen}
        onClose={() => setIsAddDeptModalOpen(false)}
        onSave={handleSaveNewDept}
      />

      <PendingApprovalsModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        requests={pendingRequests}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onApproveAll={handleApproveAllRequests}
      />

      <EditTariffModal
        isOpen={!!selectedTariffToEdit}
        onClose={() => setSelectedTariffToEdit(null)}
        tariff={selectedTariffToEdit}
        onSave={handleSaveTariff}
      />

      <PrintAuditCertificateModal
        isOpen={isAuditCertModalOpen}
        onClose={() => setIsAuditCertModalOpen(false)}
      />

      {/* Global Clinical Action Tray Modals */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={handleQuickAction}
      />

      <CreateOpModal
        isOpen={isNewOpModalOpen}
        onClose={() => setIsNewOpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewOpModalOpen(false);
          showToast(`OP consultation generated for ${patient.name}`);
        }}
      />

      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewIpModalOpen(false);
          showToast(`IP admission registered for ${patient.name}`);
        }}
      />
    </div>
  );
}
