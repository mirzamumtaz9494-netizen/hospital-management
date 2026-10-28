/**
 * Database client abstraction for VitalSync HMS
 * Powered by Supabase (Managed PostgreSQL) with Multi-Tenant Row-Level Security
 */

import { supabase, isSupabaseConfigured } from "./supabase";

export { supabase, isSupabaseConfigured };

// Generic helper for multi-tenant database queries
export const getTenantFilter = (tenantId: string) => {
  return { hospital_id: tenantId };
};
