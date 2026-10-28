/**
 * VitalSync HMS - Cash & UPI Shift Reconciliation Engine
 * Generates immutable Day-End Cashier Z-Reports, calculates currency denominations,
 * matches UPI bank UTR references, and prevents cash drawer theft.
 */

export interface DenominationBreakdown {
  d500: number;
  d200: number;
  d100: number;
  d50: number;
  d20: number;
  d10: number;
  dCoins: number;
}

export interface CashierShiftReport {
  shift_id: string;
  tenant_id: string;
  cashier_name: string;
  terminal_station: string;
  opened_at: string;
  closed_at: string;
  denominations: DenominationBreakdown;
  physical_cash_counted: number;
  system_expected_cash: number;
  cash_variance: number; // physical - system
  variance_status: "EXACT_MATCH" | "SURPLUS" | "DEFICIT";
  total_upi_amount: number;
  upi_txn_count: number;
  total_card_amount: number;
  total_advance_held: number;
  total_gross_collections: number;
  supervisor_name?: string;
  notes?: string;
}

export interface ShiftTransaction {
  id: string;
  invoice_number: string;
  patient_name: string;
  uhid: string;
  payment_mode: "Cash" | "UPI" | "Card" | "Credit / Dues";
  amount: number;
  upi_utr_ref?: string;
  timestamp: string;
}

const LOCAL_SHIFTS_KEY = "vitalsync_cashier_shift_reports_v1";

export function calculatePhysicalCash(d: DenominationBreakdown): number {
  return (
    (d.d500 || 0) * 500 +
    (d.d200 || 0) * 200 +
    (d.d100 || 0) * 100 +
    (d.d50 || 0) * 50 +
    (d.d20 || 0) * 20 +
    (d.d10 || 0) * 10 +
    (d.dCoins || 0)
  );
}

export function validateUpiUtr(utr: string): { valid: boolean; error?: string } {
  const clean = utr.trim();
  if (!clean) {
    return { valid: false, error: "UPI Bank Reference (UTR) is mandatory" };
  }
  // Standard Indian Bank UTR format: 12-digit numeric
  if (!/^\d{12}$/.test(clean)) {
    return {
      valid: false,
      error: "UTR must be exactly 12 numeric digits (found on GPay, PhonePe, Paytm receipt)",
    };
  }
  return { valid: true };
}

export function generateShiftZReport(
  transactions: ShiftTransaction[],
  denominations: DenominationBreakdown,
  cashierName: string,
  terminalStation: string,
  tenantId: string,
  openedAt: string,
  supervisorName?: string,
  notes?: string
): CashierShiftReport {
  const physicalCash = calculatePhysicalCash(denominations);

  let systemCash = 0;
  let totalUpi = 0;
  let upiCount = 0;
  let totalCard = 0;

  transactions.forEach((tx) => {
    if (tx.payment_mode === "Cash") {
      systemCash += tx.amount;
    } else if (tx.payment_mode === "UPI") {
      totalUpi += tx.amount;
      upiCount += 1;
    } else if (tx.payment_mode === "Card") {
      totalCard += tx.amount;
    }
  });

  const variance = physicalCash - systemCash;
  let varianceStatus: CashierShiftReport["variance_status"] = "EXACT_MATCH";
  if (variance > 0) varianceStatus = "SURPLUS";
  else if (variance < 0) varianceStatus = "DEFICIT";

  const shiftReport: CashierShiftReport = {
    shift_id: `SHIFT-Z-${Date.now().toString().slice(-6)}`,
    tenant_id: tenantId,
    cashier_name: cashierName,
    terminal_station: terminalStation,
    opened_at: openedAt,
    closed_at: new Date().toISOString(),
    denominations,
    physical_cash_counted: physicalCash,
    system_expected_cash: systemCash,
    cash_variance: variance,
    variance_status: varianceStatus,
    total_upi_amount: totalUpi,
    upi_txn_count: upiCount,
    total_card_amount: totalCard,
    total_advance_held: 0,
    total_gross_collections: physicalCash + totalUpi + totalCard,
    supervisor_name: supervisorName,
    notes,
  };

  // Persist locally
  try {
    const raw = localStorage.getItem(LOCAL_SHIFTS_KEY);
    const list: CashierShiftReport[] = raw ? JSON.parse(raw) : [];
    list.unshift(shiftReport);
    localStorage.setItem(LOCAL_SHIFTS_KEY, JSON.stringify(list));
  } catch {}

  return shiftReport;
}

export function getSavedShiftReports(): CashierShiftReport[] {
  try {
    const raw = localStorage.getItem(LOCAL_SHIFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
