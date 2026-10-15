"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Pill,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  ShoppingCart,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { PharmacyDispensingTab } from "@/components/pharmacy/PharmacyDispensingTab";
import { PharmacyPosTab } from "@/components/pharmacy/PharmacyPosTab";
import { PharmacyInventoryTab } from "@/components/pharmacy/PharmacyInventoryTab";
import { PharmacyWardIndentsTab } from "@/components/pharmacy/PharmacyWardIndentsTab";
import { PharmacyPurchasesTab } from "@/components/pharmacy/PharmacyPurchasesTab";
import { DispensePrescriptionModal } from "@/components/pharmacy/DispensePrescriptionModal";
import { PrintPharmacyBillModal } from "@/components/pharmacy/PrintPharmacyBillModal";
import { AddMedicineModal } from "@/components/pharmacy/AddMedicineModal";
import { StockAdjustmentModal } from "@/components/pharmacy/StockAdjustmentModal";
import { PrintWardIndentSlipModal } from "@/components/pharmacy/PrintWardIndentSlipModal";
import {
  PharmacyOrder,
  MedicineItem,
  WardIndent,
  PharmacyPurchaseOrder,
} from "@/types";
import {
  MOCK_PHARMACY_ORDERS,
  MOCK_MEDICINES,
  MOCK_WARD_INDENTS,
  MOCK_PURCHASE_ORDERS,
} from "@/data/pharmacyMockData";

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState<
    | "e-Prescriptions"
    | "Retail POS"
    | "Drug Inventory"
    | "Ward Indents"
    | "Purchases & PO"
  >("e-Prescriptions");

  // Core Data States
  const [orders, setOrders] = useState<PharmacyOrder[]>(MOCK_PHARMACY_ORDERS);
  const [medicines, setMedicines] = useState<MedicineItem[]>(MOCK_MEDICINES);
  const [indents, setIndents] = useState<WardIndent[]>(MOCK_WARD_INDENTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PharmacyPurchaseOrder[]>(
    MOCK_PURCHASE_ORDERS
  );

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);

  // Dispense modal
  const [dispenseModalOpen, setDispenseModalOpen] = useState(false);
  const [dispenseOrder, setDispenseOrder] = useState<PharmacyOrder | null>(null);

  // Print Bill Modal
  const [printBillModalOpen, setPrintBillModalOpen] = useState(false);
  const [billOrder, setBillOrder] = useState<PharmacyOrder | null>(null);

  // Add Medicine Modal
  const [addMedicineModalOpen, setAddMedicineModalOpen] = useState(false);

  // Stock Adjustment Modal
  const [adjustStockModalOpen, setAdjustStockModalOpen] = useState(false);
  const [adjustMedicine, setAdjustMedicine] = useState<MedicineItem | null>(null);

  // Print Ward Indent Slip Modal
  const [printIndentModalOpen, setPrintIndentModalOpen] = useState(false);
  const [indentToPrint, setIndentToPrint] = useState<WardIndent | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Complete Retail POS Sale
  const handleCompleteSale = (newOrder: PharmacyOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock for sold items
    newOrder.items.forEach((item) => {
      setMedicines((prev) =>
        prev.map((med) =>
          med.id === item.medicineId
            ? {
                ...med,
                stockQuantity: Math.max(0, med.stockQuantity - item.quantity),
              }
            : med
        )
      );
    });

    showToast(`Sale completed! Invoice #${newOrder.billNumber} generated.`);
    setBillOrder(newOrder);
    setPrintBillModalOpen(true);
  };

  // 2. Dispense Prescribed Order
  const handleOpenDispenseModal = (order: PharmacyOrder) => {
    setDispenseOrder(order);
    setDispenseModalOpen(true);
  };

  const handleConfirmDispense = (
    order: PharmacyOrder,
    nextAction?: "print" | "close"
  ) => {
    const timeNow = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedOrder: PharmacyOrder = {
      ...order,
      dispenseStatus: "Dispensed",
      dispensedBy: "Chief Pharmacist V. Murthy",
      dispensedAt: timeNow,
      billNumber: order.billNumber || `PHB-${Math.floor(5025 + Math.random() * 50)}`,
    };

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? updatedOrder : o))
    );

    // Deduct stock
    order.items.forEach((item) => {
      setMedicines((prev) =>
        prev.map((med) =>
          med.id === item.medicineId
            ? {
                ...med,
                stockQuantity: Math.max(0, med.stockQuantity - item.quantity),
              }
            : med
        )
      );
    });

    setDispenseModalOpen(false);
    setDispenseOrder(null);
    showToast(`Prescription ${order.rxNumber} marked Dispensed!`);

    if (nextAction === "print") {
      setBillOrder(updatedOrder);
      setPrintBillModalOpen(true);
    }
  };

  // 3. Print Bill
  const handlePrintBill = (order: PharmacyOrder) => {
    setBillOrder(order);
    setPrintBillModalOpen(true);
  };

  // 4. Add Medicine to Formulary
  const handleAddMedicine = (newMed: MedicineItem) => {
    setMedicines((prev) => [newMed, ...prev]);
    showToast(`${newMed.name} added to hospital formulary!`);
  };

  // 5. Stock Adjustment
  const handleOpenAdjustStock = (med: MedicineItem) => {
    setAdjustMedicine(med);
    setAdjustStockModalOpen(true);
  };

  const handleConfirmAdjustment = (
    medId: string,
    newQty: number,
    reason: string
  ) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medId
          ? {
              ...m,
              stockQuantity: newQty,
              status:
                newQty <= m.minReorderLevel
                  ? "Low Stock"
                  : newQty === 0
                  ? "Out of Stock"
                  : "In Stock",
            }
          : m
      )
    );
    setAdjustStockModalOpen(false);
    setAdjustMedicine(null);
    showToast(`Stock updated to ${newQty} units (${reason})`);
  };

  // 6. Ward Indent Issue
  const handleIssueIndent = (indentId: string) => {
    setIndents((prev) =>
      prev.map((ind) =>
        ind.id === indentId
          ? {
              ...ind,
              status: "Issued & Dispatched",
              items: ind.items.map((i) => ({ ...i, issuedQty: i.requestedQty })),
            }
          : ind
      )
    );
    showToast(`Ward Indent dispatched & synced to IPD nursing station!`);
  };

  const handlePrintIndent = (indent: WardIndent) => {
    setIndentToPrint(indent);
    setPrintIndentModalOpen(true);
  };

  // 7. Purchase Order GRN Receipt
  const handleReceiveGoods = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === poId
          ? {
              ...po,
              status: "Goods Received (GRN)",
            }
          : po
      )
    );
    showToast(`Goods Received Note (GRN) generated! Stock levels updated.`);
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
      case "pharmacy_billing":
        setActiveTab("Retail POS");
        break;
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

  const pendingDispenseCount = orders.filter(
    (o) => o.dispenseStatus === "Pending Dispense"
  ).length;

  const lowStockCount = medicines.filter(
    (m) => m.stockQuantity <= m.minReorderLevel
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeNav="Pharmacy"
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
              <span className="text-teal-700 font-bold">Pharmacy &amp; Formulary</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Pharmacy &amp; Formulary Management
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 mr-1" />
                DL Form 20B / 21B • 24/7 Dispensing
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Doctor e-prescriptions dispensing, retail POS billing, formulary inventory, and ward nursing indents
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
              onClick={() => setAddMedicineModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-teal-800" />
              Add Medicine
            </button>

            <button
              onClick={() => setActiveTab("Retail POS")}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-teal-800/20 transition flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
              New Retail POS Sale
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-5 overflow-x-auto no-scrollbar">
          {(
            [
              {
                id: "e-Prescriptions",
                label: "e-Prescriptions & Dispensing",
                badge: `${pendingDispenseCount} Pending`,
              },
              {
                id: "Retail POS",
                label: "Retail POS Cash Counter",
                badge: "Walk-in",
              },
              {
                id: "Drug Inventory",
                label: "Drug Inventory & Stocks",
                badge: `${lowStockCount > 0 ? `${lowStockCount} Low` : `${medicines.length} Items`}`,
              },
              {
                id: "Ward Indents",
                label: "Ward Indents & Floor Stock",
                badge: `${indents.filter((i) => i.status === "Pending Review").length} Due`,
              },
              {
                id: "Purchases & PO",
                label: "Purchases & Suppliers",
                badge: `${purchaseOrders.length} POs`,
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
          {activeTab === "e-Prescriptions" && (
            <PharmacyDispensingTab
              orders={orders}
              onSelectOrder={handleOpenDispenseModal}
              onDispenseOrder={handleOpenDispenseModal}
              onPrintBill={handlePrintBill}
            />
          )}

          {activeTab === "Retail POS" && (
            <PharmacyPosTab
              medicines={medicines}
              onCompleteSale={handleCompleteSale}
            />
          )}

          {activeTab === "Drug Inventory" && (
            <PharmacyInventoryTab
              medicines={medicines}
              onAddMedicine={() => setAddMedicineModalOpen(true)}
              onAdjustStock={handleOpenAdjustStock}
            />
          )}

          {activeTab === "Ward Indents" && (
            <PharmacyWardIndentsTab
              indents={indents}
              onIssueIndent={handleIssueIndent}
              onPrintIndent={handlePrintIndent}
            />
          )}

          {activeTab === "Purchases & PO" && (
            <PharmacyPurchasesTab
              purchaseOrders={purchaseOrders}
              onCreatePo={() => showToast("PO generation template ready")}
              onReceiveGoods={handleReceiveGoods}
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
        onSuccess={(p) => showToast(`OP Consultation registered for ${p.name}`)}
      />

      {/* Create New IP Modal */}
      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={(p) => showToast(`IP Admission registered for ${p.name}`)}
      />

      {/* Dispense Prescription Modal */}
      <DispensePrescriptionModal
        isOpen={dispenseModalOpen}
        order={dispenseOrder}
        onClose={() => {
          setDispenseModalOpen(false);
          setDispenseOrder(null);
        }}
        onConfirmDispense={handleConfirmDispense}
      />

      {/* Print Official Pharmacy Tax Invoice Modal */}
      <PrintPharmacyBillModal
        order={billOrder}
        onClose={() => {
          setPrintBillModalOpen(false);
          setBillOrder(null);
        }}
      />

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={addMedicineModalOpen}
        onClose={() => setAddMedicineModalOpen(false)}
        onAddMedicine={handleAddMedicine}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={adjustStockModalOpen}
        medicine={adjustMedicine}
        onClose={() => {
          setAdjustStockModalOpen(false);
          setAdjustMedicine(null);
        }}
        onConfirmAdjustment={handleConfirmAdjustment}
      />

      {/* Print Ward Indent Slip Modal */}
      <PrintWardIndentSlipModal
        indent={indentToPrint}
        onClose={() => {
          setPrintIndentModalOpen(false);
          setIndentToPrint(null);
        }}
      />
    </div>
  );
}
