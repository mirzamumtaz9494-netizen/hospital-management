"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  Receipt,
  CreditCard,
  QrCode,
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  X,
  FileText,
  Calculator,
  AlertTriangle,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { ShiftReconciliationModal } from "@/components/accounts/ShiftReconciliationModal";
import { OutstandingDuesModal } from "@/components/accounts/OutstandingDuesModal";
import { DoctorSettlementsTab } from "@/components/accounts/DoctorSettlementsTab";
import { GenerateDoctorSettlementModal } from "@/components/accounts/GenerateDoctorSettlementModal";
import { PrintDoctorSettlementModal } from "@/components/accounts/PrintDoctorSettlementModal";
import { useRole } from "@/context/RoleContext";
import { AccessDeniedGuard } from "@/components/AccessDeniedGuard";
import { MOCK_ACCOUNT_TRANSACTIONS } from "@/data/accountsMockData";
import {
  MOCK_DOCTOR_SETTLEMENT_RULES,
  MOCK_DOCTOR_SETTLEMENT_STATEMENTS,
} from "@/data/doctorSettlementsMockData";
import {
  HospitalAccountTransaction,
  DoctorSettlementRule,
  DoctorSettlementStatement,
} from "@/types";
import {
  isCleanProductionMode,
  EVENT_NAME_DATABASE_RESET,
} from "@/lib/databaseResetService";

export default function AccountsPage() {
  const { canAccessRoute, canAccessAction } = useRole();
  const [accountsMainTab, setAccountsMainTab] = useState<
    "DAY_BOOK" | "DOCTOR_SETTLEMENTS"
  >("DAY_BOOK");

  const [transactions, setTransactions] = useState<
    HospitalAccountTransaction[]
  >([]);
  const [doctorSettlementRules, setDoctorSettlementRules] = useState<
    DoctorSettlementRule[]
  >(MOCK_DOCTOR_SETTLEMENT_RULES);
  const [doctorSettlements, setDoctorSettlements] = useState<
    DoctorSettlementStatement[]
  >([]);

  // Modals for Doctor Settlements
  const [isGenerateDoctorSettleOpen, setIsGenerateDoctorSettleOpen] =
    useState(false);
  const [isPrintDoctorSettleOpen, setIsPrintDoctorSettleOpen] = useState(false);
  const [selectedDoctorSettleForPrint, setSelectedDoctorSettleForPrint] =
    useState<DoctorSettlementStatement | null>(null);

  useEffect(() => {
    const sync = () => {
      const isClean = isCleanProductionMode();
      if (isClean) {
        setTransactions([]);
        setDoctorSettlements([]);
      } else {
        setTransactions(MOCK_ACCOUNT_TRANSACTIONS);
        setDoctorSettlements(MOCK_DOCTOR_SETTLEMENT_STATEMENTS);
      }
    };
    sync();
    window.addEventListener(EVENT_NAME_DATABASE_RESET, sync);
    return () => window.removeEventListener(EVENT_NAME_DATABASE_RESET, sync);
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isShiftReconcileOpen, setIsShiftReconcileOpen] = useState(false);
  const [isOutstandingDuesOpen, setIsOutstandingDuesOpen] = useState(false);

  // New Expense Voucher Form State
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(1500);
  const [expenseMode, setExpenseMode] = useState<
    HospitalAccountTransaction["paymentMode"]
  >("Cash");
  const [expenseNotes, setExpenseNotes] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    const newTxn: HospitalAccountTransaction = {
      id: `txn-${Date.now()}`,
      voucherNo: `VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "Petty Expense",
      category: "Expense",
      amount: Number(expenseAmount) || 0,
      paymentMode: expenseMode,
      patientOrVendor: expenseTitle,
      refNumber: `EXP-${Date.now().toString().slice(-4)}`,
      cashierName: "Ramesh Sharma",
      notes: expenseNotes || "Hospital maintenance / petty cash voucher",
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setIsAddExpenseModalOpen(false);
    showToast(`Petty expense voucher ${newTxn.voucherNo} (₹${newTxn.amount}) authorized!`);

    // Reset
    setExpenseTitle("");
    setExpenseAmount(1500);
    setExpenseNotes("");
  };

  // Doctor Settlement Handlers
  const handleSaveDoctorSettlement = (
    newStatement: DoctorSettlementStatement
  ) => {
    setDoctorSettlements((prev) => [newStatement, ...prev]);
    showToast(
      `Doctor Settlement ${newStatement.settlementNumber} for ${newStatement.doctorName} (₹${newStatement.netPayable.toLocaleString("en-IN")}) committed!`
    );
  };

  const handleUpdateDoctorSettlementStatus = (
    id: string,
    newStatus: DoctorSettlementStatement["paymentStatus"],
    txRef?: string
  ) => {
    setDoctorSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              paymentStatus: newStatus,
              ...(txRef ? { transactionRef: txRef } : {}),
            }
          : s
      )
    );
    showToast(`Settlement status updated to ${newStatus}`);
  };

  const handlePrintDoctorSettlement = (
    statement: DoctorSettlementStatement
  ) => {
    setSelectedDoctorSettleForPrint(statement);
    setIsPrintDoctorSettleOpen(true);
  };

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.patientOrVendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.refNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTypeFilter === "All" || t.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const totalRevenue = transactions
    .filter((t) => t.category === "Revenue" || t.category === "Deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.category === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleQuickAction = (actionId: string) => {
    setIsQuickMenuOpen(false);
    switch (actionId) {
      case "create_op":
        setIsNewOpModalOpen(true);
        break;
      case "create_ip":
        setIsNewIpModalOpen(true);
        break;
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

  if (!canAccessRoute("/accounts")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
        <Header
          activeNav="Accounts"
          onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
        />
        <AccessDeniedGuard
          moduleName="Hospital Accounts & Day Book"
          requiredRoles={[
            "Billing Cashier",
            "Front Desk & Triage Receptionist",
            "Chief Medical Officer (CMO)",
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeNav="Accounts"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link href="/" className="hover:text-slate-600 transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-bold">Accounts &amp; Finance</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Hospital Financial Accounts &amp; Cashier Day Book
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 mr-1" />
                Shift Shift Reconciled
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily collection ledger, counter cash drawers, UPI BharatQR reconciliation, and petty expense disbursements
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsOutstandingDuesOpen(true)}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 active:scale-95"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Patient Dues &amp; Alerts</span>
            </button>

            <button
              onClick={() => setIsShiftReconcileOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5 text-teal-400" />
              <span>Reconcile Shift (Z-Report)</span>
            </button>

            <button
              onClick={() => {
                showToast("Exporting official daily accounts book (CSV)...");
                setTimeout(() => {
                  showToast("Downloaded VitalSync-daybook-20261015.csv");
                }, 1200);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Day Book
            </button>

            {canAccessAction("add_expenses") && (
              <button
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense Voucher</span>
              </button>
            )}
          </div>
        </div>

        {/* Accounts Main Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setAccountsMainTab("DAY_BOOK")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              accountsMainTab === "DAY_BOOK"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80"
            }`}
          >
            <Receipt className="w-4 h-4 text-teal-400" />
            <span>Day Book &amp; Cash Counters</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-200 font-mono">
              {transactions.length}
            </span>
          </button>

          <button
            onClick={() => setAccountsMainTab("DOCTOR_SETTLEMENTS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              accountsMainTab === "DOCTOR_SETTLEMENTS"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80"
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span>Doctor Settlements &amp; Fee Sharing</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-teal-500/20 text-teal-700 font-mono font-bold">
              {doctorSettlements.length} Vouchers
            </span>
          </button>
        </div>

        {accountsMainTab === "DAY_BOOK" ? (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Daily Collections
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-700 font-bold">+7.8% vs yesterday</span>
              <span>• Net inflow</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Counter Cash at Hand
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹1,45,200
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-700 font-bold">In Main Cash Drawer</span> (Cashier 1 &amp; 2)
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Digital UPI &amp; Cards
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹5,26,200
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-blue-700 font-bold">BharatQR &amp; POS</span> direct bank credit
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Petty Cash Disbursed
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-800 tracking-tight">
              ₹{totalExpense.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-rose-700 font-bold">Oxygen &amp; Refunds</span> authorized
            </div>
          </div>
        </div>

        {/* Search & Type Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions by voucher no, patient, cashier, or ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
              >
                <option value="All">All Vouchers</option>
                <option value="OP Collection">OP Collection</option>
                <option value="IP Advance">IP Advance</option>
                <option value="Discharge Settlement">Discharge Settlement</option>
                <option value="Pharmacy POS">Pharmacy POS</option>
                <option value="Petty Expense">Petty Expense</option>
                <option value="Refund">Refunds</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredTxns.length} transactions
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Hospital Day Book Cashier Transactions Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Sequential billing entries, electronic payment references, and cashier receipts
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Voucher No. &amp; Time</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Patient / Payee</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4">Gateway Ref / Auth</th>
                  <th className="py-3 px-4">Cashier</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {txn.voucherNo}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {txn.timestamp}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          txn.type === "Discharge Settlement"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : txn.type === "IP Advance"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : txn.type === "OP Collection"
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : txn.type === "Petty Expense"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : txn.type === "Refund"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">
                        {txn.patientOrVendor}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {txn.notes}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {txn.paymentMode}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {txn.refNumber}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {txn.cashierName}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-mono font-bold px-2.5 py-1 rounded-lg ${
                          txn.category === "Expense"
                            ? "text-rose-700 bg-rose-50 font-black"
                            : "text-slate-900 bg-slate-100"
                        }`}
                      >
                        {txn.category === "Expense" ? "-" : "+"}₹
                        {txn.amount.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          showToast(`Printing voucher receipt ${txn.voucherNo}...`);
                          setTimeout(() => window.print(), 500);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    ) : (
      <DoctorSettlementsTab
        statements={doctorSettlements}
        rules={doctorSettlementRules}
        onOpenGenerateModal={() => setIsGenerateDoctorSettleOpen(true)}
        onPrintStatement={handlePrintDoctorSettlement}
        onUpdateStatementStatus={handleUpdateDoctorSettlementStatus}
      />
    )}
  </main>

      {/* Add Expense Voucher Modal */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Disburse Petty Expense Voucher
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authorized hospital cash drawer expense
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payee / Vendor / Purpose *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CryoGas Oxygen Refill or Biohazard bags"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Voucher Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={expenseMode}
                    onChange={(e) =>
                      setExpenseMode(
                        e.target.value as HospitalAccountTransaction["paymentMode"]
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Cash">Cash Drawer</option>
                    <option value="UPI / QR">UPI / NetBanking</option>
                    <option value="Credit/Debit Card">Company Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Voucher Explanation / Notes
                </label>
                <textarea
                  rows={2}
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Reason for disbursement and approval authorization..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Clinical Action Tray Modals */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={handleQuickAction}
      />

      <CreateOpModal
        isOpen={isNewOpModalOpen}
        onClose={() => setIsNewOpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewOpModalOpen(false);
          showToast(`OP consultation generated for ${patient.name}`);
        }}
      />

      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewIpModalOpen(false);
          showToast(`IP admission registered for ${patient.name}`);
        }}
      />

      <ShiftReconciliationModal
        isOpen={isShiftReconcileOpen}
        onClose={() => setIsShiftReconcileOpen(false)}
        transactions={transactions}
        onShiftReconciled={(report) => {
          showToast(`Shift Z-Report ${report.shift_id} generated & locked! Variance: ₹${report.cash_variance}`);
        }}
      />

      <OutstandingDuesModal
        isOpen={isOutstandingDuesOpen}
        onClose={() => setIsOutstandingDuesOpen(false)}
      />

      {/* Generate Doctor Settlement Modal */}
      <GenerateDoctorSettlementModal
        isOpen={isGenerateDoctorSettleOpen}
        onClose={() => setIsGenerateDoctorSettleOpen(false)}
        rules={doctorSettlementRules}
        onSave={handleSaveDoctorSettlement}
      />

      {/* Print Official Doctor Settlement Modal */}
      <PrintDoctorSettlementModal
        isOpen={isPrintDoctorSettleOpen}
        onClose={() => {
          setIsPrintDoctorSettleOpen(false);
          setSelectedDoctorSettleForPrint(null);
        }}
        settlement={selectedDoctorSettleForPrint}
      />
    </div>
  );
}
