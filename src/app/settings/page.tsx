"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Building2,
  Stethoscope,
  Wallet,
  Bell,
  Database,
  Layers,
  Save,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HardDrive,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { useRole } from "@/context/RoleContext";
import { AccessDeniedGuard } from "@/components/AccessDeniedGuard";
import { HospitalProfileTab } from "@/components/settings/HospitalProfileTab";
import { ClinicalPreferencesTab } from "@/components/settings/ClinicalPreferencesTab";
import { BillingTaxTab } from "@/components/settings/BillingTaxTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { BackupSecurityTab } from "@/components/settings/BackupSecurityTab";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { TriggerBackupModal } from "@/components/settings/TriggerBackupModal";
import { TestNotificationModal } from "@/components/settings/TestNotificationModal";
import { AddBranchModal } from "@/components/settings/AddBranchModal";

import {
  HospitalProfileSettings,
  ClinicalPreferencesSettings,
  BillingTaxSettings,
  NotificationSettings,
  BackupSecuritySettings,
  DatabaseBackupSnapshot,
  ExternalIntegrationItem,
} from "@/types";

import {
  MOCK_HOSPITAL_PROFILE,
  MOCK_CLINICAL_PREFERENCES,
  MOCK_BILLING_TAX_SETTINGS,
  MOCK_NOTIFICATION_SETTINGS,
  MOCK_BACKUP_SECURITY_SETTINGS,
  MOCK_BACKUP_SNAPSHOTS,
  MOCK_INTEGRATIONS,
} from "@/data/settingsMockData";

export default function SettingsPage() {
  const { canAccessRoute } = useRole();
  const [activeTab, setActiveTab] = useState<
    | "Hospital Profile"
    | "Clinical & Safety"
    | "Billing & Tax"
    | "Notifications"
    | "Backup & Security"
    | "Integrations"
  >("Hospital Profile");

  // State Management
  const [profile, setProfile] = useState<HospitalProfileSettings>(
    MOCK_HOSPITAL_PROFILE
  );
  const [clinicalPrefs, setClinicalPrefs] =
    useState<ClinicalPreferencesSettings>(MOCK_CLINICAL_PREFERENCES);
  const [billingSettings, setBillingSettings] = useState<BillingTaxSettings>(
    MOCK_BILLING_TAX_SETTINGS
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(MOCK_NOTIFICATION_SETTINGS);
  const [backupSettings, setBackupSettings] = useState<BackupSecuritySettings>(
    MOCK_BACKUP_SECURITY_SETTINGS
  );
  const [snapshots, setSnapshots] = useState<DatabaseBackupSnapshot[]>(
    MOCK_BACKUP_SNAPSHOTS
  );
  const [integrations, setIntegrations] =
    useState<ExternalIntegrationItem[]>(MOCK_INTEGRATIONS);

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isTestNotifModalOpen, setIsTestNotifModalOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleSaveProfile = (updated: HospitalProfileSettings) => {
    setProfile(updated);
    showToast("Hospital profile & legal entity configurations saved successfully!");
  };

  const handleSaveClinicalPrefs = (updated: ClinicalPreferencesSettings) => {
    setClinicalPrefs(updated);
    showToast("Clinical workflow rules & patient numbering schemes updated.");
  };

  const handleSaveBillingSettings = (updated: BillingTaxSettings) => {
    setBillingSettings(updated);
    showToast("GST taxation rates and payment POS routing saved.");
  };

  const handleSaveNotificationSettings = (updated: NotificationSettings) => {
    setNotificationSettings(updated);
    showToast("Mobile SMS & WhatsApp communication triggers updated.");
  };

  const handleSaveSecuritySettings = (updated: BackupSecuritySettings) => {
    setBackupSettings(updated);
    showToast("Disaster recovery & network perimeter security policies enforced.");
  };

  const handleBackupComplete = (newSnapshot: DatabaseBackupSnapshot) => {
    setSnapshots((prev) => [newSnapshot, ...prev]);
    setBackupSettings((prev) => ({
      ...prev,
      lastBackupTime: "Just now (Instant Snapshot)",
    }));
    showToast(`Disaster recovery archive ${newSnapshot.fileName} stored in AWS GovCloud!`);
  };

  const handleAddBranch = (branchName: string) => {
    setProfile((prev) => ({
      ...prev,
      availableBranches: [...prev.availableBranches, branchName],
    }));
    showToast(`Satellite branch "${branchName}" added to hospital network.`);
  };

  const handleTestIntegration = (item: ExternalIntegrationItem) => {
    showToast(`Ping test to ${item.integrationName}: 200 OK (${item.latencyMs}ms latency)`);
  };

  const handleRefreshIntegrations = () => {
    showToast("Polling all HL7, PACS & ABDM healthcare bridges... All systems operational.");
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

  if (!canAccessRoute("/settings")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
        <Header
          activeNav="Settings"
          onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
        />
        <AccessDeniedGuard
          moduleName="Hospital Infrastructure & System Settings"
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
        activeNav="Settings"
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
              <span className="text-teal-700 font-bold">System Settings</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Hospital Settings &amp; System Configuration
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 mr-1" />
                Configured
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-500 mr-1" />
                {backupSettings.lastBackupTime.split("(")[0].trim()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Clinical numbering schemas, GST parameters, DLT communication bridges, and disaster recovery backup vaults
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                showToast("Generating comprehensive system configuration snapshot (JSON)...");
                setTimeout(() => {
                  showToast("Downloaded VitalSync-settings-backup.json");
                }, 1200);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export JSON
            </button>

            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              Trigger Backup
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs mb-6 overflow-x-auto flex items-center gap-1">
          <button
            onClick={() => setActiveTab("Hospital Profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Hospital Profile"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Hospital Profile &amp; Entity
          </button>

          <button
            onClick={() => setActiveTab("Clinical & Safety")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Clinical & Safety"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Clinical &amp; MRN Formats
          </button>

          <button
            onClick={() => setActiveTab("Billing & Tax")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Billing & Tax"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            Billing, GST &amp; Payment POS
          </button>

          <button
            onClick={() => setActiveTab("Notifications")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Notifications"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            SMS, WhatsApp &amp; Alerts
          </button>

          <button
            onClick={() => setActiveTab("Backup & Security")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Backup & Security"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Disaster Recovery &amp; Snapshots ({snapshots.length})
          </button>

          <button
            onClick={() => setActiveTab("Integrations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "Integrations"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Interoperability &amp; ABDM ({integrations.length})
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === "Hospital Profile" && (
          <HospitalProfileTab
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onAddBranch={() => setIsAddBranchModalOpen(true)}
          />
        )}

        {activeTab === "Clinical & Safety" && (
          <ClinicalPreferencesTab
            preferences={clinicalPrefs}
            onSavePreferences={handleSaveClinicalPrefs}
          />
        )}

        {activeTab === "Billing & Tax" && (
          <BillingTaxTab
            settings={billingSettings}
            onSaveSettings={handleSaveBillingSettings}
          />
        )}

        {activeTab === "Notifications" && (
          <NotificationsTab
            settings={notificationSettings}
            onSaveSettings={handleSaveNotificationSettings}
            onOpenTestModal={() => setIsTestNotifModalOpen(true)}
          />
        )}

        {activeTab === "Backup & Security" && (
          <BackupSecurityTab
            securitySettings={backupSettings}
            snapshots={snapshots}
            onTriggerBackup={() => setIsBackupModalOpen(true)}
            onSaveSecuritySettings={handleSaveSecuritySettings}
            onVerifySnapshot={(snap) => {
              showToast(`Integrity Verified: SHA-256 matches stored block for ${snap.fileName}`);
            }}
            onDownloadSnapshot={(snap) => {
              showToast(`Downloading encrypted archive: ${snap.fileName} (${snap.size})`);
            }}
          />
        )}

        {activeTab === "Integrations" && (
          <IntegrationsTab
            integrations={integrations}
            onTestIntegration={handleTestIntegration}
            onRefreshAll={handleRefreshIntegrations}
          />
        )}
      </main>

      {/* Modals */}
      <TriggerBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onBackupComplete={handleBackupComplete}
      />

      <TestNotificationModal
        isOpen={isTestNotifModalOpen}
        onClose={() => setIsTestNotifModalOpen(false)}
        onSendSuccess={(channel, target) => {
          showToast(`Test ${channel} dispatched successfully to ${target}!`);
        }}
      />

      <AddBranchModal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
        onSave={handleAddBranch}
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
