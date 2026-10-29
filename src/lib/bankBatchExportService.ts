import { StaffSalarySlip, DoctorSettlementStatement } from "@/types";

/**
 * VitalSync HMS - Corporate Bank Batch NEFT/RTGS File Generator
 * Generates official bulk salary payout files compatible with
 * HDFC Corporate Enet, ICICI Corporate Banking, and SBI CMS portals.
 */

export function exportStaffSalaryBankBatch(
  slips: StaffSalarySlip[],
  filenamePrefix: string = "VitalSync_Salary_Batch_NEFT"
) {
  if (!slips || slips.length === 0) return;

  const today = new Date().toISOString().split("T")[0];

  // Standard Corporate Bank Bulk NEFT/RTGS CSV Headers
  const headers = [
    "Transaction Type",
    "Beneficiary Name",
    "Beneficiary Account Number",
    "IFSC Code",
    "Amount",
    "Narration",
    "Employee Code",
    "Beneficiary Email",
    "Value Date",
  ];

  const rows = slips.map((slip) => {
    // Amounts >= ₹2,00,000 can be processed via RTGS, others via NEFT
    const txType = slip.netSalary >= 200000 ? "RTGS" : "NEFT";
    const narration = `SALARY ${slip.monthYear.toUpperCase()} ${slip.employeeCode}`;

    return [
      txType,
      `"${slip.employeeName.replace(/"/g, '""')}"`,
      `"${slip.bankAccountNumber}"`,
      `"${slip.bankIfsc}"`,
      slip.netSalary.toFixed(2),
      `"${narration}"`,
      `"${slip.employeeCode}"`,
      `"${slip.beneficiaryEmail || ""}"`,
      today,
    ];
  });

  const csvContent =
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filenamePrefix}_${today.replace(/-/g, "")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDoctorSettlementsBankBatch(
  statements: DoctorSettlementStatement[],
  filenamePrefix: string = "VitalSync_Doctor_Settlements_NEFT"
) {
  if (!statements || statements.length === 0) return;

  const today = new Date().toISOString().split("T")[0];

  const headers = [
    "Transaction Type",
    "Beneficiary Doctor Name",
    "Beneficiary Account Number",
    "IFSC Code",
    "Amount",
    "Narration",
    "PAN Number",
    "Statement Reference",
    "Value Date",
  ];

  const rows = statements.map((stmt) => {
    const txType = stmt.netPayable >= 200000 ? "RTGS" : "NEFT";
    const narration = `DOC FEE ${stmt.period.toUpperCase()} ${stmt.settlementNumber}`;

    return [
      txType,
      `"${stmt.doctorName.replace(/"/g, '""')}"`,
      `"${stmt.bankAccountNumber}"`,
      `"${stmt.bankIfsc}"`,
      stmt.netPayable.toFixed(2),
      `"${narration}"`,
      `"${stmt.panNumber}"`,
      `"${stmt.settlementNumber}"`,
      today,
    ];
  });

  const csvContent =
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filenamePrefix}_${today.replace(/-/g, "")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
