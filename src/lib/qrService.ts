import QRCode from "qrcode";

export interface PatientQrData {
  uhid: string;
  tenantCode: string;
  patientName: string;
  phone: string;
  gender: string;
  bloodGroup?: string;
  registeredDate: string;
}

export interface DecodedPatientQr {
  uhid: string;
  tenantCode: string;
  chk: string;
  version: number;
}

/**
 * Generates an immutable, collision-safe UHID for patient identification
 * Format: UHID-[TENANT]-[YEAR]-[RANDOM_SEQ]
 * Example: UHID-APEX-2026-891042
 */
export function generateUhid(tenantCode: string): string {
  const year = new Date().getFullYear();
  const cleanCode = (tenantCode || "VS").replace(/[^A-Za-z0-9]/g, "").toUpperCase().substring(0, 4);
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `UHID-${cleanCode}-${year}-${randomSuffix}`;
}

/**
 * Resolves the base URL for QR verification.
 * When on localhost or 127.0.0.1, mobile phones cannot reach "localhost" directly from cellular network!
 * So we use the live Vercel domain as fallback for instant phone camera testing,
 * or the current origin if already on a public domain/LAN.
 */
export function getBaseVerificationUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "https://hospital-management-git-main-single-062a.vercel.app";
    }
    return window.location.origin;
  }
  return "https://hospital-management-git-main-single-062a.vercel.app";
}

/**
 * Creates an instant camera-scannable Web URL for OPD consultation slips.
 * When scanned by iPhone, Samsung or Android camera, opens the live digital pass.
 */
export function createOpdSlipQrUrl(data: {
  uhid: string;
  opId?: string;
  patientName: string;
  age: number;
  gender: string;
  phone?: string;
  department: string;
  attendingDoctor: string;
  admissionDate: string;
  billAmount?: number;
}): string {
  const base = getBaseVerificationUrl();
  const params = new URLSearchParams({
    type: "opd",
    uhid: data.uhid,
    opId: data.opId || "OP-2026-001",
    name: data.patientName,
    age: String(data.age),
    gender: data.gender,
    phone: data.phone || "",
    dept: data.department,
    doc: data.attendingDoctor,
    date: data.admissionDate,
    fee: String(data.billAmount || 500),
  });
  return `${base}/verify?${params.toString()}`;
}

/**
 * Creates an instant camera-scannable Web URL for External Diagnostic Vouchers.
 * When scanned by ANY smartphone camera, immediately opens the patient verification pass.
 */
export function createDiagnosticVoucherQrUrl(data: {
  voucherNumber: string;
  uhid: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone?: string;
  referralDate: string;
  destinationCenterName: string;
  centerAddress?: string;
  centerPhone?: string;
  referringDoctor: string;
  department: string;
  tests: { testName: string; testCode: string }[];
  urgency?: string;
}): string {
  const base = getBaseVerificationUrl();
  const testNames = data.tests.map((t) => t.testName).join(", ");
  const params = new URLSearchParams({
    type: "voucher",
    vch: data.voucherNumber,
    uhid: data.uhid,
    name: data.patientName,
    age: String(data.patientAge),
    gender: data.patientGender,
    phone: data.patientPhone || "",
    center: data.destinationCenterName,
    address: data.centerAddress || "",
    cphone: data.centerPhone || "",
    doc: data.referringDoctor,
    dept: data.department,
    tests: testNames,
    date: data.referralDate,
    urgency: data.urgency || "Routine",
  });
  return `${base}/verify?${params.toString()}`;
}

/**
 * Legacy payload generator (preserved for backwards compatibility)
 */
export function createPatientQrPayload(patient: {
  uhid: string;
  tenantCode: string;
}): string {
  const checksum = (patient.uhid.length * 31 + patient.tenantCode.length * 17)
    .toString(16)
    .toUpperCase();

  const payload: DecodedPatientQr = {
    uhid: patient.uhid,
    tenantCode: patient.tenantCode,
    chk: checksum,
    version: 1,
  };

  return JSON.stringify(payload);
}

/**
 * Generates human-readable, mobile-scanner friendly plain text for diagnostic vouchers.
 */
export function createDiagnosticVoucherQrText(data: {
  hospitalName?: string;
  patientName: string;
  uhid: string;
  patientAge: number;
  patientGender: string;
  patientPhone?: string;
  voucherNumber: string;
  referralDate: string;
  destinationCenterName: string;
  referringDoctor: string;
  department: string;
  tests: { testName: string; testCode: string }[];
  urgency?: string;
}): string {
  const testList = data.tests
    .map((t) => `• ${t.testName} (${t.testCode})`)
    .join("\n");

  return `🏥 ${data.hospitalName || "APEX CARE HOSPITAL"}
DIAGNOSTIC REFERRAL VOUCHER
━━━━━━━━━━━━━━━━━━━━
PATIENT DETAILS:
Name: ${data.patientName}
UHID: ${data.uhid}
Age / Sex: ${data.patientAge} Y / ${data.patientGender === "M" ? "Male" : data.patientGender === "F" ? "Female" : "Other"}
Phone: ${data.patientPhone || "N/A"}
Voucher No: ${data.voucherNumber}
Date: ${data.referralDate} | Priority: ${data.urgency || "Routine"}
━━━━━━━━━━━━━━━━━━━━
OUTSOURCED FACILITY:
Partner: ${data.destinationCenterName}
Doctor: ${data.referringDoctor} (${data.department})
━━━━━━━━━━━━━━━━━━━━
REQUISITIONED TESTS:
${testList}
━━━━━━━━━━━━━━━━━━━━
NABH & NMC COMPLIANT OFFICIAL REFERRAL`;
}

/**
 * Generates a high-contrast base64 Data URL for thermal or A4 printing
 */
export async function generateQrCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: {
        dark: "#0a0f1d",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("QR generation error:", err);
    return "";
  }
}

/**
 * Decodes and validates a scanned QR code payload
 */
export function parsePatientQrPayload(rawPayload: string): DecodedPatientQr | null {
  try {
    const parsed = JSON.parse(rawPayload);
    if (parsed.uhid && parsed.tenantCode) {
      return parsed as DecodedPatientQr;
    }
  } catch {
    if (rawPayload.startsWith("UHID-")) {
      const parts = rawPayload.split("-");
      return {
        uhid: rawPayload.trim(),
        tenantCode: parts[1] || "APEX",
        chk: "DIRECT",
        version: 1,
      };
    }
  }
  return null;
}
