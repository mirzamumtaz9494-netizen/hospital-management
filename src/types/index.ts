export type PatientStatus = "Active" | "Critical" | "Pending" | "Discharged";

export interface Patient {
  id: string;
  mrId: string;
  uhid?: string;
  opIpId: string;
  type: "OP" | "IP";
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F" | "Other";
  phone: string;
  bloodGroup?: string;
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

/* ========================================================================= */
/* HOSPITAL REPORTS, ANALYTICS & MIS TYPES */
/* ========================================================================= */

export type ReportCategory =
  | "Financial"
  | "Clinical"
  | "Laboratory"
  | "Pharmacy"
  | "Compliance"
  | "Executive";

export interface SavedReportItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ReportCategory;
  frequency: "Daily" | "Weekly" | "Monthly" | "On-Demand";
  lastGenerated: string;
  generatedBy: string;
  format: "PDF" | "Excel" | "CSV";
  size: string;
  tags: string[];
}

export interface DepartmentRevenueItem {
  department: string;
  opdRevenue: number;
  ipdRevenue: number;
  labRevenue: number;
  pharmacyRevenue: number;
  totalRevenue: number;
  patientCount: number;
  growth: number;
}

export interface HospitalCensusStats {
  date: string;
  totalAdmissions: number;
  totalDischarges: number;
  occupiedBeds: number;
  occupancyRate: number;
  opdVisits: number;
  erVisits: number;
  surgeriesConducted: number;
  avgLengthOfStay: number;
}

/* ========================================================================= */
/* HOSPITAL ADMINISTRATION, RBAC & GOVERNANCE TYPES */
/* ========================================================================= */

export type StaffRole =
  | "Super Administrator"
  | "Medical Director"
  | "Consultant Doctor"
  | "Head Nurse"
  | "Senior Pharmacist"
  | "Chief Biochemist"
  | "Billing Cashier";

export interface AdminStaffUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
  designation: string;
  status: "Active" | "Suspended" | "Pending Approval";
  twoFactorEnabled: boolean;
  lastActive: string;
  joinDate: string;
}

export interface RoleDefinition {
  id: string;
  roleName: StaffRole;
  description: string;
  usersCount: number;
  isSystemRole: boolean;
  permissions: {
    canViewMedicalRecords: boolean;
    canPrescribeMedication: boolean;
    canAdmitDischargeIP: boolean;
    canWaiveBillDiscounts: boolean;
    canDispenseNarcotics: boolean;
    canSignLabResults: boolean;
    canManageUsers: boolean;
    canEditTariffMasters: boolean;
    canExportFinancialMIS: boolean;
    canAccessAuditLogs: boolean;
  };
}

export interface HospitalDepartmentItem {
  id: string;
  code: string;
  name: string;
  type: "Clinical" | "Diagnostic" | "Support" | "Administrative";
  hodName: string;
  floorLocation: string;
  block: string;
  bedQuota: number;
  onDutyDoctors: number;
  opFee: number;
  status: "Active" | "Inactive";
}

export interface DoctorRosterSchedule {
  id: string;
  doctorName: string;
  department: string;
  shift: "Morning (08:00 - 14:00)" | "Evening (14:00 - 20:00)" | "Night (20:00 - 08:00)" | "On-Call Emergency";
  dayOfWeek: string;
  roomNo: string;
  status: "On Duty" | "Scheduled" | "Leave";
}

export interface WardTariffMaster {
  id: string;
  wardCode: string;
  wardName: string;
  category: "Intensive Care" | "Critical Care" | "General" | "Private" | "Specialty";
  dailyBedRate: number;
  nursingRate: number;
  rmoRate: number;
  totalDailyTariff: number;
  occupancyBeds: number;
  totalBeds: number;
  taxPercent: number;
}

export interface BiomedicalAssetItem {
  id: string;
  assetCode: string;
  assetName: string;
  model: string;
  department: string;
  serialNo: string;
  purchaseDate: string;
  amcVendor: string;
  amcExpiry: string;
  nextCalibration: string;
  status: "Operational" | "Maintenance Due" | "Breakdown / Repair" | "Under Calibration";
  riskClass: "Class A - High Risk" | "Class B - Medium Risk" | "Class C - Low Risk";
}

export interface StatutoryLicenseItem {
  id: string;
  licenseName: string;
  authority: string;
  licenseNo: string;
  issueDate: string;
  expiryDate: string;
  daysLeft: number;
  status: "Valid" | "Expiring Soon" | "Renewal Pending";
  documentRef: string;
}

export interface SystemAuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  actionType: "User Access" | "Financial Override" | "Clinical Change" | "Inventory Authorization" | "System Config";
  details: string;
  ipAddress: string;
  severity: "Info" | "Warning" | "Critical";
}

export interface PendingAccessRequest {
  id: string;
  applicantName: string;
  applicantEmail: string;
  requestedRole: StaffRole;
  department: string;
  justification: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

/* ========================================================================= */
/* HOSPITAL SETTINGS & SYSTEM CONFIGURATION TYPES */
/* ========================================================================= */

export interface HospitalProfileSettings {
  hospitalName: string;
  registrationNo: string;
  nabhTier: string;
  gstin: string;
  pan: string;
  contactPhone: string;
  emergencyHotline: string;
  officialEmail: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  currentBranch: string;
  availableBranches: string[];
  currency: string;
  fiscalYear: string;
}

export interface ClinicalPreferencesSettings {
  mrnPrefix: string;
  mrnDigits: number;
  currentMrnCounter: number;
  opTokenPrefix: string;
  opTokenResetDaily: boolean;
  autoPrintToken: boolean;
  ipAdmissionPrefix: string;
  currentIpCounter: number;
  drugInteractionWarning: "High Severity Only" | "Moderate & High" | "All Interactions";
  antibioticStewardshipPrompt: boolean;
  defaultBpUnit: string;
  defaultTempUnit: string;
  defaultWeightUnit: string;
}

export interface BillingTaxSettings {
  invoicePrefix: string;
  currentInvoiceCounter: number;
  roomRentGstExemptionThreshold: number;
  medicineGstSlab: number;
  diagnosticGstExempt: boolean;
  upiMerchantId: string;
  cardTerminalProvider: string;
  autoSubmitTpaPreauth: boolean;
  cmoDiscountApprovalLimit: number;
  receiptFooterLegal: string;
}

export interface NotificationSettings {
  smsGatewayEnabled: boolean;
  smsProvider: string;
  dltRegistrationId: string;
  whatsappApiEnabled: boolean;
  emailSmtpConfigured: boolean;
  notifyOpTokenSms: boolean;
  notifyLabReadyWhatsApp: boolean;
  notifyIpAdmitSms: boolean;
  notifyCriticalLabDoctor: boolean;
  notifyDischargeBillPdf: boolean;
}

export interface BackupSecuritySettings {
  autoBackupEnabled: boolean;
  backupFrequency: "Daily at 02:00 AM" | "Every 12 Hours" | "Weekly";
  backupCloudTarget: string;
  lastBackupTime: string;
  retentionDays: number;
  idleTimeoutMinutes: number;
  maxConcurrentSessions: number;
  enforceMfaPolicy: boolean;
  ipSubnetRestriction: string;
}

export interface DatabaseBackupSnapshot {
  id: string;
  timestamp: string;
  fileName: string;
  size: string;
  type: "Automated Daily" | "Manual Snapshot";
  storageTarget: string;
  encryption: string;
  status: "Verified & Stored" | "In Progress" | "Failed";
  checksumSha256: string;
}

export interface ExternalIntegrationItem {
  id: string;
  integrationName: string;
  category: "LIS Analyzer HL7" | "PACS DICOM" | "ABDM / ABHA" | "Insurance TPA Gateway" | "SMS/WhatsApp";
  status: "Connected" | "Configured" | "Disabled";
  lastSync: string;
  latencyMs: number;
  endpointUrl: string;
  details: string;
}

/* ========================================================================= */
/* HOSPITAL SERVICES, ACCOUNTS & DOCTORS TYPES */
/* ========================================================================= */

export interface HospitalServiceItem {
  id: string;
  code: string;
  name: string;
  category: "Radiology & Imaging" | "Surgical & OT" | "Cardiology Procedures" | "Allied & Day Care" | "Emergency Services";
  department: string;
  standardFee: number;
  durationMins: number;
  nabhCode: string;
  status: "Active" | "Inactive";
  isEmergencyAvailable: boolean;
}

export interface HospitalAccountTransaction {
  id: string;
  voucherNo: string;
  timestamp: string;
  type: "OP Collection" | "IP Advance" | "Discharge Settlement" | "Pharmacy POS" | "Petty Expense" | "Refund";
  category: "Revenue" | "Expense" | "Deposit";
  amount: number;
  paymentMode: "Cash" | "UPI / QR" | "Credit/Debit Card" | "TPA Cashless";
  patientOrVendor: string;
  refNumber: string;
  cashierName: string;
  notes: string;
}

export interface DoctorProfileItem {
  id: string;
  name: string;
  qualifications: string;
  designation: string;
  department: string;
  experienceYears: number;
  opRoom: string;
  consultationFee: number;
  phone: string;
  email: string;
  status: "On Duty" | "Available" | "In OT" | "On Leave";
  timings: string;
  days: string;
  rating: number;
  activePatientsToday: number;
  avatarUrl?: string;
}

export interface HospitalNotificationItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: "Critical Alert" | "Clinical" | "Inventory" | "Statutory" | "Access";
  unread: boolean;
  linkHref: string;
}

/* ========================================================================= */
/* BLOOD BANK & DONOR MANAGEMENT TYPES                                      */
/* ========================================================================= */

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type BloodComponent =
  | "Whole Blood"
  | "Packed Red Blood Cells (PRBC)"
  | "Fresh Frozen Plasma (FFP)"
  | "Platelet Concentrate (RDP)"
  | "Cryoprecipitate";

export interface BloodInventoryUnit {
  id: string;
  bagBarcode: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  volumeMl: number;
  collectionDate: string;
  expiryDate: string;
  daysRemaining: number;
  donorId: string;
  donorName: string;
  storageLocation: string;
  status: "Available" | "Reserved" | "Transfused" | "Expired" | "Testing";
  crossmatchedPatient?: string;
  crossmatchedIpNo?: string;
}

export interface BloodDonor {
  id: string;
  donorNumber: string;
  name: string;
  age: number;
  gender: "M" | "F" | "Other";
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  city: string;
  weightKg: number;
  hemoglobin: number;
  lastDonationDate: string;
  totalDonations: number;
  status: "Eligible" | "In Cooldown" | "Deferred (Low Hb)" | "Medical Deferral";
  emergencyConsent: boolean;
}

export interface BloodRequisition {
  id: string;
  reqNumber: string;
  patientName: string;
  mrId: string;
  ipNo: string;
  wardBed: string;
  requestedDoctor: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsNeeded: number;
  indication: string;
  urgency: "Immediate STAT" | "Within 4 Hours" | "Scheduled OT";
  status: "Pending Crossmatch" | "Crossmatch Compatible" | "Units Reserved" | "Issued to OT";
  requestedAt: string;
  reservedBagBarcode?: string;
}

// ==========================================
// MULTI-TENANT & SAAS SUPER ADMIN TYPES
// ==========================================

export type TenantModuleKey =
  | "opd"
  | "ipd"
  | "pharmacy"
  | "laboratory"
  | "blood_bank"
  | "doctors"
  | "services"
  | "accounts"
  | "reports"
  | "admin";

export type TenantPlanKey =
  | "starter_clinic"
  | "standard_hospital"
  | "enterprise_multispecialty"
  | "custom";

export interface TenantModuleMetadata {
  key: TenantModuleKey;
  label: string;
  category: "Clinical" | "Operations" | "Specialty";
  description: string;
  route: string;
  iconName: string;
  isAddon?: boolean;
  basePricePerMonth: number;
}

export interface HospitalTenant {
  id: string;
  tenantCode: string;
  name: string;
  unitName: string;
  tagline: string;
  city: string;
  state: string;
  contactEmail: string;
  contactPhone: string;
  plan: TenantPlanKey;
  planLabel: string;
  bedCapacity: number;
  status: "Active" | "Trial" | "Suspended";
  renewalDate: string;
  monthlyFee: number;
  currency: string;
  modules: Record<TenantModuleKey, boolean>;
  primaryColor?: string;
  logoBadge?: string;
  createdAt: string;
}



