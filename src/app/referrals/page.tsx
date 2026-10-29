"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Building2,
  Barcode,
  DollarSign,
  BarChart3,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { useRole } from "@/context/RoleContext";
import { AccessDeniedGuard } from "@/components/AccessDeniedGuard";
import { InboundReferralsTab } from "@/components/referrals/InboundReferralsTab";
import { ExternalDiagnosticVouchersTab } from "@/components/referrals/ExternalDiagnosticVouchersTab";
import { DiagnosticCentersDirectoryTab } from "@/components/referrals/DiagnosticCentersDirectoryTab";
import { B2bSettlementClearinghouseTab } from "@/components/referrals/B2bSettlementClearinghouseTab";
import { ReferralAnalyticsTab } from "@/components/referrals/ReferralAnalyticsTab";
import { NewInboundReferralModal } from "@/components/referrals/NewInboundReferralModal";
import { NewExternalDiagnosticOrderModal } from "@/components/referrals/NewExternalDiagnosticOrderModal";
import { PrintReferralAcknowledgmentModal } from "@/components/referrals/PrintReferralAcknowledgmentModal";
import { PrintExternalVoucherModal } from "@/components/referrals/PrintExternalVoucherModal";
import {
  InboundReferral,
  ExternalDiagnosticCenter,
  ExternalDiagnosticOrder,
  DiagnosticSettlement,
  InboundReferralStatus,
  ExternalOrderStatus,
  Patient,
} from "@/types";
import {
  MOCK_INBOUND_REFERRALS,
  MOCK_EXTERNAL_DIAGNOSTIC_CENTRES,
  MOCK_EXTERNAL_DIAGNOSTIC_ORDERS,
  MOCK_DIAGNOSTIC_SETTLEMENTS,
} from "@/data/referralsMockData";
import { getAllLocalRecords } from "@/lib/offlineStore";
import { supabase } from "@/lib/supabase";
import {
  isCleanProductionMode,
  EVENT_NAME_DATABASE_RESET,
} from "@/lib/databaseResetService";

export default function ReferralsPage() {
  const { canAccessRoute } = useRole();

  const [activeTab, setActiveTab] = useState<
    | "Inbound Referrals"
    | "External Diagnostic Vouchers"
    | "Partner Diagnostic Centers"
    | "B2B Revenue Clearinghouse"
    | "Ethics & Analytics"
  >("Inbound Referrals");

  // Core Data States
  const [inboundReferrals, setInboundReferrals] = useState<InboundReferral[]>([]);
  const [externalCenters, setExternalCenters] = useState<ExternalDiagnosticCenter[]>(MOCK_EXTERNAL_DIAGNOSTIC_CENTRES);
  const [externalOrders, setExternalOrders] = useState<ExternalDiagnosticOrder[]>([]);
  const [settlements, setSettlements] = useState<DiagnosticSettlement[]>([]);
  const [activePatients, setActivePatients] = useState<Patient[]>([]);

  // Navigation Modals
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);

  // Referral Action Modals
  const [isNewInboundModalOpen, setIsNewInboundModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // Printable Slips Modals
  const [selectedAcknowledgmentReferral, setSelectedAcknowledgmentReferral] = useState<InboundReferral | null>(null);
  const [selectedPrintOrder, setSelectedPrintOrder] = useState<ExternalDiagnosticOrder | null>(null);
  const [selectedPrintCenter, setSelectedPrintCenter] = useState<ExternalDiagnosticCenter | null>(null);

  // Hydrate local records from IndexedDB and cloud patients
  useEffect(() => {
    async function hydrate() {
      // 1. Load active patients for dropdown
      const pts: Patient[] = [];
      try {
        const localPts = await getAllLocalRecords<Patient>("patients");
        if (localPts) pts.push(...localPts);
      } catch {}

      try {
        if (supabase) {
          const { data: cloud } = await supabase.from("patients").select("*, opd_tokens(*)").limit(20);
          if (cloud) {
            cloud.forEach((cp, idx) => {
              if (!pts.some((p) => p.mrId === cp.mr_id || p.uhid === cp.mr_id)) {
                pts.push({
                  id: cp.id,
                  mrId: cp.mr_id,
                  uhid: cp.mr_id,
                  opIpId: `OP-${40180 + idx}`,
                  type: "OP",
                  name: cp.name,
                  initials: "PT",
                  age: cp.age || 30,
                  gender: cp.gender || "M",
                  phone: cp.phone,
                  department: "General Medicine",
                  attendingDoctor: "Dr. Rao",
                  admissionDate: "Today",
                  status: "Active",
                });
              }
            });
          }
        }
      } catch {}

      if (pts.length > 0) setActivePatients(pts);

      // 2. Load offline referrals if any
      let localReferrals: InboundReferral[] = [];
      try {
        const lr = await getAllLocalRecords<InboundReferral>("inbound_referrals");
        if (lr && lr.length > 0) localReferrals = lr;
      } catch {}

      // 3. Load offline external orders if any
      let localOrders: ExternalDiagnosticOrder[] = [];
      try {
        const lo = await getAllLocalRecords<ExternalDiagnosticOrder>("external_diagnostic_orders");
        if (lo && lo.length > 0) localOrders = lo;
      } catch {}

      const isClean = isCleanProductionMode();

      if (isClean) {
        // Clean production mode: only show real records
        setInboundReferrals(localReferrals);
        setExternalOrders(localOrders);
        setSettlements([]);
      } else {
        // Demo sandbox mode: combine mock templates with local records
        const baseReferrals = [...MOCK_INBOUND_REFERRALS];
        const existingRefIds = new Set(baseReferrals.map((r) => r.id));
        const refToAdd = localReferrals.filter((r) => !existingRefIds.has(r.id));
        setInboundReferrals([...refToAdd, ...baseReferrals]);

        const baseOrders = [...MOCK_EXTERNAL_DIAGNOSTIC_ORDERS];
        const existingOrdIds = new Set(baseOrders.map((o) => o.id));
        const ordToAdd = localOrders.filter((o) => !existingOrdIds.has(o.id));
        setExternalOrders([...ordToAdd, ...baseOrders]);

        setSettlements(MOCK_DIAGNOSTIC_SETTLEMENTS);
      }
    }

    hydrate();

    const handleReset = () => {
      hydrate();
    };

    window.addEventListener(EVENT_NAME_DATABASE_RESET, handleReset);
    return () => window.removeEventListener(EVENT_NAME_DATABASE_RESET, handleReset);
  }, []);

  // Update inbound status
  const handleUpdateInboundStatus = (id: string, newStatus: InboundReferralStatus) => {
    setInboundReferrals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updatedAudit = [
            ...r.auditTrail,
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toLocaleString("en-IN", {
                dateStyle: "short",
                timeStyle: "short",
              }),
              action: `Status changed to ${newStatus}`,
              performedBy: "Attending Doctor / Coordinator",
            },
          ];
          return { ...r, referralStatus: newStatus, auditTrail: updatedAudit };
        }
        return r;
      })
    );
  };

  // Update external order status
  const handleUpdateOrderStatus = (id: string, newStatus: ExternalOrderStatus) => {
    setExternalOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  // Open voucher print modal
  const handleOpenVoucherPrint = (order: ExternalDiagnosticOrder, center?: ExternalDiagnosticCenter) => {
    setSelectedPrintOrder(order);
    setSelectedPrintCenter(center || externalCenters.find((c) => c.id === order.destinationCenterId) || null);
  };

  // Open acknowledgment letter print modal
  const handleOpenAcknowledgmentPrint = (referral: InboundReferral) => {
    setSelectedAcknowledgmentReferral(referral);
  };

  // Create new inbound referral
  const handleInboundReferralCreated = (newRef: InboundReferral) => {
    setInboundReferrals((prev) => [newRef, ...prev]);
    setIsNewInboundModalOpen(false);
    setSelectedAcknowledgmentReferral(newRef); // Auto preview letter
  };

  // Create new external order
  const handleOrderCreated = (newOrd: ExternalDiagnosticOrder) => {
    setExternalOrders((prev) => [newOrd, ...prev]);
    setIsNewOrderModalOpen(false);
    handleOpenVoucherPrint(newOrd); // Auto preview voucher
  };

  // Add new diagnostic center
  const handleAddCenter = (newCenter: ExternalDiagnosticCenter) => {
    setExternalCenters((prev) => [...prev, newCenter]);
  };

  // Record settlement
  const handleRecordSettlement = (newSettle: DiagnosticSettlement) => {
    setSettlements((prev) => [newSettle, ...prev]);
  };

  const tabs: {
    name: typeof activeTab;
    icon: any;
    badge?: string | number;
  }[] = [
    {
      name: "Inbound Referrals",
      icon: Share2,
      badge: inboundReferrals.length,
    },
    {
      name: "External Diagnostic Vouchers",
      icon: Barcode,
      badge: externalOrders.length,
    },
    {
      name: "Partner Diagnostic Centers",
      icon: Building2,
      badge: externalCenters.length,
    },
    {
      name: "B2B Revenue Clearinghouse",
      icon: DollarSign,
      badge: `₹${(settlements.reduce((s, item) => s + item.amountPaidOrReceived, 0) / 1000).toFixed(0)}k`,
    },
    {
      name: "Ethics & Analytics",
      icon: BarChart3,
    },
  ];

  if (!canAccessRoute("/referrals")) {
    return <AccessDeniedGuard moduleName="Referrals & External Diagnostics" />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header
        activeNav="Referrals"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-6">
        {/* Module Title Banner */}
        <div className="bg-gradient-to-r from-[#0c1322] via-[#111a2e] to-[#0c1322] rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Phase 2 Enterprise Healthcare Ecosystem
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                Referral Management & Partner Diagnostics
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Track inbound doctor referrals with NMC-compliant clinical acknowledgment letters, and manage external diagnostic center tie-ups (MRI, CT, PET, Advanced Biopsy) with barcoded referral vouchers and automated B2B revenue-share reconciliation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsNewInboundModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-teal-400" />
                Log Inbound Patient
              </button>

              <button
                onClick={() => setIsNewOrderModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <Barcode className="w-4 h-4" />
                Issue Diagnostic Voucher
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.name}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        {activeTab === "Inbound Referrals" && (
          <InboundReferralsTab
            referrals={inboundReferrals}
            onOpenNewModal={() => setIsNewInboundModalOpen(true)}
            onOpenPrintModal={handleOpenAcknowledgmentPrint}
            onUpdateStatus={handleUpdateInboundStatus}
          />
        )}

        {activeTab === "External Diagnostic Vouchers" && (
          <ExternalDiagnosticVouchersTab
            orders={externalOrders}
            centers={externalCenters}
            onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
            onOpenPrintModal={handleOpenVoucherPrint}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === "Partner Diagnostic Centers" && (
          <DiagnosticCentersDirectoryTab
            centers={externalCenters}
            onAddCenter={handleAddCenter}
          />
        )}

        {activeTab === "B2B Revenue Clearinghouse" && (
          <B2bSettlementClearinghouseTab
            settlements={settlements}
            orders={externalOrders}
            centers={externalCenters}
            onRecordSettlement={handleRecordSettlement}
          />
        )}

        {activeTab === "Ethics & Analytics" && (
          <ReferralAnalyticsTab
            inboundReferrals={inboundReferrals}
            externalOrders={externalOrders}
            centers={externalCenters}
          />
        )}
      </main>

      {/* Global & Navigation Modals */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={() => setIsQuickMenuOpen(false)}
      />
      <CreateOpModal
        isOpen={isNewOpModalOpen}
        onClose={() => setIsNewOpModalOpen(false)}
        onSuccess={() => setIsNewOpModalOpen(false)}
      />
      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={() => setIsNewIpModalOpen(false)}
      />

      {/* Action Modals */}
      <NewInboundReferralModal
        isOpen={isNewInboundModalOpen}
        onClose={() => setIsNewInboundModalOpen(false)}
        onReferralCreated={handleInboundReferralCreated}
      />
      <NewExternalDiagnosticOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        centers={externalCenters}
        activePatients={activePatients}
        onOrderCreated={handleOrderCreated}
      />

      {/* Printable Modals */}
      <PrintReferralAcknowledgmentModal
        isOpen={!!selectedAcknowledgmentReferral}
        onClose={() => setSelectedAcknowledgmentReferral(null)}
        referral={selectedAcknowledgmentReferral}
      />
      <PrintExternalVoucherModal
        isOpen={!!selectedPrintOrder}
        onClose={() => setSelectedPrintOrder(null)}
        order={selectedPrintOrder}
        center={selectedPrintCenter}
      />
    </div>
  );
}
