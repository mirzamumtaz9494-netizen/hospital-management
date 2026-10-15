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

/* IPD & BED MANAGEMENT TYPES */

export type BedStatus = "Occupied" | "Vacant" | "Cleaning";

export interface IpdBed {
  id: string;
  bedNumber: string;
  ward: "ICU" | "General Ward" | "Private Rooms" | "Maternity Ward" | "Cardiac Care Unit (CCU)";
  floor: "Ground Floor" | "Floor 1" | "Floor 2" | "Floor 3";
  status: BedStatus;
  isCritical?: boolean;
  patientId?: string;
  patientName?: string;
  patientInitials?: string;
  patientAge?: number;
  patientGender?: "M" | "F" | "Other";
  mrId?: string;
  ipNo?: string;
  doctor?: string;
  department?: string;
  admittedDate?: string;
  dayCount?: number;
}

export type AdmissionStatus = "Critical" | "Under Observation" | "Stable" | "Ready for Discharge";

export interface ActiveAdmission {
  id: string;
  ipNo: string;
  mrId: string;
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  wardBed: string;
  wardName: string;
  bedNumber: string;
  diagnosis: string;
  attendingDoctor: string;
  admittedOn: string;
  days: number;
  status: AdmissionStatus;
  billSoFar: number;
  advancePaid: number;
}

export type DischargeOutcome = "Recovered" | "Referred" | "LAMA" | "Expired";

export interface DischargedPatient {
  id: string;
  ipNo: string;
  mrId: string;
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  diagnosis: string;
  attendingDoctor: string;
  admittedDate: string;
  dischargedDate: string;
  stayDays: number;
  outcome: DischargeOutcome;
  finalBill: number;
  advancePaid: number;
  paymentStatus: "Paid" | "Partial" | "Unpaid";
  settlementMode: string;
  dischargeNotes?: string;
}

export interface BedTransferRecord {
  id: string;
  transferId: string;
  ipNo: string;
  mrId: string;
  patientName: string;
  fromWard: string;
  fromBed: string;
  toWard: string;
  toBed: string;
  transferDate: string;
  transferTime: string;
  doctor: string;
  authorizedBy: string;
  reason: string;
}

export interface IpBillDetail {
  id: string;
  billNo: string;
  ipNo: string;
  mrId: string;
  patientName: string;
  initials: string;
  wardBed: string;
  doctor: string;
  admissionDate: string;
  daysStayed: number;
  bedCharges: number;
  nursingCharges: number;
  doctorRoundsFee: number;
  surgeryOtCharges: number;
  labCharges: number;
  pharmacyCharges: number;
  totalBill: number;
  advancePaid: number;
  discount: number;
  netPayable: number;
  balanceDue: number;
  status: "Settled" | "Partially Paid" | "Pending";
  settlementMode?: string;
}

/* ========================================================================= */
/* LABORATORY & DIAGNOSTICS (LIS) SPECIFIC TYPES */
/* ========================================================================= */

export type LabOrderStatus =
  | "Pending Sample"
  | "Sample Collected"
  | "In Analysis"
  | "Pending Approval"
  | "Completed"
  | "Cancelled";

export type LabPriority = "Routine" | "Stat" | "Emergency";

export type LabDepartment =
  | "Hematology"
  | "Biochemistry"
  | "Microbiology"
  | "Serology"
  | "Immunology"
  | "Clinical Pathology"
  | "Radiology / Imaging";

export interface LabTestParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string | number;
}

export interface LabCatalogItem {
  id: string;
  code: string;
  name: string;
  department: LabDepartment;
  sampleType: string;
  tubeColor: string;
  tatHours: number;
  price: number;
  parameters: LabTestParameter[];
}

export interface LabParameterResult {
  parameterId: string;
  parameterName: string;
  unit: string;
  normalRange: string;
  value: string;
  flag?: "Normal" | "High" | "Low" | "Critical";
  notes?: string;
}

export interface LabOrderTestItem {
  id: string;
  testCode: string;
  testName: string;
  department: LabDepartment;
  price: number;
  status: LabOrderStatus;
  sampleType: string;
  tubeColor: string;
  results?: LabParameterResult[];
}

export interface LabOrder {
  id: string;
  orderNo: string;
  barcode: string;
  patientId: string;
  mrId: string;
  opIpNo: string;
  patientName: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  source: "OPD" | "IPD" | "Emergency" | "Walk-in";
  wardBed?: string;
  referringDoctor: string;
  tests: LabOrderTestItem[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  priority: LabPriority;
  orderDate: string;
  orderTime: string;
  sampleCollectedAt?: string;
  phlebotomist?: string;
  analyzedAt?: string;
  technician?: string;
  approvedAt?: string;
  approvedBy?: string;
  status: LabOrderStatus;
  clinicalNotes?: string;
}

export interface LabBillItem {
  id: string;
  billNo: string;
  orderNo: string;
  patientName: string;
  mrId: string;
  doctor: string;
  tests: { testName: string; department: string; cost: number }[];
  totalCost: number;
  discount: number;
  netPayable: number;
  paidAmount: number;
  balanceDue: number;
  paymentMode: string;
  date: string;
  time: string;
  status: "Paid" | "Partial" | "Unpaid";
}

/* ========================================================================= */
/* PHARMACY & DRUG INVENTORY SPECIFIC TYPES */
/* ========================================================================= */

export type MedicineCategory =
  | "Antibiotics"
  | "Cardiovascular"
  | "Analgesics & Pain"
  | "Gastrointestinal"
  | "Antidiabetic"
  | "Respiratory"
  | "IV Fluids & Infusions"
  | "Surgical & Consumables";

export type MedicineDosageForm =
  | "Tablet"
  | "Capsule"
  | "Injection"
  | "Syrup"
  | "IV Infusion"
  | "Ointment"
  | "Inhaler";

export type MedicineSchedule = "OTC" | "Schedule H" | "Schedule H1" | "Narcotic";

export interface MedicineItem {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: MedicineCategory;
  dosageForm: MedicineDosageForm;
  strength: string;
  manufacturer: string;
  batchNo: string;
  expiryDate: string;
  stockQuantity: number;
  minReorderLevel: number;
  unitCost: number;
  mrp: number;
  schedule: MedicineSchedule;
  rackLocation: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Near Expiry";
}

export interface PharmacyRxItem {
  id: string;
  medicineId: string;
  medicineName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  batchNo: string;
  expiryDate: string;
  unitPrice: number;
  totalPrice: number;
  instructions?: string;
}

export type PharmacyDispenseStatus =
  | "Pending Dispense"
  | "Ready for Pickup"
  | "Dispensed"
  | "Cancelled";

export interface PharmacyOrder {
  id: string;
  rxNumber: string;
  billNumber?: string;
  patientName: string;
  initials: string;
  mrId: string;
  opIpNumber: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  prescribingDoctor: string;
  source: "OPD" | "IPD" | "Emergency" | "Retail Walk-in";
  wardBed?: string;
  orderDate: string;
  orderTime: string;
  items: PharmacyRxItem[];
  subtotal: number;
  discount: number;
  tax: number;
  netTotal: number;
  paymentStatus: "Paid" | "Unpaid" | "Partial" | "Billed to IPD";
  paymentMode: string;
  dispenseStatus: PharmacyDispenseStatus;
  dispensedBy?: string;
  dispensedAt?: string;
  notes?: string;
}

export interface WardIndent {
  id: string;
  indentNo: string;
  wardName: string;
  requestedByNurse: string;
  requestedAt: string;
  priority: "Routine" | "STAT Emergency";
  items: {
    medicineName: string;
    batchNo: string;
    requestedQty: number;
    issuedQty: number;
    unitPrice: number;
  }[];
  totalCost: number;
  status: "Pending Review" | "Issued & Dispatched" | "Delivered";
}

export interface PharmacyPurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  itemsCount: number;
  totalAmount: number;
  status: "Order Placed" | "Goods Received (GRN)" | "Payment Settled";
}
