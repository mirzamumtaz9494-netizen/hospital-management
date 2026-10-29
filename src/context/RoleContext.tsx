"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type RoleKey =
  | "cmo"
  | "receptionist"
  | "doctor"
  | "nurse"
  | "pharmacist"
  | "lab_tech"
  | "cashier";

export interface UserProfile {
  name: string;
  roleLabel: string;
  department: string;
  email: string;
  avatar: string;
  badge: string;
  badgeColor: string;
  description: string;
}

export interface RoleConfig {
  key: RoleKey;
  profile: UserProfile;
  allowedRoutes: string[];
  allowedModules: string[];
  allowedQuickActions: string[];
}

export const ROLES_REGISTRY: Record<RoleKey, RoleConfig> = {
  cmo: {
    key: "cmo",
    profile: {
      name: "Dr. Bhargav",
      roleLabel: "Chief Medical Officer (CMO)",
      department: "Clinical Executive & Governance",
      email: "dr.bhargav@metrocaredemo.com",
      avatar:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop",
      badge: "Super Admin / CMO",
      badgeColor: "bg-teal-500/20 text-teal-300 border border-teal-500/40",
      description:
        "Full root privileges across clinical, diagnostic, pharmacy, financial, and system admin tools.",
    },
    allowedRoutes: [
      "/",
      "/super-admin",
      "/opd",
      "/ipd",
      "/blood-bank",
      "/laboratory",
      "/pharmacy",
      "/doctors",
      "/services",
      "/accounts",
      "/reports",
      "/admin",
      "/settings",
      "/referrals",
    ],
    allowedModules: [
      "patients",
      "opd",
      "ipd",
      "blood_bank",
      "lab",
      "pharmacy",
      "doctors",
      "wards",
      "reports",
      "services",
      "admin",
      "accounts",
      "settings",
    ],
    allowedQuickActions: [
      "create_op",
      "create_ip",
      "lab_billing",
      "pharmacy_billing",
      "blood_bank",
      "other_services",
      "add_expenses",
      "emergency_services",
      "advance_payment",
      "bill_settlement",
      "doctor_roster",
      "mis_reports",
      "hospital_settings",
    ],
  },
  receptionist: {
    key: "receptionist",
    profile: {
      name: "Sneha Mukherjee",
      roleLabel: "Front Desk & Triage Receptionist",
      department: "Outpatient Registration & Reception",
      email: "sneha.m@VitalSync.hms",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
      badge: "Receptionist / Front Desk",
      badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
      description:
        "Patient registration, OPD token queue, inpatient bed admission, and doctor schedule lookup.",
    },
    allowedRoutes: ["/", "/opd", "/ipd", "/blood-bank", "/doctors", "/services", "/referrals"],
    allowedModules: [
      "patients",
      "opd",
      "ipd",
      "blood_bank",
      "doctors",
      "services",
      "wards",
    ],
    allowedQuickActions: [
      "create_op",
      "create_ip",
      "emergency_services",
      "blood_bank",
      "other_services",
      "doctor_roster",
    ],
  },
  doctor: {
    key: "doctor",
    profile: {
      name: "Dr. Priya Nair",
      roleLabel: "Senior Consultant Physician",
      department: "Department of Internal Medicine",
      email: "priya.nair@VitalSync.hms",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&auto=format&fit=crop",
      badge: "Consultant Doctor",
      badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
      description:
        "Consultation chamber, inpatient bed rounds, clinical notes, prescription orders, and lab reports.",
    },
    allowedRoutes: [
      "/",
      "/opd",
      "/ipd",
      "/blood-bank",
      "/doctors",
      "/reports",
      "/referrals",
    ],
    allowedModules: [
      "opd",
      "ipd",
      "blood_bank",
      "doctors",
      "reports",
      "wards",
    ],
    allowedQuickActions: [
      "doctor_roster",
      "emergency_services",
      "blood_bank",
      "mis_reports",
    ],
  },
  nurse: {
    key: "nurse",
    profile: {
      name: "Sister Philomena David",
      roleLabel: "Chief Nursing Superintendent",
      department: "Nursing Administration (ICU & Wards)",
      email: "philomena.d@VitalSync.hms",
      avatar:
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=256&auto=format&fit=crop",
      badge: "Head Nurse",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
      description:
        "Ward bed grid, vitals logging, nursing indents, triage queue, and patient clinical records.",
    },
    allowedRoutes: ["/", "/opd", "/ipd", "/blood-bank", "/doctors", "/services", "/referrals"],
    allowedModules: ["opd", "ipd", "blood_bank", "wards", "doctors", "services"],
    allowedQuickActions: [
      "emergency_services",
      "blood_bank",
      "doctor_roster",
      "other_services",
    ],
  },
  pharmacist: {
    key: "pharmacist",
    profile: {
      name: "G. Venkatesh",
      roleLabel: "Senior Pharmacist & In-Charge",
      department: "Central Inpatient & Retail Pharmacy",
      email: "venkatesh.g@VitalSync.hms",
      avatar:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&auto=format&fit=crop",
      badge: "Senior Pharmacist",
      badgeColor: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
      description:
        "Medication dispensing, prescription POS, formulary inventory, and narcotic control register.",
    },
    allowedRoutes: ["/", "/pharmacy", "/services"],
    allowedModules: ["pharmacy", "services"],
    allowedQuickActions: ["pharmacy_billing", "other_services"],
  },
  lab_tech: {
    key: "lab_tech",
    profile: {
      name: "Dr. Kavita Deshmukh",
      roleLabel: "Chief Biochemist & Pathologist",
      department: "Central Diagnostic Laboratory",
      email: "kavita.d@VitalSync.hms",
      avatar:
        "https://images.unsplash.com/photo-1594824813576-47b2b8089476?q=80&w=256&auto=format&fit=crop",
      badge: "Lab Biochemist",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
      description:
        "Phlebotomy sample accessioning, analyzer test results entry, and NABL diagnostic sign-offs.",
    },
    allowedRoutes: ["/", "/laboratory", "/blood-bank", "/services", "/referrals"],
    allowedModules: ["lab", "blood_bank", "services"],
    allowedQuickActions: ["lab_billing", "blood_bank", "other_services"],
  },
  cashier: {
    key: "cashier",
    profile: {
      name: "Ramesh Sharma",
      roleLabel: "Senior Billing Cashier",
      department: "Cash Counter & Patient Accounts",
      email: "ramesh.sharma@VitalSync.hms",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      badge: "Billing Cashier",
      badgeColor: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
      description:
        "Day book cash register, advance deposits, IP discharge bill settlement, and expense vouchers.",
    },
    allowedRoutes: ["/", "/accounts", "/services", "/opd", "/ipd", "/referrals"],
    allowedModules: ["accounts", "services", "opd", "ipd"],
    allowedQuickActions: [
      "add_expenses",
      "advance_payment",
      "bill_settlement",
      "other_services",
    ],
  },
};

interface RoleContextValue {
  currentRole: RoleKey;
  setRole: (role: RoleKey) => void;
  roleConfig: RoleConfig;
  canAccessRoute: (pathname: string) => boolean;
  canAccessModule: (moduleId: string) => boolean;
  canAccessAction: (actionId: string) => boolean;
  allRoles: RoleConfig[];
  isAuthenticated: boolean;
  login: (role: RoleKey, customName?: string) => void;
  logout: () => void;
  isLocked: boolean;
  lockSession: () => void;
  unlockSession: (pin: string) => boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentRole, setCurrentRole] = useState<RoleKey>("cmo");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Load persisted auth and role if any
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("VitalSync_active_role") as RoleKey;
      if (savedRole && ROLES_REGISTRY[savedRole]) {
        setCurrentRole(savedRole);
      }
      const savedAuth = localStorage.getItem("VitalSync_is_auth");
      if (savedAuth === "false") {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore localStorage issues in SSR
    }
  }, []);

  const setRole = (role: RoleKey) => {
    setCurrentRole(role);
    try {
      localStorage.setItem("VitalSync_active_role", role);
    } catch {
      // Ignore
    }
  };

  const login = (role: RoleKey, customName?: string) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    setIsLocked(false);
    try {
      localStorage.setItem("VitalSync_active_role", role);
      localStorage.setItem("VitalSync_is_auth", "true");
      if (customName) {
        localStorage.setItem("VitalSync_user_name", customName);
      }
    } catch {
      // Ignore
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLocked(false);
    try {
      localStorage.setItem("VitalSync_is_auth", "false");
    } catch {
      // Ignore
    }
  };

  const lockSession = () => {
    setIsLocked(true);
  };

  const unlockSession = (pin: string): boolean => {
    // Default unlock pin: 1234 or any 4-digit code
    if (pin === "1234" || pin.length === 4) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const roleConfig = ROLES_REGISTRY[currentRole] || ROLES_REGISTRY.cmo;

  const canAccessRoute = (pathname: string): boolean => {
    if (currentRole === "cmo") return true;
    if (pathname === "/") return true;
    return roleConfig.allowedRoutes.some((route) => {
      if (route === "/") return false;
      return pathname.startsWith(route);
    });
  };

  const canAccessModule = (moduleId: string): boolean => {
    if (currentRole === "cmo") return true;
    return roleConfig.allowedModules.includes(moduleId);
  };

  const canAccessAction = (actionId: string): boolean => {
    if (currentRole === "cmo") return true;
    return roleConfig.allowedQuickActions.includes(actionId);
  };

  const allRoles = Object.values(ROLES_REGISTRY);

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole,
        roleConfig,
        canAccessRoute,
        canAccessModule,
        canAccessAction,
        allRoles,
        isAuthenticated,
        login,
        logout,
        isLocked,
        lockSession,
        unlockSession,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
