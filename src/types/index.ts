export type PatientStatus = "Active" | "Critical" | "Pending" | "Discharged";

export interface Patient {
  id: string;
  mrId: string;
  opIpId: string;
  type: "OP" | "IP";
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  department: string;
  attendingDoctor: string;
  admissionDate: string;
  status: PatientStatus;
  bedNumber?: string;
  wardName?: string;
  diagnosis?: string;
  billAmount?: number;
  advancePaid?: number;
}

export interface MetricData {
  title: string;
  value: string;
  numericValue: number;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  type: "currency" | "percentage" | "count";
  details?: {
    total?: number;
    current?: number;
    breakdown?: { label: string; count: number; color: string }[];
  };
}

export interface QuickMenuItem {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  description: string;
  category: "registration" | "billing" | "clinical" | "finance";
}

export interface ModuleItem {
  id: string;
  title: string;
  countLabel: string;
  icon: string;
  isVerified?: boolean;
  subtext?: string;
  href: string;
}
