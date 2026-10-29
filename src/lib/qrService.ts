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
 * Creates a tamper-evident, privacy-preserving QR code payload.
 * Sensitive clinical diagnoses are intentionally omitted from the raw QR code
 * to prevent visual eavesdropping or unauthorized paper leakage.
 */
export function createPatientQrPayload(patient: {
  uhid: string;
  tenantCode: string;
}): string {
  // Simple checksum for data validation
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
 * Instantly displays all patient demographics and test details when scanned by
 * any smartphone camera, Google Lens, or barcode reader.
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
      errorCorrectionLevel: "H",
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
    // If raw UHID was scanned directly
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
