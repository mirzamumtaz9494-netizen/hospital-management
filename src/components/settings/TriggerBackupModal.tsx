"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Database,
  Cloud,
  CheckCircle2,
  Lock,
  Loader2,
  HardDrive,
  Download,
} from "lucide-react";
import { DatabaseBackupSnapshot } from "@/types";

interface TriggerBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackupComplete: (newSnapshot: DatabaseBackupSnapshot) => void;
}

export const TriggerBackupModal: React.FC<TriggerBackupModalProps> = ({
  isOpen,
  onClose,
  onBackupComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Initiating encrypted database dump...");
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdSnapshot, setCreatedSnapshot] =
    useState<DatabaseBackupSnapshot | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStage("Initiating encrypted database dump...");
      setIsCompleted(false);
      setCreatedSnapshot(null);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 15;
        if (next < 30) {
          setStage("Serializing clinical EMR schemas & patient indices...");
        } else if (next < 60) {
          setStage("Compressing billing books & diagnostic PACS metadata...");
        } else if (next < 90) {
          setStage("Applying AES-256 GCM encryption & computing SHA-256 checksum...");
        } else {
          setStage("Transferring encrypted archive to AWS GovCloud S3 Glacier...");
        }
        return next > 100 ? 100 : next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (progress === 100 && !isCompleted) {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newSnap: DatabaseBackupSnapshot = {
        id: `snp-${Date.now()}`,
        timestamp: `${dateStr}, ${timeStr}`,
        fileName: `VitalSync_manual_snapshot_${Date.now()}.enc`,
        size: "1.86 GB",
        type: "Manual Snapshot",
        storageTarget: "AWS GovCloud S3 Glacier",
        encryption: "AES-256 GCM",
        status: "Verified & Stored",
        checksumSha256: "b4a3928170e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
      };

      setCreatedSnapshot(newSnap);
      setIsCompleted(true);
      onBackupComplete(newSnap);
    }
  }, [progress, isCompleted, onBackupComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hospital Database Snapshot Generator
              </h3>
              <p className="text-xs text-slate-500">
                Full cryptographic system backup &amp; cold vault sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isCompleted ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900">
                  Creating Disaster Recovery Snapshot
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {stage}
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Compression &amp; Vault Sync</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Backup Snapshot Successfully Created &amp; Stored
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Archived into AWS GovCloud S3 Glacier with AES-256 encryption
                </p>
              </div>

              {createdSnapshot && (
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">File Name:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {createdSnapshot.fileName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Archive Size:</span>
                    <span className="font-bold text-slate-800">
                      {createdSnapshot.size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Encryption:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {createdSnapshot.encryption}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-[10px] text-slate-400 font-mono">
                      SHA-256 Checksum:
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono truncate">
                      {createdSnapshot.checksumSha256}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs w-full"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
