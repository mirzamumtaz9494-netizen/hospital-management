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

/* OPD SPECIFIC TYPES */

export interface OpQueueItem {
  id: string;
  token: string;
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  mrId: string;
  phone: string;
  department: string;
  doctor: string;
  visitType: "New" | "Follow-up";
  checkIn: string;
  waitTime: string;
  status: "Waiting" | "In Consultation" | "Completed";
  vitalSummary?: string;
  billAmount?: number;
}

export interface AllOpRecord {
  id: string;
  opNo: string;
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  mrId: string;
  phone: string;
  visitDate: string;
  department: string;
  doctor: string;
  visitType: "New" | "Follow-up";
  billAmount: number;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  paymentMode?: string;
}

export interface AppointmentItem {
  id: string;
  aptNumber: string;
  patientName: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  mrId: string;
  phone: string;
  department: string;
  doctor: string;
  date: string;
  timeSlot: string;
  visitType: "New" | "Follow-up";
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  reason: string;
}

export interface PrescriptionMedicine {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ConsultationEncounter {
  id: string;
  encounterNo: string;
  patientId: string;
  patientName: string;
  mrId: string;
  opNo: string;
  age: number;
  gender: "M" | "F" | "Other";
  department: string;
  doctor: string;
  date: string;
  time: string;
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
    weight: string;
  };
  chiefComplaints: string;
  diagnosis: string;
  notes: string;
  medicines: PrescriptionMedicine[];
  labOrders: string[];
  followUpDays: number;
  status: "Active" | "Completed";
}

export interface FollowUpItem {
  id: string;
  mrId: string;
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  doctor: string;
  department: string;
  originalVisitDate: string;
  scheduledFollowUpDate: string;
  daysRemaining: number;
  isFreeRevisit: boolean;
  status: "Due Today" | "Upcoming" | "Overdue" | "Checked In";
  diagnosis: string;
  reminderStatus: "Sent" | "Pending" | "Confirmed";
}

export interface OpBillItem {
  id: string;
  billNo: string;
  opNo: string;
  mrId: string;
  patientName: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  consultationFee: number;
  labCharges: number;
  pharmacyCharges: number;
  otherCharges: number;
  totalAmount: number;
  discount: number;
  netPayable: number;
  paidAmount: number;
  balanceDue: number;
  paymentMode: "Cash" | "UPI" | "Card" | "Insurance";
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  cashier: string;
}
