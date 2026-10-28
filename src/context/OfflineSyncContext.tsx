"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  saveRecordLocallyAndQueue,
  getPendingOutbox,
  markOutboxCommitted,
  getAllLocalRecords,
  OutboxMutation,
  purgeOldCommittedOutbox,
} from "@/lib/offlineStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useTenant } from "./TenantContext";

export type SyncState = "ONLINE_SYNCED" | "OFFLINE_ACTIVE" | "SYNCING" | "SYNC_ERROR";

interface OfflineSyncContextValue {
  isOnline: boolean;
  syncState: SyncState;
  pendingCount: number;
  lastSyncTime: string | null;
  triggerSyncNow: () => Promise<void>;
  registerPatientOfflineSafe: (patient: any) => Promise<any>;
  createOpdTokenOfflineSafe: (token: any) => Promise<any>;
  recordBillingOfflineSafe: (billing: any) => Promise<any>;
}

const OfflineSyncContext = createContext<OfflineSyncContextValue | undefined>(undefined);

const LAST_SYNC_STORAGE_KEY = "vitalsync_last_successful_sync_v1";

export const OfflineSyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentTenant } = useTenant();
  const [isOnline, setIsOnline] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>("ONLINE_SYNCED");
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Load last sync time
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_SYNC_STORAGE_KEY);
      if (saved) setLastSyncTime(saved);
    } catch {}
  }, []);

  // Update pending outbox counter
  const refreshPendingCounter = useCallback(async () => {
    try {
      const pending = await getPendingOutbox();
      setPendingCount(pending.length);
      return pending;
    } catch {
      return [];
    }
  }, []);

  // Sync Outbox Drain Worker: Pushes queued local mutations to Supabase
  const triggerSyncNow = useCallback(async () => {
    if (!navigator.onLine || !isSupabaseConfigured() || !supabase) {
      setSyncState("OFFLINE_ACTIVE");
      return;
    }

    const pending = await refreshPendingCounter();
    if (pending.length === 0) {
      setSyncState("ONLINE_SYNCED");
      return;
    }

    setSyncState("SYNCING");

    try {
      for (const mutation of pending) {
        let uploadError = null;

        // Route payload to target Supabase table based on entity_type
        if (mutation.entity_type === "patient") {
          const { error } = await supabase.from("patients").upsert(
            {
              mr_id: mutation.payload.uhid || mutation.payload.mr_id,
              name: mutation.payload.name,
              phone: mutation.payload.phone,
              age: mutation.payload.age || 30,
              gender: mutation.payload.gender || "Other",
              blood_group: mutation.payload.bloodGroup || mutation.payload.blood_group,
              hospital_id: mutation.tenant_id,
            },
            { onConflict: "mr_id" }
          );
          uploadError = error;
        } else if (mutation.entity_type === "opd_token") {
          const { error } = await supabase.from("opd_tokens").upsert({
            token_number: mutation.payload.tokenNumber || mutation.payload.token_number,
            doctor_name: mutation.payload.doctorName || mutation.payload.doctor_name,
            department: mutation.payload.department || "General Medicine",
            consultation_fee: mutation.payload.consultationFee || 500,
            status: mutation.payload.status || "WAITING",
            date: mutation.payload.date || new Date().toISOString().split("T")[0],
            hospital_id: mutation.tenant_id,
          });
          uploadError = error;
        } else if (mutation.entity_type === "billing") {
          const { error } = await supabase.from("bill_invoices").upsert({
            invoice_number: mutation.payload.invoiceNumber || mutation.payload.invoice_number,
            service_type: mutation.payload.serviceType || "Outpatient Consultation",
            subtotal: mutation.payload.subtotal || mutation.payload.totalAmount,
            total_amount: mutation.payload.totalAmount,
            amount_paid: mutation.payload.amountPaid,
            payment_status: mutation.payload.paymentStatus || "Paid",
            payment_mode: mutation.payload.paymentMode || "Cash",
            hospital_id: mutation.tenant_id,
          });
          uploadError = error;
        }

        if (!uploadError) {
          await markOutboxCommitted(mutation.idempotency_key);
        } else {
          console.warn("Outbox item sync warning:", uploadError.message);
        }
      }

      // Refresh status after drain
      const remaining = await refreshPendingCounter();
      if (remaining.length === 0) {
        setSyncState("ONLINE_SYNCED");
        const nowFormatted = new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setLastSyncTime(nowFormatted);
        try {
          localStorage.setItem(LAST_SYNC_STORAGE_KEY, nowFormatted);
        } catch {}
      } else {
        setSyncState("SYNC_ERROR");
      }

      // Cleanup old committed records
      purgeOldCommittedOutbox();
    } catch (err) {
      console.error("Auto-sync worker failure:", err);
      setSyncState("SYNC_ERROR");
    }
  }, [refreshPendingCounter]);

  // Network Event Listeners & Heartbeat
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState("SYNCING");
      triggerSyncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncState("OFFLINE_ACTIVE");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOnline(false);
      setSyncState("OFFLINE_ACTIVE");
    } else {
      triggerSyncNow();
    }

    // Periodic heartbeat sync every 45 seconds
    const interval = setInterval(() => {
      if (navigator.onLine) {
        triggerSyncNow();
      }
    }, 45000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [triggerSyncNow]);

  // Offline-Safe Patient Registration
  const registerPatientOfflineSafe = async (patientData: any) => {
    const tenantId = currentTenant?.id || "a0000000-0000-0000-0000-000000000001";
    await saveRecordLocallyAndQueue("patients", patientData, "patient", tenantId, "INSERT");
    refreshPendingCounter();

    // If online, kick off sync immediately
    if (navigator.onLine) {
      triggerSyncNow();
    }
    return patientData;
  };

  // Offline-Safe OPD Token Generation
  const createOpdTokenOfflineSafe = async (tokenData: any) => {
    const tenantId = currentTenant?.id || "a0000000-0000-0000-0000-000000000001";
    await saveRecordLocallyAndQueue("opd_tokens", tokenData, "opd_token", tenantId, "INSERT");
    refreshPendingCounter();

    if (navigator.onLine) {
      triggerSyncNow();
    }
    return tokenData;
  };

  // Offline-Safe Billing Record
  const recordBillingOfflineSafe = async (billingData: any) => {
    const tenantId = currentTenant?.id || "a0000000-0000-0000-0000-000000000001";
    await saveRecordLocallyAndQueue(
      "billing_transactions",
      billingData,
      "billing",
      tenantId,
      "INSERT"
    );
    refreshPendingCounter();

    if (navigator.onLine) {
      triggerSyncNow();
    }
    return billingData;
  };

  return (
    <OfflineSyncContext.Provider
      value={{
        isOnline,
        syncState,
        pendingCount,
        lastSyncTime,
        triggerSyncNow,
        registerPatientOfflineSafe,
        createOpdTokenOfflineSafe,
        recordBillingOfflineSafe,
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = (): OfflineSyncContextValue => {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error("useOfflineSync must be used within an OfflineSyncProvider");
  }
  return context;
};
