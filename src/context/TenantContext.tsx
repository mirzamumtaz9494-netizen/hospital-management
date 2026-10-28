"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HospitalTenant,
  TenantModuleKey,
  TenantPlanKey,
} from "@/types";
import { INITIAL_HOSPITAL_TENANTS, ALL_TENANT_MODULES } from "@/data/tenantMockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface TenantContextValue {
  currentTenant: HospitalTenant;
  allTenants: HospitalTenant[];
  switchTenant: (tenantId: string) => void;
  toggleModule: (
    tenantId: string,
    moduleKey: TenantModuleKey,
    enabled: boolean
  ) => Promise<void> | void;
  updateTenantBedCapacity: (tenantId: string, beds: number) => Promise<void> | void;
  addTenant: (
    newTenant: Omit<HospitalTenant, "id" | "createdAt">
  ) => Promise<HospitalTenant> | HospitalTenant;
  isModuleLicensed: (moduleKey: TenantModuleKey) => boolean;
  canAccessRouteForTenant: (pathname: string) => boolean;
  totalMonthlyRevenue: number;
  totalMonitoredBeds: number;
  resetToDefaults: () => void;
  isCloudConnected: boolean;
  isSyncing: boolean;
  refreshFromCloud: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

const TENANTS_STORAGE_KEY = "vitalsync_hospital_tenants_v1";
const ACTIVE_TENANT_STORAGE_KEY = "vitalsync_active_tenant_id_v1";

// Mapper function: converts PostgreSQL snake_case to HospitalTenant camelCase
function mapDbTenant(row: any): HospitalTenant {
  return {
    id: String(row.id),
    tenantCode: row.tenant_code || "HOSP-01",
    name: row.name || "Hospital",
    unitName: row.unit_name || "Main Branch",
    tagline: row.tagline || "",
    city: row.city || "Mumbai",
    state: row.state || "Maharashtra",
    contactEmail: row.contact_email || "admin@hospital.com",
    contactPhone: row.contact_phone || "+91 90000 00000",
    plan: (row.plan as TenantPlanKey) || "standard_hospital",
    planLabel: row.plan_label || "Standard Hospital Care",
    bedCapacity: Number(row.bed_capacity) || 0,
    status: (row.status as any) || "Active",
    renewalDate: row.renewal_date || new Date().toISOString().split("T")[0],
    monthlyFee: Number(row.monthly_fee) || 0,
    currency: row.currency || "INR",
    modules: row.modules || {
      opd: true,
      ipd: true,
      pharmacy: true,
      laboratory: true,
      doctors: true,
      services: true,
      blood_bank: false,
      accounts: false,
      reports: false,
      admin: false,
    },
    primaryColor: row.primary_color || "teal",
    logoBadge:
      row.logo_badge ||
      (Number(row.bed_capacity) > 0
        ? `${row.unit_name} • ${row.bed_capacity} Beds`
        : "Day Clinic • Outpatient Only"),
    createdAt: row.created_at || new Date().toISOString().split("T")[0],
  };
}

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tenants, setTenants] = useState<HospitalTenant[]>(INITIAL_HOSPITAL_TENANTS);
  const [activeTenantId, setActiveTenantId] = useState<string>("a0000000-0000-0000-0000-000000000001");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Function to fetch the latest tenants from Supabase
  const refreshFromCloud = async () => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      setIsSyncing(true);
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("tenant_code", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbTenant);
        setTenants(mapped);
        setIsCloudConnected(true);
        try {
          localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(mapped));
        } catch {}
      }
    } catch (err) {
      console.warn("Could not fetch cloud tenants, using local cache:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 1. Initial Load: localStorage first, then sync with Cloud
  useEffect(() => {
    try {
      const savedTenants = localStorage.getItem(TENANTS_STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_TENANT_STORAGE_KEY);

      if (savedTenants) {
        const parsed = JSON.parse(savedTenants);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTenants(parsed);
        }
      }

      if (savedActiveId) {
        setActiveTenantId(savedActiveId);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoaded(true);
    }

    // Now attempt cloud load
    refreshFromCloud();

    // Setup Supabase Realtime Subscription
    let channel: any = null;
    if (isSupabaseConfigured() && supabase) {
      channel = supabase
        .channel("public-tenants-sync")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tenants" },
          () => {
            refreshFromCloud();
          }
        )
        .subscribe();
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Save changes to localStorage
  const persistTenants = (updated: HospitalTenant[]) => {
    setTenants(updated);
    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const persistActiveId = (id: string) => {
    setActiveTenantId(id);
    try {
      localStorage.setItem(ACTIVE_TENANT_STORAGE_KEY, id);
    } catch {}
  };

  // Find active tenant by id or tenantCode, fallback to first
  const currentTenant: HospitalTenant =
    tenants.find((t) => t.id === activeTenantId || t.tenantCode === activeTenantId) ||
    tenants[0] ||
    INITIAL_HOSPITAL_TENANTS[0];

  const switchTenant = (tenantId: string) => {
    const target = tenants.find((t) => t.id === tenantId || t.tenantCode === tenantId);
    if (target) {
      persistActiveId(target.id);
    }
  };

  // Live toggle module for any hospital tenant
  const toggleModule = async (
    tenantId: string,
    moduleKey: TenantModuleKey,
    enabled: boolean
  ) => {
    let targetUpdatedTenant: HospitalTenant | null = null;

    const updated = tenants.map((tenant) => {
      if (tenant.id !== tenantId && tenant.tenantCode !== tenantId) return tenant;

      const newModules = {
        ...tenant.modules,
        [moduleKey]: enabled,
      };

      // Recalculate estimated fee
      let calculatedFee = 0;
      ALL_TENANT_MODULES.forEach((mod) => {
        if (newModules[mod.key]) {
          calculatedFee += mod.basePricePerMonth;
        }
      });
      calculatedFee += tenant.bedCapacity * 250;

      const modified: HospitalTenant = {
        ...tenant,
        modules: newModules,
        monthlyFee: calculatedFee,
      };

      targetUpdatedTenant = modified;
      return modified;
    });

    // 1. Optimistic local update
    persistTenants(updated);

    // 2. Cloud DB update in Supabase
    if (isSupabaseConfigured() && supabase && targetUpdatedTenant) {
      setIsSyncing(true);
      try {
        const { error } = await supabase
          .from("tenants")
          .update({
            modules: (targetUpdatedTenant as HospitalTenant).modules,
            monthly_fee: (targetUpdatedTenant as HospitalTenant).monthlyFee,
          })
          .eq("id", (targetUpdatedTenant as HospitalTenant).id);

        if (error) {
          console.error("Supabase module sync error:", error);
        }
      } catch (err) {
        console.error("Supabase sync failed:", err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const updateTenantBedCapacity = async (tenantId: string, beds: number) => {
    let targetUpdatedTenant: HospitalTenant | null = null;

    const updated = tenants.map((tenant) => {
      if (tenant.id !== tenantId && tenant.tenantCode !== tenantId) return tenant;
      const logoBadge = beds > 0 ? `${tenant.unitName} • ${beds} Beds` : "Day Clinic • Outpatient Only";
      const modified: HospitalTenant = {
        ...tenant,
        bedCapacity: beds,
        logoBadge,
      };
      targetUpdatedTenant = modified;
      return modified;
    });

    persistTenants(updated);

    if (isSupabaseConfigured() && supabase && targetUpdatedTenant) {
      setIsSyncing(true);
      try {
        await supabase
          .from("tenants")
          .update({
            bed_capacity: beds,
            logo_badge: (targetUpdatedTenant as HospitalTenant).logoBadge,
          })
          .eq("id", (targetUpdatedTenant as HospitalTenant).id);
      } catch (err) {
        console.error("Supabase bed update failed:", err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const addTenant = async (
    newTenantData: Omit<HospitalTenant, "id" | "createdAt">
  ): Promise<HospitalTenant> => {
    // 1. Attempt Cloud Insert in Supabase
    if (isSupabaseConfigured() && supabase) {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase
          .from("tenants")
          .insert({
            tenant_code: newTenantData.tenantCode,
            name: newTenantData.name,
            unit_name: newTenantData.unitName,
            city: newTenantData.city,
            state: newTenantData.state,
            contact_email: newTenantData.contactEmail,
            contact_phone: newTenantData.contactPhone,
            plan: newTenantData.plan,
            plan_label: newTenantData.planLabel,
            bed_capacity: newTenantData.bedCapacity,
            status: newTenantData.status,
            renewal_date: newTenantData.renewalDate,
            monthly_fee: newTenantData.monthlyFee,
            currency: newTenantData.currency,
            logo_badge: newTenantData.logoBadge,
            modules: newTenantData.modules,
          })
          .select()
          .single();

        if (!error && data) {
          const created = mapDbTenant(data);
          const nextTenants = [...tenants.filter((t) => t.id !== created.id), created];
          persistTenants(nextTenants);
          setIsSyncing(false);
          return created;
        }
      } catch (err) {
        console.error("Cloud tenant creation error:", err);
      } finally {
        setIsSyncing(false);
      }
    }

    // Fallback: local tenant creation
    const newId = `hospital-${Date.now()}`;
    const newTenant: HospitalTenant = {
      ...newTenantData,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [...tenants, newTenant];
    persistTenants(updated);
    return newTenant;
  };

  const isModuleLicensed = (moduleKey: TenantModuleKey): boolean => {
    if (!currentTenant || !currentTenant.modules) return false;
    return !!currentTenant.modules[moduleKey];
  };

  const canAccessRouteForTenant = (pathname: string): boolean => {
    if (!pathname || pathname === "/" || pathname === "/super-admin") return true;
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) return true;

    if (pathname.startsWith("/opd")) return isModuleLicensed("opd");
    if (pathname.startsWith("/ipd")) return isModuleLicensed("ipd");
    if (pathname.startsWith("/pharmacy")) return isModuleLicensed("pharmacy");
    if (pathname.startsWith("/laboratory")) return isModuleLicensed("laboratory");
    if (pathname.startsWith("/blood-bank")) return isModuleLicensed("blood_bank");
    if (pathname.startsWith("/doctors")) return isModuleLicensed("doctors");
    if (pathname.startsWith("/services")) return isModuleLicensed("services");
    if (pathname.startsWith("/accounts")) return isModuleLicensed("accounts");
    if (pathname.startsWith("/reports")) return isModuleLicensed("reports");
    if (pathname.startsWith("/admin")) return isModuleLicensed("admin");

    return true;
  };

  const totalMonthlyRevenue = tenants.reduce(
    (sum, t) => sum + (t.status === "Active" ? t.monthlyFee : 0),
    0
  );

  const totalMonitoredBeds = tenants.reduce(
    (sum, t) => sum + (t.status === "Active" ? t.bedCapacity : 0),
    0
  );

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(TENANTS_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_TENANT_STORAGE_KEY);
    } catch {}
    refreshFromCloud();
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        allTenants: tenants,
        switchTenant,
        toggleModule,
        updateTenantBedCapacity,
        addTenant,
        isModuleLicensed,
        canAccessRouteForTenant,
        totalMonthlyRevenue,
        totalMonitoredBeds,
        resetToDefaults,
        isCloudConnected,
        isSyncing,
        refreshFromCloud,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextValue => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
