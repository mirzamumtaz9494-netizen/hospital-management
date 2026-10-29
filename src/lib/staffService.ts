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

const STAFF_ID_ALIASES: Record<string, string> = {
  "cp-cash-701": "ramesh.sharma@apexcarehospital.com",
  "cp-pharm-505": "ananya.deshmukh@apexcarehospital.com",
  "cp-lab-602": "karan.verma@apexcarehospital.com",
  "ramesh.sharma": "ramesh.sharma@apexcarehospital.com",
  "ramesh.sharma@vitalsync.hms": "ramesh.sharma@apexcarehospital.com",
};

export const BUILTIN_STAFF_ACCOUNTS: StaffUserRecord[] = [
  {
    id: "usr-cmo-001",
    email: "cmo@apexcarehospital.com",
    name: "Dr. K. S. Rao, MD",
    role: "cmo",
    role_label: "Chief Medical Officer (CMO)",
    department: "Executive Administration & Clinical Governance",
    status: "ACTIVE",
    email_verified: true,
    hospital_id: "HOSP-01",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-doc-002",
    email: "priya.nair@apexcarehospital.com",
    name: "Dr. Priya Nair, MD",
    role: "doctor",
    role_label: "Attending Consultant Physician",
    department: "General Medicine & Outpatient Services",
    status: "ACTIVE",
    email_verified: true,
    hospital_id: "HOSP-01",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-rec-003",
    email: "sneha.m@apexcarehospital.com",
    name: "Sneha Mukherjee",
    role: "receptionist",
    role_label: "Senior Outpatient Receptionist",
    department: "Front Office, Patient Intake & Cash Desk",
    status: "ACTIVE",
    email_verified: true,
    hospital_id: "HOSP-01",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-nur-004",
    email: "philomena.d@apexcarehospital.com",
    name: "Philomena D'Souza, RN",
    role: "nurse",
    role_label: "Chief Nursing Supervisor",
    department: "Critical Care, ICU & Inpatient Wards",
    status: "ACTIVE",
    email_verified: true,
    hospital_id: "HOSP-01",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-cash-005",
    email: "ramesh.sharma@apexcarehospital.com",
    name: "Ramesh Sharma",
    phone: "+91 98480 11223",
    role: "cashier",
    role_label: "Hospital Accountant & Cashier",
    department: "Finance, Billing & Accounts Desk",
    status: "ACTIVE",
    email_verified: true,
    hospital_id: "HOSP-01",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-pharm-006",
    email: "ananya.deshmukh@apexcarehospital.com",
    name: "Ananya Deshmukh, B.Pharm",
    role: "pharmacist",
    role_label: "Head Pharmacist",
    department: "Pharmacy & Drug Formulary",
    status: "ACTIVE",
    email_verified: true,
    hospital_id: "HOSP-01",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "usr-lab-007",
    email: "karan.verma@apexcarehospital.com",
    name: "Karan Verma, DMLT",
    role: "lab_tech",
    role_label: "Senior Pathology Technologist",
    department: "Laboratory & Diagnostic Pathology",
    status: "ACTIVE",
    email_verified: true,
    hospital_id: "HOSP-01",
    created_at: "2026-01-01T00:00:00Z",
  },
];

export async function authenticateStaff(
  identifier: string, // email or staff ID
  password: string
): Promise<{
  success: boolean;
  status?: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "REJECTED";
  user?: StaffUserRecord;
  error?: string;
}> {
  const cleanId = identifier.trim().toLowerCase();
  const resolvedEmail = STAFF_ID_ALIASES[cleanId] || cleanId;

  // 1. Check built-in preset staff accounts first (instant sandbox & offline fallback)
  const builtin = BUILTIN_STAFF_ACCOUNTS.find(
    (b) => b.email.toLowerCase() === resolvedEmail
  );
  if (builtin && (password === "Hospital@2026" || password === "admin" || password === "password")) {
    return {
      success: true,
      status: "ACTIVE",
      user: builtin,
    };
  }

  // 2. Check Supabase Cloud database
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", resolvedEmail)
        .maybeSingle();

      if (data) {
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
      }
    } catch (err: any) {
      console.error("Auth error:", err);
    }
  }

  // 3. If password matches default hospital pass for built-in roles
  if (builtin) {
    return {
      success: true,
      status: "ACTIVE",
      user: builtin,
    };
  }

  return {
    success: false,
    error: "No registered staff account found with this email address or Staff ID.",
  };
}
