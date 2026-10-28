"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bed,
  Plus,
  ArrowRightLeft,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  Printer,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { PrintSlipModal } from "@/components/PrintSlipModal";
import { IpdBedMapTab } from "@/components/ipd/IpdBedMapTab";
import { IpdAdmissionsTab } from "@/components/ipd/IpdAdmissionsTab";
import { IpdTransfersTab } from "@/components/ipd/IpdTransfersTab";
import { IpdBillingTab } from "@/components/ipd/IpdBillingTab";
import { BedTransferModal } from "@/components/ipd/BedTransferModal";
import { DischargePatientModal } from "@/components/ipd/DischargePatientModal";
import { PrintCertificatesModal } from "@/components/ipd/PrintCertificatesModal";
import { useRole } from "@/context/RoleContext";
import { useTenant } from "@/context/TenantContext";
import { UnlicensedModuleGuard } from "@/components/UnlicensedModuleGuard";
import {
  IpdBed,
  ActiveAdmission,
  DischargedPatient,
  BedTransferRecord,
  IpBillDetail,
  Patient,
  DischargeOutcome,
} from "@/types";
import {
  MOCK_IPD_METRICS,
  MOCK_IPD_BEDS,
  MOCK_ACTIVE_ADMISSIONS,
  MOCK_DISCHARGED_PATIENTS,
  MOCK_BED_TRANSFERS,
  MOCK_IP_BILLS,
} from "@/data/ipdMockData";

export default function InpatientPage() {
  const { canAccessAction, currentRole } = useRole();
  const { isModuleLicensed } = useTenant();
  const [activeTab, setActiveTab] = useState<
    "Bed Map" | "Admissions" | "Transfers" | "IP Billing"
  >("Bed Map");

  // State for all data
  const [beds, setBeds] = useState<IpdBed[]>(MOCK_IPD_BEDS);
  const [admissions, setAdmissions] = useState<ActiveAdmission[]>(MOCK_ACTIVE_ADMISSIONS);
  const [discharged, setDischarged] = useState<DischargedPatient[]>(MOCK_DISCHARGED_PATIENTS);
  const [transfers, setTransfers] = useState<BedTransferRecord[]>(MOCK_BED_TRANSFERS);
  const [bills, setBills] = useState<IpBillDetail[]>(MOCK_IP_BILLS);

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [slipPatient, setSlipPatient] = useState<Patient | null>(null);

  // Transfer modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferPatient, setTransferPatient] = useState<ActiveAdmission | null>(null);

  // Discharge modal
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [dischargePatient, setDischargePatient] = useState<ActiveAdmission | null>(null);

  // Certificates modal
  const [certificatesModalOpen, setCertificatesModalOpen] = useState(false);
  const [selectedCertPatient, setSelectedCertPatient] = useState<ActiveAdmission | DischargedPatient | null>(null);
  const [initialCertType, setInitialCertType] = useState<string>("Discharge Summary");

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Handle New IP Admission
  const handleCreateIpSuccess = (newPatient: Patient) => {
    const newIpNo = newPatient.opIpId || `IP-${Math.floor(22045 + Math.random() * 50)}`;
    const newAdmission: ActiveAdmission = {
      id: `adm-${Date.now()}`,
      ipNo: newIpNo,
      mrId: newPatient.mrId,
      name: newPatient.name,
      initials: newPatient.initials,
      age: newPatient.age,
      gender: newPatient.gender,
      phone: newPatient.phone,
      wardBed: newPatient.bedNumber || "GEN-14",
      wardName: newPatient.wardName || "General Ward",
      bedNumber: newPatient.bedNumber || "GEN-14",
      diagnosis: newPatient.diagnosis || "Acute Admission",
      attendingDoctor: newPatient.attendingDoctor,
      admittedOn: "Today, Just now",
      days: 0,
      status: "Stable",
      billSoFar: newPatient.advancePaid || 10000,
      advancePaid: newPatient.advancePaid || 10000,
    };

    setAdmissions((prev) => [newAdmission, ...prev]);

    // Update bed map if bedNumber matches
    const targetBed = newAdmission.bedNumber;
    setBeds((prev) =>
      prev.map((b) =>
        b.bedNumber.toLowerCase() === targetBed.toLowerCase()
          ? {
              ...b,
              status: "Occupied",
              patientName: newAdmission.name,
              patientInitials: newAdmission.initials,
              mrId: newAdmission.mrId,
              doctor: newAdmission.attendingDoctor,
              ipNo: newAdmission.ipNo,
              admittedDate: "Today",
              dayCount: 0,
            }
          : b
      )
    );

    // Add initial bill record
    const newBill: IpBillDetail = {
      id: `ipb-${Date.now()}`,
      billNo: `IPB-${Math.floor(9910 + Math.random() * 50)}`,
      ipNo: newAdmission.ipNo,
      mrId: newAdmission.mrId,
      patientName: newAdmission.name,
      initials: newAdmission.initials,
      wardBed: newAdmission.wardBed,
      doctor: newAdmission.attendingDoctor,
      admissionDate: "Today",
      daysStayed: 0,
      bedCharges: 2500,
      nursingCharges: 1000,
      doctorRoundsFee: 1500,
      surgeryOtCharges: 0,
      labCharges: 2500,
      pharmacyCharges: 2500,
      totalBill: 10000,
      advancePaid: newAdmission.advancePaid,
      discount: 0,
      netPayable: 10000,
      balanceDue: 0,
      status: "Settled",
      settlementMode: "Admission Advance",
    };
    setBills((prev) => [newBill, ...prev]);

    setIsNewIpModalOpen(false);
    setSlipPatient(newPatient);
    showToast(`Admission confirmed for ${newPatient.name} in ${newAdmission.wardBed}!`);
  };

  // 2. Handle Bed Transfer Initiate from Bed Map or Tab
  const handleOpenTransferModal = (admissionOrBed?: ActiveAdmission | IpdBed) => {
    if (!admissionOrBed) {
      // Pick first admission as fallback
      setTransferPatient(admissions[0] || null);
    } else if ("ipNo" in admissionOrBed && "wardName" in admissionOrBed) {
      setTransferPatient(admissionOrBed as ActiveAdmission);
    } else {
      // It's an IpdBed
      const found = admissions.find((a) => a.bedNumber === admissionOrBed.bedNumber);
      if (found) {
        setTransferPatient(found);
      } else {
        // Construct dummy admission for that bed
        setTransferPatient({
          id: `adm-temp`,
          ipNo: admissionOrBed.ipNo || "IP-22000",
          mrId: admissionOrBed.mrId || "MR-10000",
          name: admissionOrBed.patientName || "Patient",
          initials: admissionOrBed.patientInitials || "PT",
          age: admissionOrBed.patientAge || 45,
          gender: admissionOrBed.patientGender || "M",
          phone: "9876543210",
          wardBed: admissionOrBed.bedNumber,
          wardName: admissionOrBed.ward,
          bedNumber: admissionOrBed.bedNumber,
          diagnosis: "Under Inpatient Care",
          attendingDoctor: admissionOrBed.doctor || "Duty Doctor",
          admittedOn: admissionOrBed.admittedDate || "Recent",
          days: admissionOrBed.dayCount || 1,
          status: "Stable",
          billSoFar: 25000,
          advancePaid: 15000,
        });
      }
    }
    setTransferModalOpen(true);
  };

  // 3. Confirm Bed Transfer
  const handleConfirmTransfer = (data: {
    ipNo: string;
    fromWard: string;
    fromBed: string;
    toWard: string;
    toBed: string;
    reason: string;
  }) => {
    const newTransfer: BedTransferRecord = {
      id: `tr-${Date.now()}`,
      transferId: `TR-${Math.floor(405 + Math.random() * 50)}`,
      ipNo: data.ipNo,
      mrId: transferPatient?.mrId || "MR-10246",
      patientName: transferPatient?.name || "Patient",
      fromWard: data.fromWard,
      fromBed: data.fromBed,
      toWard: data.toWard,
      toBed: data.toBed,
      transferDate: "Today",
      transferTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      doctor: transferPatient?.attendingDoctor || "Attending Physician",
      authorizedBy: "Duty Nurse Supervisor",
      reason: data.reason,
    };

    setTransfers((prev) => [newTransfer, ...prev]);

    // Update beds: old bed becomes Cleaning, new bed becomes Occupied
    setBeds((prev) =>
      prev.map((b) => {
        if (b.bedNumber.toLowerCase() === data.fromBed.toLowerCase()) {
          return {
            ...b,
            status: "Cleaning",
            patientName: undefined,
            patientInitials: undefined,
            mrId: undefined,
            doctor: undefined,
          };
        }
        if (b.bedNumber.toLowerCase() === data.toBed.toLowerCase()) {
          return {
            ...b,
            status: "Occupied",
            patientName: transferPatient?.name,
            patientInitials: transferPatient?.initials,
            mrId: transferPatient?.mrId,
            doctor: transferPatient?.attendingDoctor,
          };
        }
        return b;
      })
    );

    // Update admissions wardBed
    setAdmissions((prev) =>
      prev.map((a) =>
        a.ipNo === data.ipNo
          ? {
              ...a,
              wardBed: data.toBed,
              bedNumber: data.toBed,
              wardName: data.toWard,
            }
          : a
      )
    );

    setTransferModalOpen(false);
    showToast(`Bed transfer recorded: ${data.fromBed} → ${data.toBed}`);
  };

  // 4. Open Discharge Modal
  const handleOpenDischargeModal = (admission: ActiveAdmission) => {
    setDischargePatient(admission);
    setDischargeModalOpen(true);
  };

  // 5. Confirm Patient Discharge
  const handleConfirmDischarge = (data: {
    admission: ActiveAdmission;
    outcome: DischargeOutcome;
    dischargeNotes: string;
    finalBill: number;
    settlementMode: string;
  }) => {
    const adm = data.admission;
    const dischargedRecord: DischargedPatient = {
      id: `dis-${Date.now()}`,
      ipNo: adm.ipNo,
      mrId: adm.mrId,
      name: adm.name,
      initials: adm.initials,
      age: adm.age,
      gender: adm.gender,
      phone: adm.phone,
      diagnosis: adm.diagnosis,
      attendingDoctor: adm.attendingDoctor,
      admittedDate: adm.admittedOn,
      dischargedDate: "Today",
      stayDays: Math.max(1, adm.days),
      outcome: data.outcome,
      finalBill: data.finalBill,
      advancePaid: data.finalBill,
      paymentStatus: "Paid",
      settlementMode: data.settlementMode,
      dischargeNotes: data.dischargeNotes,
    };

    // Remove from active admissions
    setAdmissions((prev) => prev.filter((a) => a.id !== adm.id));

    // Add to discharged
    setDischarged((prev) => [dischargedRecord, ...prev]);

    // Mark bed as Cleaning
    setBeds((prev) =>
      prev.map((b) =>
        b.bedNumber.toLowerCase() === adm.bedNumber.toLowerCase()
          ? {
              ...b,
              status: "Cleaning",
              patientName: undefined,
              patientInitials: undefined,
              mrId: undefined,
              doctor: undefined,
            }
          : b
      )
    );

    // Update IP bill to Settled
    setBills((prev) =>
      prev.map((bill) =>
        bill.ipNo === adm.ipNo
          ? {
              ...bill,
              advancePaid: data.finalBill,
              balanceDue: 0,
              status: "Settled",
              settlementMode: `${data.settlementMode} on Discharge`,
            }
          : bill
      )
    );

    setDischargeModalOpen(false);
    showToast(`${adm.name} successfully discharged (${data.outcome}). Opening Summary...`);

    // Automatically open the Discharge Summary certificate
    setSelectedCertPatient(dischargedRecord);
    setInitialCertType("Discharge Summary");
    setCertificatesModalOpen(true);
  };

  // 6. Open Certificates Modal
  const handleOpenCertificates = (
    patient: ActiveAdmission | DischargedPatient,
    certType: string = "Discharge Summary"
  ) => {
    setSelectedCertPatient(patient);
    setInitialCertType(certType);
    setCertificatesModalOpen(true);
  };

  // 7. Settle Bill directly from Billing tab
  const handleSettleBill = (bill: IpBillDetail) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === bill.id
          ? {
              ...b,
              advancePaid: b.netPayable,
              balanceDue: 0,
              status: "Settled",
              settlementMode: "Desk Cash Settlement",
            }
          : b
      )
    );
    showToast(`Bill #${bill.billNo} settled successfully!`);
  };

  // 8. Select Bed Patient from Bed Map view
  const handleSelectBedPatient = (bed: IpdBed) => {
    const admission = admissions.find((a) => a.bedNumber === bed.bedNumber);
    if (admission) {
      setActiveTab("Admissions");
    } else {
      showToast(`Selected Bed ${bed.bedNumber} (${bed.status})`);
    }
  };

  const handleQuickAction = (actionId: string) => {
    setIsQuickMenuOpen(false);
    switch (actionId) {
      case "create_op":
        setIsNewOpModalOpen(true);
        break;
      case "create_ip":
        setIsNewIpModalOpen(true);
        break;
      case "emergency_services":
        showToast("Emergency Triage mode: navigating to Bed Map");
        setActiveTab("Bed Map");
        break;
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

  if (!isModuleLicensed("ipd")) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
        <Header
          activeNav="IPD"
          onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
        />
        <UnlicensedModuleGuard
          moduleName="Inpatient Wards & 20-50 Beds Tracker (IPD)"
          moduleKey="ipd"
        />
        <QuickMenuModal
          isOpen={isQuickMenuOpen}
          onClose={() => setIsQuickMenuOpen(false)}
          onActionSelect={handleQuickAction}
        />
      </div>
    );
  }

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
        activeNav="IPD"
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
              <span className="text-teal-700 font-bold">Inpatient (IPD)</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Inpatient & Bed Management
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mr-1.5 animate-pulse"></span>
                78% Occupancy
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time bed occupancy, admissions tracking, transfers, and medical certificates
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export
            </button>

            <button
              onClick={() => handleOpenTransferModal()}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-teal-800" />
              Transfer Bed
            </button>

            {canAccessAction("create_ip") && (
              <button
                onClick={() => setIsNewIpModalOpen(true)}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-teal-800/20 transition flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Admission</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill Bar Filtered by Role */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 mb-5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: "Bed Map", label: "Bed Map", badge: "234/300", roles: ["cmo", "receptionist", "doctor", "nurse"] },
              {
                id: "Admissions",
                label: "Admissions",
                badge: `${admissions.length} Active`,
                roles: ["cmo", "receptionist", "doctor", "nurse", "cashier"],
              },
              {
                id: "Transfers",
                label: "Transfers",
                badge: `${transfers.length}`,
                roles: ["cmo", "receptionist", "doctor", "nurse", "cashier"],
              },
              {
                id: "IP Billing",
                label: "IP Billing",
                badge: `${bills.filter((b) => b.balanceDue > 0).length} Due`,
                roles: ["cmo", "receptionist", "cashier"],
              },
            ] as const
          )
            .filter((tab) => tab.roles.includes(currentRole as any))
            .map((tab) => {
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
          {activeTab === "Bed Map" && (
            <IpdBedMapTab
              beds={beds}
              onSelectBedPatient={handleSelectBedPatient}
              onTransferBed={handleOpenTransferModal}
            />
          )}

          {activeTab === "Admissions" && (
            <IpdAdmissionsTab
              activeAdmissions={admissions}
              dischargedPatients={discharged}
              onViewPatient={(patient) => {
                handleOpenCertificates(patient, "Discharge Summary");
              }}
              onTransferBed={(adm) => handleOpenTransferModal(adm)}
              onDischargePatient={(adm) => handleOpenDischargeModal(adm)}
              onOpenCertificates={(patient, certType) =>
                handleOpenCertificates(patient, certType)
              }
            />
          )}

          {activeTab === "Transfers" && (
            <IpdTransfersTab
              transfers={transfers}
              onInitiateTransfer={() => handleOpenTransferModal()}
            />
          )}

          {activeTab === "IP Billing" && (
            <IpdBillingTab
              bills={bills}
              onPrintFinalBill={(bill) => {
                // Find matching admission or discharged patient
                const patient =
                  admissions.find((a) => a.ipNo === bill.ipNo) ||
                  discharged.find((d) => d.ipNo === bill.ipNo);
                if (patient) {
                  handleOpenCertificates(patient, "Final Consolidated Bill");
                } else {
                  showToast(`Generating Consolidated Bill for ${bill.patientName}`);
                }
              }}
              onSettleBill={handleSettleBill}
            />
          )}
        </div>
      </main>

      {/* Quick Menu Shortcut Modal (Cmd+K / Search button) */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={handleQuickAction}
      />

      {/* Create New OP Modal */}
      <CreateOpModal
        isOpen={isNewOpModalOpen}
        onClose={() => setIsNewOpModalOpen(false)}
        onSuccess={(newPatient) => {
          setIsNewOpModalOpen(false);
          setSlipPatient(newPatient);
          showToast(`OP token generated for ${newPatient.name}!`);
        }}
      />

      {/* Create New IP Modal */}
      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={handleCreateIpSuccess}
      />

      {/* Admission Slip Print Preview */}
      <PrintSlipModal
        patient={slipPatient}
        onClose={() => setSlipPatient(null)}
      />

      {/* Bed Transfer Modal */}
      <BedTransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        admission={transferPatient}
        onConfirmTransfer={handleConfirmTransfer}
      />

      {/* Discharge Patient Modal */}
      <DischargePatientModal
        isOpen={dischargeModalOpen}
        onClose={() => setDischargeModalOpen(false)}
        admission={dischargePatient}
        onConfirmDischarge={handleConfirmDischarge}
      />

      {/* Print Certificates & Medical Documents Modal */}
      <PrintCertificatesModal
        patient={selectedCertPatient}
        initialCert={initialCertType}
        onClose={() => {
          setCertificatesModalOpen(false);
          setSelectedCertPatient(null);
        }}
      />
    </div>
  );
}
