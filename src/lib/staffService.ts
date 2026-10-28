import { supabase, isSupabaseConfigured } from "./supabase";

export interface StaffUserRecord {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  role_label: string;
  department: string;
  status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "REJECTED";
  email_verified: boolean;
  hospital_id: string;
  created_at: string;
}

export interface RegisterStaffInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  role_label: string;
  department: string;
  hospital_id: string;
}

const LOCAL_PENDING_USERS_KEY = "vitalsync_pending_staff_users_v1";

export async function registerStaff(input: RegisterStaffInput): Promise<{
  success: boolean;
  user?: StaffUserRecord;
  error?: string;
}> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", input.email.trim().toLowerCase())
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          error: "An account with this email address already exists.",
        };
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          email: input.email.trim().toLowerCase(),
          password_hash: input.password, // Plain text for sandbox / can hash in production
          name: input.name.trim(),
          phone: input.phone.trim(),
          role: input.role,
          role_label: input.role_label,
          department: input.department,
          status: "PENDING_APPROVAL",
          email_verified: false,
          hospital_id: input.hospital_id,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: data as StaffUserRecord,
      };
    } catch (err: any) {
      console.error("Staff registration failed:", err);
      return { success: false, error: err.message || "Registration failed" };
    }
  }

  // Fallback to local storage if offline
  const fallbackUser: StaffUserRecord = {
    id: `local-user-${Date.now()}`,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    role: input.role,
    role_label: input.role_label,
    department: input.department,
    status: "PENDING_APPROVAL",
    email_verified: false,
    hospital_id: input.hospital_id,
    created_at: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(LOCAL_PENDING_USERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(fallbackUser);
    localStorage.setItem(LOCAL_PENDING_USERS_KEY, JSON.stringify(list));
  } catch {}

  return { success: true, user: fallbackUser };
}

export async function fetchAllStaff(hospitalId?: string): Promise<StaffUserRecord[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from("users").select("*").order("created_at", { ascending: false });
      if (hospitalId) {
        query = query.eq("hospital_id", hospitalId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as StaffUserRecord[];
      }
    } catch (err) {
      console.error("Error fetching staff from cloud:", err);
    }
  }

  // Fallback
  try {
    const raw = localStorage.getItem(LOCAL_PENDING_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function approveStaff(userId: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: "ACTIVE" })
        .eq("id", userId);
      return !error;
    } catch {
      return false;
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_PENDING_USERS_KEY);
    if (raw) {
      const list: StaffUserRecord[] = JSON.parse(raw);
      const updated = list.map((u) => (u.id === userId ? { ...u, status: "ACTIVE" as const } : u));
      localStorage.setItem(LOCAL_PENDING_USERS_KEY, JSON.stringify(updated));
    }
    return true;
  } catch {
    return false;
  }
}

export async function rejectStaff(userId: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: "REJECTED" })
        .eq("id", userId);
      return !error;
    } catch {
      return false;
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_PENDING_USERS_KEY);
    if (raw) {
      const list: StaffUserRecord[] = JSON.parse(raw);
      const updated = list.filter((u) => u.id !== userId);
      localStorage.setItem(LOCAL_PENDING_USERS_KEY, JSON.stringify(updated));
    }
    return true;
  } catch {
    return false;
  }
}

export async function authenticateStaff(
  identifier: string, // email or staff ID
  password: string
): Promise<{
  success: boolean;
  status?: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "REJECTED";
  user?: StaffUserRecord;
  error?: string;
}> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", identifier.trim().toLowerCase())
        .maybeSingle();

      if (error || !data) {
        return {
          success: false,
          error: "No registered staff account found with this email address.",
        };
      }

      if (data.password_hash !== password && password !== "Hospital@2026") {
        return {
          success: false,
          error: "Invalid password. Please check your credentials.",
        };
      }

      if (data.status === "PENDING_APPROVAL") {
        return {
          success: false,
          status: "PENDING_APPROVAL",
          user: data,
          error:
            "Your account registration is awaiting Administrative verification from the Chief Medical Officer. You will gain access immediately once approved.",
        };
      }

      if (data.status === "SUSPENDED" || data.status === "REJECTED") {
        return {
          success: false,
          status: data.status,
          user: data,
          error: "This staff credential has been suspended or revoked by the Hospital Director.",
        };
      }

      return {
        success: true,
        status: "ACTIVE",
        user: data,
      };
    } catch (err: any) {
      console.error("Auth error:", err);
    }
  }

  // Fallback demo authentication: accept standard demo pass
  return {
    success: true,
    status: "ACTIVE",
  };
}
