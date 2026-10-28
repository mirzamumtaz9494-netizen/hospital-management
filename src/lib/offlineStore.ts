/**
 * VitalSync HMS - Offline Local Storage & Transactional Sync Outbox
 * Built with native IndexedDB for persistent hard-drive storage.
 * Survives power cuts, browser reloads, and network drops.
 */

const DB_NAME = "vitalsync_hms_local_store_v1";
const DB_VERSION = 1;

export interface OutboxMutation {
  idempotency_key: string;
  tenant_id: string;
  entity_type: "patient" | "opd_token" | "ipd_admission" | "billing" | "shift_report";
  operation: "INSERT" | "UPDATE" | "DELETE";
  payload: any;
  sync_status: "PENDING" | "SYNCING" | "COMMITTED" | "CONFLICT";
  retry_count: number;
  created_at: string;
  synced_at?: string;
  error_message?: string;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported on this platform"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;

      // 1. Local Patients Store
      if (!db.objectStoreNames.contains("patients")) {
        const store = db.createObjectStore("patients", { keyPath: "uhid" });
        store.createIndex("phone", "phone", { unique: false });
        store.createIndex("tenant_id", "tenant_id", { unique: false });
      }

      // 2. Local OPD Tokens Store
      if (!db.objectStoreNames.contains("opd_tokens")) {
        const store = db.createObjectStore("opd_tokens", { keyPath: "id" });
        store.createIndex("uhid", "uhid", { unique: false });
        store.createIndex("date", "date", { unique: false });
      }

      // 3. Local Inpatient Admissions Store
      if (!db.objectStoreNames.contains("ipd_admissions")) {
        const store = db.createObjectStore("ipd_admissions", { keyPath: "id" });
        store.createIndex("uhid", "uhid", { unique: false });
        store.createIndex("status", "status", { unique: false });
      }

      // 4. Local Billing & Payment Ledger
      if (!db.objectStoreNames.contains("billing_transactions")) {
        const store = db.createObjectStore("billing_transactions", { keyPath: "id" });
        store.createIndex("uhid", "uhid", { unique: false });
        store.createIndex("payment_mode", "payment_mode", { unique: false });
      }

      // 5. Transactional Sync Outbox
      if (!db.objectStoreNames.contains("sync_outbox")) {
        const store = db.createObjectStore("sync_outbox", { keyPath: "idempotency_key" });
        store.createIndex("sync_status", "sync_status", { unique: false });
        store.createIndex("created_at", "created_at", { unique: false });
      }

      // 6. Cashier Shift Reconciliations (Z-Reports)
      if (!db.objectStoreNames.contains("cashier_shifts")) {
        db.createObjectStore("cashier_shifts", { keyPath: "shift_id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic helper to perform IndexedDB transactions
 */
export async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = action(store);

    tx.oncomplete = () => {
      if (req) resolve(req.result);
      else resolve(true as unknown as T);
    };
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Persists a record locally and queues a sync outbox mutation atomically
 */
export async function saveRecordLocallyAndQueue(
  storeName: string,
  record: any,
  entityType: OutboxMutation["entity_type"],
  tenantId: string,
  operation: OutboxMutation["operation"] = "INSERT"
): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName, "sync_outbox"], "readwrite");
    const dataStore = tx.objectStore(storeName);
    const outboxStore = tx.objectStore("sync_outbox");

    // 1. Put record in local cache
    dataStore.put(record);

    // 2. Append to Outbox with collision-safe Idempotency Key
    const idempotencyKey = `${tenantId}_${entityType}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const mutation: OutboxMutation = {
      idempotency_key: idempotencyKey,
      tenant_id: tenantId,
      entity_type: entityType,
      operation: operation,
      payload: record,
      sync_status: "PENDING",
      retry_count: 0,
      created_at: new Date().toISOString(),
    };

    outboxStore.put(mutation);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Retrieves all items from a given local object store
 */
export async function getAllLocalRecords<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`Local store ${storeName} read failed:`, err);
    return [];
  }
}

/**
 * Fetches pending outbox mutations
 */
export async function getPendingOutbox(): Promise<OutboxMutation[]> {
  try {
    const all = await getAllLocalRecords<OutboxMutation>("sync_outbox");
    return all.filter((m) => m.sync_status === "PENDING" || m.sync_status === "SYNCING");
  } catch {
    return [];
  }
}

/**
 * Marks an outbox record as committed/synced
 */
export async function markOutboxCommitted(idempotencyKey: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sync_outbox", "readwrite");
    const store = tx.objectStore("sync_outbox");
    const getReq = store.get(idempotencyKey);

    getReq.onsuccess = () => {
      if (getReq.result) {
        const updated: OutboxMutation = {
          ...getReq.result,
          sync_status: "COMMITTED",
          synced_at: new Date().toISOString(),
        };
        store.put(updated);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Clear committed outbox entries older than 7 days to conserve disk space
 */
export async function purgeOldCommittedOutbox(): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction("sync_outbox", "readwrite");
    const store = tx.objectStore("sync_outbox");
    const req = store.getAll();

    req.onsuccess = () => {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      (req.result || []).forEach((item: OutboxMutation) => {
        if (item.sync_status === "COMMITTED" && item.synced_at) {
          const syncedTime = new Date(item.synced_at).getTime();
          if (syncedTime < sevenDaysAgo) {
            store.delete(item.idempotency_key);
          }
        }
      });
    };
  } catch {}
}
