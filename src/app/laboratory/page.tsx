"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Plus,
  Printer,
  Download,
  Barcode,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { LabOrdersTab } from "@/components/laboratory/LabOrdersTab";
import { PhlebotomyTab } from "@/components/laboratory/PhlebotomyTab";
import { ResultsEntryTab } from "@/components/laboratory/ResultsEntryTab";
import { TestCatalogTab } from "@/components/laboratory/TestCatalogTab";
import { LabBillingTab } from "@/components/laboratory/LabBillingTab";
import { NewLabOrderModal } from "@/components/laboratory/NewLabOrderModal";
import { SampleCollectionModal } from "@/components/laboratory/SampleCollectionModal";
import { PrintLabReportModal } from "@/components/laboratory/PrintLabReportModal";
import { PrintBarcodeModal } from "@/components/laboratory/PrintBarcodeModal";
import { PrintLabBillModal } from "@/components/laboratory/PrintLabBillModal";
import {
  LabOrder,
  LabBillItem,
  LabCatalogItem,
  Patient,
} from "@/types";
import {
  MOCK_LAB_ORDERS,
  MOCK_LAB_BILLS,
  MOCK_LAB_CATALOG,
} from "@/data/labMockData";

export default function LaboratoryPage() {
  const [activeTab, setActiveTab] = useState<
    "Orders Worklist" | "Phlebotomy" | "Results Entry" | "Test Directory" | "Lab Billing"
  >("Orders Worklist");

  // Core Data State
  const [orders, setOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
  const [bills, setBills] = useState<LabBillItem[]>(MOCK_LAB_BILLS);
  const [catalog, setCatalog] = useState<LabCatalogItem[]>(MOCK_LAB_CATALOG);

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);

  // Phlebotomy Modal
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [collectionOrder, setCollectionOrder] = useState<LabOrder | null>(null);

  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportOrder, setSelectedReportOrder] = useState<LabOrder | null>(null);

  // Barcode Modal
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedBarcodeOrder, setSelectedBarcodeOrder] = useState<LabOrder | null>(null);

  // Bill Modal
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<LabBillItem | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Create New Lab Order
  const handleCreateOrder = (newOrder: LabOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Create corresponding billing receipt
    const newBill: LabBillItem = {
      id: `lbi-${Date.now()}`,
      billNo: `LB-${Math.floor(4110 + Math.random() * 50)}`,
      orderNo: newOrder.orderNo,
      patientName: newOrder.patientName,
      mrId: newOrder.mrId,
      doctor: newOrder.referringDoctor,
      tests: newOrder.tests.map((t) => ({
        testName: t.testName,
        department: t.department,
        cost: t.price,
      })),
      totalCost: newOrder.totalAmount,
      discount: 0,
      netPayable: newOrder.totalAmount,
      paidAmount: newOrder.totalAmount,
      balanceDue: 0,
      paymentMode: "UPI / Counter",
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Paid",
    };

    setBills((prev) => [newBill, ...prev]);
    showToast(`Laboratory requisition ${newOrder.orderNo} created for ${newOrder.patientName}!`);
  };

  // 2. Phlebotomy Collection
  const handleOpenCollectionModal = (order: LabOrder) => {
    setCollectionOrder(order);
    setCollectionModalOpen(true);
  };

  const handleConfirmCollection = (orderId: string, phlebotomist: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Sample Collected",
              sampleCollectedAt: timeNow,
              phlebotomist,
              tests: o.tests.map((t) => ({ ...t, status: "Sample Collected" })),
            }
          : o
      )
    );
    showToast("Specimen sample marked collected and queued for analyzer processing!");
  };

  // 3. Save Draft Parameter Results
  const handleSaveResults = (orderId: string, updatedOrder: LabOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? updatedOrder : o))
    );
    showToast(`Parameter results saved for ${updatedOrder.orderNo}`);
  };

  // 4. Pathologist Electronic Approval
  const handleApproveOrder = (approvedOrder: LabOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === approvedOrder.id ? approvedOrder : o))
    );
    showToast(`Lab Report ${approvedOrder.orderNo} authorized by Dr. Bhargav!`);
    // Automatically open report for print
    setSelectedReportOrder(approvedOrder);
    setReportModalOpen(true);
  };

  // 5. Print Handlers
  const handlePrintReport = (order: LabOrder) => {
    setSelectedReportOrder(order);
    setReportModalOpen(true);
  };

  const handlePrintBarcode = (order: LabOrder) => {
    setSelectedBarcodeOrder(order);
    setBarcodeModalOpen(true);
  };

  const handlePrintBill = (bill: LabBillItem) => {
    setSelectedBill(bill);
    setBillModalOpen(true);
  };

  // Quick Action Handler for Cmd+K menu
  const handleQuickAction = (actionId: string) => {
    setIsQuickMenuOpen(false);
    switch (actionId) {
      case "create_op":
        setIsNewOpModalOpen(true);
        break;
      case "create_ip":
        setIsNewIpModalOpen(true);
        break;
      case "lab_billing":
        setActiveTab("Lab Billing");
        break;
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

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
        activeNav="Laboratory"
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
              <span className="text-teal-700 font-bold">Laboratory & Diagnostics</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Laboratory & Diagnostics (LIS)
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 mr-1" />
                NABL Accredited • ISO 15189
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pathology requisitions, phlebotomy tracking, auto-analyzer results, clinical validation & signed reports
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export
            </button>

            <button
              onClick={() => setActiveTab("Phlebotomy")}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
              Sample Collection Desk
            </button>

            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-teal-800/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              New Lab Order
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-5 overflow-x-auto no-scrollbar">
          {(
            [
              {
                id: "Orders Worklist",
                label: "Orders Worklist",
                badge: `${orders.length} Active`,
              },
              {
                id: "Phlebotomy",
                label: "Phlebotomy & Samples",
                badge: `${orders.filter((o) => o.status === "Pending Sample").length} Pending`,
              },
              {
                id: "Results Entry",
                label: "Results Entry & Approval",
                badge: `${orders.filter((o) => o.status === "Pending Approval").length} To Sign`,
              },
              {
                id: "Test Directory",
                label: "Test Directory & Tariffs",
                badge: `${catalog.length} Tests`,
              },
              {
                id: "Lab Billing",
                label: "Lab Invoices & Cashier",
                badge: `₹${(bills.reduce((a, b) => a + b.paidAmount, 0) / 1000).toFixed(1)}k`,
              },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-teal-500/20 text-teal-300"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab View Rendering */}
        <div>
          {activeTab === "Orders Worklist" && (
            <LabOrdersTab
              orders={orders}
              onSelectOrder={(ord) => {
                if (ord.status === "Pending Sample") {
                  handleOpenCollectionModal(ord);
                } else if (ord.status === "Completed") {
                  handlePrintReport(ord);
                } else {
                  setActiveTab("Results Entry");
                }
              }}
              onCollectSample={handleOpenCollectionModal}
              onEnterResults={() => setActiveTab("Results Entry")}
              onPrintReport={handlePrintReport}
              onPrintBarcode={handlePrintBarcode}
            />
          )}

          {activeTab === "Phlebotomy" && (
            <PhlebotomyTab
              orders={orders}
              onCollectSample={handleOpenCollectionModal}
              onPrintBarcode={handlePrintBarcode}
            />
          )}

          {activeTab === "Results Entry" && (
            <ResultsEntryTab
              orders={orders}
              onSaveResults={handleSaveResults}
              onApproveOrder={handleApproveOrder}
              onPrintReport={handlePrintReport}
            />
          )}

          {activeTab === "Test Directory" && (
            <TestCatalogTab
              catalog={catalog}
              onOrderTest={() => setIsNewOrderModalOpen(true)}
            />
          )}

          {activeTab === "Lab Billing" && (
            <LabBillingTab
              bills={bills}
              onPrintBill={handlePrintBill}
              onSettleBill={(b) => showToast(`Bill #${b.billNo} settled!`)}
            />
          )}
        </div>
      </main>

      {/* Quick Menu Shortcut Modal (Cmd+K) */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={handleQuickAction}
      />

      {/* Create New OP Modal */}
      <CreateOpModal
        isOpen={isNewOpModalOpen}
        onClose={() => setIsNewOpModalOpen(false)}
        onSuccess={(p) => showToast(`OP Registration created for ${p.name}`)}
      />

      {/* Create New IP Modal */}
      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={(p) => showToast(`IP Admission registered for ${p.name}`)}
      />

      {/* New Lab Test Order Modal */}
      <NewLabOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSubmitOrder={handleCreateOrder}
      />

      {/* Sample Collection Modal */}
      <SampleCollectionModal
        order={collectionOrder}
        onClose={() => setCollectionModalOpen(false)}
        onConfirmCollection={handleConfirmCollection}
        onPrintBarcode={handlePrintBarcode}
      />

      {/* Official Diagnostic Report Print Modal */}
      <PrintLabReportModal
        order={selectedReportOrder}
        onClose={() => {
          setReportModalOpen(false);
          setSelectedReportOrder(null);
        }}
      />

      {/* Specimen Tube Barcode Label Print Modal */}
      <PrintBarcodeModal
        order={selectedBarcodeOrder}
        onClose={() => {
          setBarcodeModalOpen(false);
          setSelectedBarcodeOrder(null);
        }}
      />

      {/* Diagnostic Cash Receipt Bill Modal */}
      <PrintLabBillModal
        bill={selectedBill}
        onClose={() => {
          setBillModalOpen(false);
          setSelectedBill(null);
        }}
      />
    </div>
  );
}
