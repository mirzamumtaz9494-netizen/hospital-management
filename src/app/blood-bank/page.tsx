"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Droplet,
  Users,
  AlertTriangle,
  Clock,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRightLeft,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { BloodStockTab } from "@/components/bloodbank/BloodStockTab";
import { DonorRegistryTab } from "@/components/bloodbank/DonorRegistryTab";
import { BloodRequisitionsTab } from "@/components/bloodbank/BloodRequisitionsTab";
import { RegisterDonorModal } from "@/components/bloodbank/RegisterDonorModal";
import { IssueBloodModal } from "@/components/bloodbank/IssueBloodModal";
import {
  MOCK_BLOOD_METRICS,
  MOCK_BLOOD_BAGS,
  MOCK_BLOOD_DONORS,
  MOCK_BLOOD_REQUISITIONS,
} from "@/data/bloodBankMockData";
import { BloodInventoryUnit, BloodDonor, BloodRequisition, BloodGroup } from "@/types";
import { useRole } from "@/context/RoleContext";
import { useTenant } from "@/context/TenantContext";
import { UnlicensedModuleGuard } from "@/components/UnlicensedModuleGuard";

export default function BloodBankPage() {
  const { currentRole, canAccessAction } = useRole();
  const { isModuleLicensed } = useTenant();
  const [activeTab, setActiveTab] = useState<
    "Stock & Inventory" | "Donor Registry" | "Requisitions & Crossmatch"
  >("Stock & Inventory");

  const [bags, setBags] = useState<BloodInventoryUnit[]>(MOCK_BLOOD_BAGS);
  const [donors, setDonors] = useState<BloodDonor[]>(MOCK_BLOOD_DONORS);
  const [requisitions, setRequisitions] = useState<BloodRequisition[]>(MOCK_BLOOD_REQUISITIONS);

  // Modals
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedReqForIssue, setSelectedReqForIssue] = useState<BloodRequisition | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Reserve Bag
  const handleReserveBag = (bagId: string) => {
    setBags((prev) =>
      prev.map((b) =>
        b.id === bagId
          ? {
              ...b,
              status: "Reserved",
              crossmatchedPatient: "Inpatient OT Hold",
              crossmatchedIpNo: "IP-HOLD",
            }
          : b
      )
    );
    showToast("Blood unit reserved for patient requisition!");
  };

  // 2. Register Donor
  const handleRegisterDonor = (newDonor: BloodDonor) => {
    setDonors((prev) => [newDonor, ...prev]);
    showToast(`Donor ${newDonor.name} (${newDonor.bloodGroup}) registered successfully!`);
  };

  // 3. Emergency Callout
  const handleEmergencyCallout = (group: BloodGroup) => {
    const matchingDonors = donors.filter((d) => d.bloodGroup === group && d.status === "Eligible");
    showToast(`🚨 Emergency SMS broadcast dispatched to ${matchingDonors.length} eligible ${group} donors!`);
  };

  // 4. Run Crossmatch
  const handleRunCrossmatch = (reqId: string) => {
    setRequisitions((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "Crossmatch Compatible",
            }
          : r
      )
    );
    showToast("Major & minor crossmatch test passed! Unit 100% compatible.");
  };

  // 5. Open Issue Modal
  const handleOpenIssueModal = (req: BloodRequisition) => {
    setSelectedReqForIssue(req);
    setIssueModalOpen(true);
  };

  // 6. Confirm Issue
  const handleConfirmIssue = (reqId: string, bagBarcode: string, nurseStaff: string) => {
    setRequisitions((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "Issued to OT",
            }
          : r
      )
    );
    setBags((prev) =>
      prev.map((b) =>
        b.bagBarcode === bagBarcode
          ? {
              ...b,
              status: "Transfused",
            }
          : b
      )
    );
    showToast(`Unit ${bagBarcode} verified & dispatched to OT by ${nurseStaff}!`);
  };

  // 7. Print Issue Voucher
  const handlePrintIssueVoucher = (req: BloodRequisition) => {
    window.print();
  };

  if (!isModuleLicensed("blood_bank")) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
        <Header
          onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
          activeNav="Blood Bank"
        />
        <UnlicensedModuleGuard
          moduleName="Blood Bank & Donor Registry"
          moduleKey="blood_bank"
        />
        <QuickMenuModal
          isOpen={isQuickMenuOpen}
          onClose={() => setIsQuickMenuOpen(false)}
          onActionSelect={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeNav="Blood Bank"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Breadcrumb & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <Link href="/" className="hover:text-slate-600">Home</Link>
              <span>/</span>
              <span className="text-rose-600 font-semibold">Blood Bank &amp; Donor Operating Desk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                <Droplet className="w-4 h-4 fill-white" />
              </div>
              Blood Bank &amp; Transfusion Services
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Donor Check-in
            </button>
          </div>
        </div>

        {/* 5 Top High-Density Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="text-slate-500 text-xs font-medium mb-1">Total Units In Stock</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {bags.filter((b) => b.status === "Available" || b.status === "Reserved").length}
            </div>
            <span className="text-[10px] text-teal-600 font-semibold">38 Available Across 8 Groups</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-rose-200/80 shadow-2xs bg-rose-50/20">
            <div className="text-rose-700 text-xs font-bold mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Critical Shortage
            </div>
            <div className="text-2xl font-black text-rose-600 tracking-tight">
              O- &amp; AB-
            </div>
            <span className="text-[10px] text-rose-600 font-bold">Only 1 unit remaining</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="text-slate-500 text-xs font-medium mb-1">Registered Donors</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {donors.length}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {donors.filter((d) => d.status === "Eligible").length} Eligible Today
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="text-slate-500 text-xs font-medium mb-1">Expiring in 7 Days</div>
            <div className="text-2xl font-black text-amber-700 tracking-tight">
              {bags.filter((b) => b.daysRemaining <= 7).length}
            </div>
            <span className="text-[10px] text-amber-600 font-semibold">Priority issue required</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="text-slate-500 text-xs font-medium mb-1">Active OT Requisitions</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {requisitions.length}
            </div>
            <span className="text-[10px] text-rose-600 font-semibold">2 STAT Emergency Requests</span>
          </div>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          {[
            { id: "Stock & Inventory", label: "Blood Stock & Bag Inventory" },
            { id: "Donor Registry", label: "Voluntary Donor Registry" },
            { id: "Requisitions & Crossmatch", label: "OT & Inpatient Requisitions" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                  isActive
                    ? "border-rose-600 text-rose-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        {activeTab === "Stock & Inventory" && (
          <BloodStockTab bags={bags} onReserveBag={handleReserveBag} />
        )}
        {activeTab === "Donor Registry" && (
          <DonorRegistryTab
            donors={donors}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onEmergencyCallout={handleEmergencyCallout}
          />
        )}
        {activeTab === "Requisitions & Crossmatch" && (
          <BloodRequisitionsTab
            requisitions={requisitions}
            onRunCrossmatch={handleRunCrossmatch}
            onOpenIssueModal={handleOpenIssueModal}
            onPrintIssueVoucher={handlePrintIssueVoucher}
          />
        )}
      </main>

      {/* Modals */}
      <RegisterDonorModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterDonor}
      />

      <IssueBloodModal
        isOpen={issueModalOpen}
        requisition={selectedReqForIssue}
        onClose={() => {
          setIssueModalOpen(false);
          setSelectedReqForIssue(null);
        }}
        onConfirmIssue={handleConfirmIssue}
      />

      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={(actionId) => {
          setIsQuickMenuOpen(false);
          showToast(`Action selected: ${actionId}`);
        }}
      />
    </div>
  );
}
