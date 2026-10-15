"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  ShieldCheck,
  TrendingUp,
  Activity,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { useRole } from "@/context/RoleContext";
import { AccessDeniedGuard } from "@/components/AccessDeniedGuard";
import { FinancialReportsTab } from "@/components/reports/FinancialReportsTab";
import { ClinicalReportsTab } from "@/components/reports/ClinicalReportsTab";
import { LabAnalyticsTab } from "@/components/reports/LabAnalyticsTab";
import { PharmacyReportsTab } from "@/components/reports/PharmacyReportsTab";
import { SavedReportsTab } from "@/components/reports/SavedReportsTab";
import { PrintExecutiveReportModal } from "@/components/reports/PrintExecutiveReportModal";
import { ScheduleReportModal } from "@/components/reports/ScheduleReportModal";
import {
  SavedReportItem,
  DepartmentRevenueItem,
  HospitalCensusStats,
} from "@/types";
import {
  MOCK_REPORTS_METRICS,
  MOCK_DEPARTMENT_REVENUE,
  MOCK_SAVED_REPORTS,
  MOCK_CENSUS_TRENDS,
} from "@/data/reportsMockData";

export default function ReportsPage() {
  const { canAccessRoute } = useRole();
  const [activeTab, setActiveTab] = useState<
    | "Financial Analytics"
    | "Clinical & Operations"
    | "Laboratory (LIS)"
    | "Pharmacy & Stocks"
    | "Saved Reports"
  >("Financial Analytics");

  // State
  const [reports, setReports] = useState<SavedReportItem[]>(MOCK_SAVED_REPORTS);
  const [departmentRevenue, setDepartmentRevenue] = useState<DepartmentRevenueItem[]>(
    MOCK_DEPARTMENT_REVENUE
  );
  const [censusTrends, setCensusTrends] = useState<HospitalCensusStats[]>(
    MOCK_CENSUS_TRENDS
  );

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);

  // Executive MIS Print Modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [reportToPrint, setReportToPrint] = useState<SavedReportItem | null>(
    MOCK_SAVED_REPORTS[23] || MOCK_SAVED_REPORTS[0]
  );

  // Schedule Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleViewReport = (report: SavedReportItem) => {
    setReportToPrint(report);
    setPrintModalOpen(true);
  };

  const handleDownloadReport = (report: SavedReportItem) => {
    showToast(`Exporting ${report.title} (${report.format} • ${report.size})...`);
    setTimeout(() => {
      showToast(`Downloaded ${report.code}.${report.format.toLowerCase()}`);
    }, 1200);
  };

  const handleConfirmSchedule = (email: string, freq: string, format: string) => {
    setScheduleModalOpen(false);
    showToast(`Automated report schedule activated for ${email} (${freq})!`);
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
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

  if (!canAccessRoute("/reports")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
        <Header
          activeNav="Reports"
          onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
        />
        <AccessDeniedGuard
          moduleName="Hospital Analytics & Financial Reports"
          requiredRoles={[
            "Consultant Doctor",
            "Medical Director",
            "Chief Medical Officer (CMO)",
            "Super Administrator",
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
        activeNav="Reports"
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
              <span className="text-teal-700 font-bold">Reports &amp; Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Hospital Reports &amp; Executive MIS
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 mr-1" />
                NABH 5th Edition • Quality Assured
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated financial analytics, clinical census, NABH indicators, and 24 master hospital registers
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                showToast("Generating comprehensive hospital data export...");
                setTimeout(() => window.print(), 500);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export
            </button>

            <button
              onClick={() => setScheduleModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-800" />
              Schedule Delivery
            </button>

            <button
              onClick={() => {
                setReportToPrint(reports[23] || reports[0]);
                setPrintModalOpen(true);
              }}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-teal-800/20 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Executive MIS Print
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-5 overflow-x-auto no-scrollbar">
          {(
            [
              {
                id: "Financial Analytics",
                label: "Financial Analytics",
                badge: `₹${(MOCK_REPORTS_METRICS.todayTotalRevenue / 100000).toFixed(1)}L Today`,
              },
              {
                id: "Clinical & Operations",
                label: "Clinical & Operations",
                badge: `${MOCK_REPORTS_METRICS.occupancyRate}% Occ`,
              },
              {
                id: "Laboratory (LIS)",
                label: "Laboratory (LIS)",
                badge: `${MOCK_REPORTS_METRICS.labTestsToday} Tests`,
              },
              {
                id: "Pharmacy & Stocks",
                label: "Pharmacy & Stocks",
                badge: `₹1.2L Sales`,
              },
              {
                id: "Saved Reports",
                label: "Saved Reports Archive",
                badge: `${reports.length} Saved`,
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
          {activeTab === "Financial Analytics" && (
            <FinancialReportsTab
              departmentRevenue={departmentRevenue}
              onPrintSummary={() => {
                setReportToPrint(reports[1] || reports[0]);
                setPrintModalOpen(true);
              }}
            />
          )}

          {activeTab === "Clinical & Operations" && (
            <ClinicalReportsTab censusTrends={censusTrends} />
          )}

          {activeTab === "Laboratory (LIS)" && <LabAnalyticsTab />}

          {activeTab === "Pharmacy & Stocks" && <PharmacyReportsTab />}

          {activeTab === "Saved Reports" && (
            <SavedReportsTab
              reports={reports}
              onViewReport={handleViewReport}
              onDownloadReport={handleDownloadReport}
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

      {/* Print Executive Report Modal */}
      <PrintExecutiveReportModal
        isOpen={printModalOpen}
        report={reportToPrint}
        onClose={() => {
          setPrintModalOpen(false);
          setReportToPrint(null);
        }}
      />

      {/* Schedule Report Delivery Modal */}
      <ScheduleReportModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onConfirmSchedule={handleConfirmSchedule}
      />
    </div>
  );
}
