"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Database,
  Cloud,
  Lock,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  HardDrive,
  KeyRound,
  FileCheck,
  Save,
  Trash2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { BackupSecuritySettings, DatabaseBackupSnapshot } from "@/types";
import { DatabasePurgeModal } from "./DatabasePurgeModal";
import {
  isCleanProductionMode,
  restoreDemoData,
  getDatabaseStats,
  DatabaseStats,
  PurgeResult,
  EVENT_NAME_DATABASE_RESET,
} from "@/lib/databaseResetService";

interface BackupSecurityTabProps {
  securitySettings: BackupSecuritySettings;
  snapshots: DatabaseBackupSnapshot[];
  onTriggerBackup: () => void;
  onSaveSecuritySettings: (updated: BackupSecuritySettings) => void;
  onVerifySnapshot: (snap: DatabaseBackupSnapshot) => void;
  onDownloadSnapshot: (snap: DatabaseBackupSnapshot) => void;
}

export const BackupSecurityTab: React.FC<BackupSecurityTabProps> = ({
  securitySettings: initialSettings,
  snapshots,
  onTriggerBackup,
  onSaveSecuritySettings,
  onVerifySnapshot,
  onDownloadSnapshot,
}) => {
  const [settings, setSettings] =
    useState<BackupSecuritySettings>(initialSettings);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [isCleanMode, setIsCleanMode] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setIsCleanMode(isCleanProductionMode());
      getDatabaseStats().then(setDbStats);
    };
    refresh();
    window.addEventListener(EVENT_NAME_DATABASE_RESET, refresh);
    return () => window.removeEventListener(EVENT_NAME_DATABASE_RESET, refresh);
  }, []);

  const handleChange = (field: keyof BackupSecuritySettings, val: any) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSecuritySettings(settings);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Database Disaster Recovery, Cold Storage &amp; Session Security
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              AES-256 GCM Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Encrypted snapshots matching dashboard backup heartbeat (Last backup: 5h ago), offsite replication, and session timeouts
          </p>
        </div>

        <button
          onClick={onTriggerBackup}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Database className="w-4 h-4" />
          Create Instant Backup Snapshot
        </button>
      </div>

      {/* 2. Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Last Backup Heartbeat
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            5h ago
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-700 font-bold">15 Oct, 01:00 PM</span>
            <span>• 1.84 GB</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cloud Target Vault
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            AWS GovCloud
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-blue-700 font-bold">Asia-South-1</span> S3 Glacier
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Encrypted Snapshots
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {snapshots.length} Verified
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-700 font-bold">100% Integrity</span> validated
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Statutory Retention
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            7 Years
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-purple-700 font-bold">MCI / NMC</span> EHR compliant
          </div>
        </div>
      </div>

      {/* 3. Database Snapshots History Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Database Backup Snapshots &amp; Cold Storage Archives
            </h3>
            <p className="text-xs text-slate-500">
              Immutable encrypted archive copies of patient EHRs, financial ledgers, and audit trails
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">Snapshot File &amp; Timestamp</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Compressed Size</th>
                <th className="py-3 px-4">Storage Destination</th>
                <th className="py-3 px-4">Encryption &amp; Hash</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {snapshots.map((snap) => (
                <tr key={snap.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">
                      {snap.fileName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {snap.timestamp}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        snap.type === "Automated Daily"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {snap.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {snap.size}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {snap.storageTarget}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    <div>{snap.encryption}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {snap.checksumSha256}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {snap.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onVerifySnapshot(snap)}
                        title="Verify SHA-256 Checksum"
                        className="px-2.5 py-1 text-teal-700 hover:bg-teal-50 border border-teal-200 rounded-lg text-xs font-bold transition"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => onDownloadSnapshot(snap)}
                        title="Download Encrypted Archive"
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Production Data Purge & Database Reset Switchboard */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Production Data Purge &amp; Database Reset Switchboard
              </h3>
              {isCleanMode ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Clean Production Slate Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Demo Sandbox Mode (Simulated Records)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Safely purges test patients, test vouchers, and trial invoices to start live with a fresh hospital database, while 100% preserving doctor logins, hospital profiles, master lab catalogs, and partner centers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCleanMode ? (
              <button
                type="button"
                onClick={async () => {
                  await restoreDemoData();
                  window.location.reload();
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Switch to Demo Sandbox
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPurgeModalOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Purge Test Database (Clean Slate)
              </button>
            )}
          </div>
        </div>

        {/* Live Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Local Test Patients</span>
            <span className="text-base font-bold text-slate-900 font-mono">
              {isCleanMode ? "0 (Clean)" : dbStats?.localPatients ?? "0"}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">External Scan Vouchers</span>
            <span className="text-base font-bold text-slate-900 font-mono">
              {isCleanMode ? "0 (Clean)" : dbStats?.externalDiagnosticOrders ?? "0"}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Preserved Partner Centers</span>
            <span className="text-base font-bold text-emerald-700 font-mono">
              4 Active (100% Preserved)
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Preserved Doctor Roster</span>
            <span className="text-base font-bold text-emerald-700 font-mono">
              6 Doctors (100% Preserved)
            </span>
          </div>
        </div>
      </div>

      {/* 5. Session Security & Intranet Access Policies */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Session Security &amp; Network Perimeter Policies
          </h3>
          <button
            type="submit"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
          >
            <Save className="w-3 h-3" />
            Save Security Rules
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Idle Terminal Auto-Logout (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={settings.idleTimeoutMinutes}
              onChange={(e) =>
                handleChange("idleTimeoutMinutes", Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              NABH standard mandates lock after 15 min inactivity
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Max Concurrent Sessions Per User
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={settings.maxConcurrentSessions}
              onChange={(e) =>
                handleChange("maxConcurrentSessions", Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Limits doctor logins across mobile &amp; OPD suite
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Hospital Intranet IP Subnet Allowed
            </label>
            <input
              type="text"
              value={settings.ipSubnetRestriction}
              onChange={(e) =>
                handleChange("ipSubnetRestriction", e.target.value)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              CIDR range for internal hospital VLAN
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Enforce Multi-Factor Authentication (2FA) Globally
              </div>
              <div className="text-[11px] text-slate-500">
                Mandatory for all clinical, pharmacy, and financial billing cashier accounts
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.enforceMfaPolicy}
            onChange={(e) =>
              handleChange("enforceMfaPolicy", e.target.checked)
            }
            className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
          />
        </div>
      </form>

      {/* 6. Database Purge Confirmation Modal */}
      <DatabasePurgeModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onSuccess={() => {
          setIsCleanMode(true);
          getDatabaseStats().then(setDbStats);
        }}
      />
    </div>
  );
};
