import {
  HospitalProfileSettings,
  ClinicalPreferencesSettings,
  BillingTaxSettings,
  NotificationSettings,
  BackupSecuritySettings,
  DatabaseBackupSnapshot,
  ExternalIntegrationItem,
} from "@/types";

/* ========================================================================= */
/* 1. HOSPITAL PROFILE & BRANCH MASTER */
/* ========================================================================= */

export const MOCK_HOSPITAL_PROFILE: HospitalProfileSettings = {
  hospitalName: "VitalSync Multispecialty Hospital & Research Centre",
  registrationNo: "CEA-REG-DIST-0145",
  nabhTier: "NABH 5th Edition Accredited (Hospital Category)",
  gstin: "36AAAAA0000A1Z5",
  pan: "AAAAA0000A",
  contactPhone: "+91 40 2345 6789",
  emergencyHotline: "+91 40 2345 9999",
  officialEmail: "admin@VitalSync.hms",
  website: "https://VitalSync.health",
  address: "Plot 14, Health City, Metro Bypass Road, Jubilee Enclave",
  city: "Hyderabad",
  state: "Telangana",
  pincode: "500081",
  currentBranch: "Metro Multispecialty - Main Branch",
  availableBranches: [
    "Metro Multispecialty - Main Branch",
    "VitalSync North Wing - Day Care",
    "VitalSync Diagnostic & Specialty Center",
  ],
  currency: "INR (₹)",
  fiscalYear: "April - March (India Standard)",
};

/* ========================================================================= */
/* 2. CLINICAL & PRESCRIPTION PREFERENCES */
/* ========================================================================= */

export const MOCK_CLINICAL_PREFERENCES: ClinicalPreferencesSettings = {
  mrnPrefix: "MR-",
  mrnDigits: 5,
  currentMrnCounter: 10255,
  opTokenPrefix: "OP-",
  opTokenResetDaily: true,
  autoPrintToken: true,
  ipAdmissionPrefix: "IP-",
  currentIpCounter: 22045,
  drugInteractionWarning: "Moderate & High",
  antibioticStewardshipPrompt: true,
  defaultBpUnit: "mmHg",
  defaultTempUnit: "°F",
  defaultWeightUnit: "kg",
};

/* ========================================================================= */
/* 3. BILLING, TAX & PAYMENT GATEWAYS */
/* ========================================================================= */

export const MOCK_BILLING_TAX_SETTINGS: BillingTaxSettings = {
  invoicePrefix: "INV-2026-",
  currentInvoiceCounter: 8940,
  roomRentGstExemptionThreshold: 5000,
  medicineGstSlab: 12,
  diagnosticGstExempt: true,
  upiMerchantId: "VitalSync.hospital@icici",
  cardTerminalProvider: "Pine Labs Android SmartPOS & HDFC Plutus",
  autoSubmitTpaPreauth: true,
  cmoDiscountApprovalLimit: 2000,
  receiptFooterLegal: "Computer-generated tax invoice issued in accordance with Sec 31 CGST Act 2017. Subject to Hyderabad jurisdiction.",
};

/* ========================================================================= */
/* 4. NOTIFICATIONS, SMS & WHATSAPP */
/* ========================================================================= */

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  smsGatewayEnabled: true,
  smsProvider: "ValueFirst / Tanla DLT Enterprise Gateway",
  dltRegistrationId: "DLT-ENT-110293481",
  whatsappApiEnabled: true,
  emailSmtpConfigured: true,
  notifyOpTokenSms: true,
  notifyLabReadyWhatsApp: true,
  notifyIpAdmitSms: true,
  notifyCriticalLabDoctor: true,
  notifyDischargeBillPdf: true,
};

/* ========================================================================= */
/* 5. BACKUP, DISASTER RECOVERY & SECURITY (Matches "Last backup: 5h ago") */
/* ========================================================================= */

export const MOCK_BACKUP_SECURITY_SETTINGS: BackupSecuritySettings = {
  autoBackupEnabled: true,
  backupFrequency: "Daily at 02:00 AM",
  backupCloudTarget: "AWS GovCloud (Asia-South-1) / Azure Health Vault",
  lastBackupTime: "5 hours ago (15 Oct 2026, 01:00 PM)",
  retentionDays: 30,
  idleTimeoutMinutes: 15,
  maxConcurrentSessions: 3,
  enforceMfaPolicy: true,
  ipSubnetRestriction: "192.168.0.0/16, 10.0.0.0/8 (Hospital Intranet Only)",
};

export const MOCK_BACKUP_SNAPSHOTS: DatabaseBackupSnapshot[] = [
  {
    id: "snp-01",
    timestamp: "15 Oct 2026, 01:00 PM",
    fileName: "VitalSync_db_snapshot_20261015_1300.enc",
    size: "1.84 GB",
    type: "Automated Daily",
    storageTarget: "AWS GovCloud S3 Glacier",
    encryption: "AES-256 GCM",
    status: "Verified & Stored",
    checksumSha256: "9f8e7d6c5b4a3928170e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
  },
  {
    id: "snp-02",
    timestamp: "14 Oct 2026, 02:00 AM",
    fileName: "VitalSync_db_snapshot_20261014_0200.enc",
    size: "1.82 GB",
    type: "Automated Daily",
    storageTarget: "AWS GovCloud S3 Glacier",
    encryption: "AES-256 GCM",
    status: "Verified & Stored",
    checksumSha256: "8e7d6c5b4a3928170e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
  },
  {
    id: "snp-03",
    timestamp: "13 Oct 2026, 02:00 AM",
    fileName: "VitalSync_db_snapshot_20261013_0200.enc",
    size: "1.79 GB",
    type: "Automated Daily",
    storageTarget: "AWS GovCloud S3 Glacier",
    encryption: "AES-256 GCM",
    status: "Verified & Stored",
    checksumSha256: "7d6c5b4a3928170e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
  },
  {
    id: "snp-04",
    timestamp: "10 Oct 2026, 11:30 PM",
    fileName: "VitalSync_db_manual_archive_v4.2.enc",
    size: "1.76 GB",
    type: "Manual Snapshot",
    storageTarget: "Offline NAS Cold Vault",
    encryption: "AES-256 GCM",
    status: "Verified & Stored",
    checksumSha256: "6c5b4a3928170e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
  },
];

/* ========================================================================= */
/* 6. EXTERNAL SYSTEM INTEGRATIONS & HL7 / ABDM INTERFACES */
/* ========================================================================= */

export const MOCK_INTEGRATIONS: ExternalIntegrationItem[] = [
  {
    id: "int-01",
    integrationName: "Ayushman Bharat Digital Mission (ABDM / ABHA ID)",
    category: "ABDM / ABHA",
    status: "Connected",
    lastSync: "3 mins ago",
    latencyMs: 142,
    endpointUrl: "https://ndhm.gov.in/api/v1/bridges",
    details: "M1, M2 & M3 Milestones Certified: Patient ABHA verification, encounter linking, and consent manager active.",
  },
  {
    id: "int-02",
    integrationName: "LIS Automated Analyzers (HL7 / ASTM Uni-Directional)",
    category: "LIS Analyzer HL7",
    status: "Connected",
    lastSync: "Just now",
    latencyMs: 18,
    endpointUrl: "tcp://192.168.2.100:5000",
    details: "Direct serial-to-TCP interface connecting Beckman Coulter DxH 900 & Mindray BS-800M biochemistry analyzer.",
  },
  {
    id: "int-03",
    integrationName: "Orthanc PACS / DICOM Radiographic Server",
    category: "PACS DICOM",
    status: "Connected",
    lastSync: "12 mins ago",
    latencyMs: 45,
    endpointUrl: "http://192.168.3.50:8042",
    details: "DICOM C-STORE and WADO-RS gateway routing GE CT & Philips MRI image studies to doctor viewing stations.",
  },
  {
    id: "int-04",
    integrationName: "National Health Authority (NHA) Claims Exchange (HCX)",
    category: "Insurance TPA Gateway",
    status: "Connected",
    lastSync: "25 mins ago",
    latencyMs: 210,
    endpointUrl: "https://hcx.nha.gov.in/api/v0.7/claims",
    details: "Standardized FHIR-based cashless pre-authorization and final claim settlement bridge with 14 insurance TPAs.",
  },
  {
    id: "int-05",
    integrationName: "ValueFirst DLT SMS & Meta Cloud WhatsApp API",
    category: "SMS/WhatsApp",
    status: "Connected",
    lastSync: "1 min ago",
    latencyMs: 88,
    endpointUrl: "https://api.valuefirst.com/psms/v1",
    details: "Enterprise DLT registered communication bridge routing OP tokens, lab PDFs, and admission alerts.",
  },
];
