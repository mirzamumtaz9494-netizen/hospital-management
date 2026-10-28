"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  QrCode,
  CreditCard,
  Receipt,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { Patient } from "@/types";
import { useTenant } from "@/context/TenantContext";
import {
  createPatientQrPayload,
  generateQrCodeDataUrl,
  parsePatientQrPayload,
  generateUhid,
} from "@/lib/qrService";

interface PatientQrCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSelectPatient?: (uhid: string) => void;
}

export const PatientQrCardModal: React.FC<PatientQrCardModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSelectPatient,
}) => {
  const { currentTenant } = useTenant();
  const [activeTab, setActiveTab] = useState<"card" | "slip" | "scan">("card");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Scanner Simulator / Test state
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<any | null>(null);

  const uhid =
    patient?.uhid ||
    (patient?.mrId?.startsWith("UHID-")
      ? patient.mrId
      : `UHID-${currentTenant.tenantCode || "APEX"}-2026-${(
          patient?.mrId || "100234"
        ).replace(/\D/g, "")}`);

  useEffect(() => {
    if (patient) {
      const payload = createPatientQrPayload({
        uhid: uhid,
        tenantCode: currentTenant.tenantCode || "APEX",
      });
      generateQrCodeDataUrl(payload).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [patient, uhid, currentTenant.tenantCode]);

  if (!isOpen || !patient) return null;

  const handleCopyUhid = () => {
    navigator.clipboard.writeText(uhid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScanLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const decoded = parsePatientQrPayload(scanInput.trim());
    setScanResult(decoded);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Unique Patient QR Code &amp; Digital Identity
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  CR80 / 80mm
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tamper-evident QR identity for thermal prescription slips and patient smart cards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (No Print) */}
        <div className="px-5 pt-3 border-b border-slate-100 flex items-center justify-between bg-white no-print">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("card")}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
                activeTab === "card"
                  ? "border-teal-600 text-teal-700 bg-teal-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Patient Smart Card (CR80)
            </button>
            <button
              onClick={() => setActiveTab("slip")}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
                activeTab === "slip"
                  ? "border-teal-600 text-teal-700 bg-teal-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Thermal Token Slip (80mm)
            </button>
            <button
              onClick={() => setActiveTab("scan")}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
                activeTab === "scan"
                  ? "border-teal-600 text-teal-700 bg-teal-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              Scan / Test Scanner
            </button>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          {/* TAB 1: SMART CARD PREVIEW */}
          {activeTab === "card" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Standard CR80 Healthcare Card Format (85.6mm × 53.98mm)</span>
                <button
                  onClick={handleCopyUhid}
                  className="font-mono text-[11px] text-teal-700 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "UHID Copied!" : `Copy UHID: ${uhid}`}
                </button>
              </div>

              {/* Printable PVC Smart Card Container */}
              <div className="print-patient-card max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-5 shadow-xl border border-slate-700 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none"></div>

                {/* Card Top: Hospital Logo & Unit */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div>
                    <div className="text-[13px] font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                      {currentTenant.name}
                    </div>
                    <div className="text-[10px] text-teal-300/90 font-medium">
                      {currentTenant.unitName} • Digital Health Card
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                      VITALSYNC
                    </span>
                  </div>
                </div>

                {/* Card Body: QR Code + Details */}
                <div className="flex items-center gap-4">
                  {/* QR Code Container */}
                  <div className="bg-white p-1.5 rounded-xl shrink-0 shadow-md">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Patient UHID QR Code"
                        className="w-24 h-24 object-contain rounded-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-slate-400 text-[10px]">
                        Generating...
                      </div>
                    )}
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="font-mono text-[11px] font-bold text-teal-300 tracking-wide">
                      {uhid}
                    </div>
                    <div className="font-extrabold text-white text-base leading-snug truncate">
                      {patient.name}
                    </div>
                    <div className="text-xs text-slate-300">
                      {patient.age} Y • {patient.gender === "M" ? "Male" : "Female"}{" "}
                      {patient.bloodGroup ? `• Blood: ${patient.bloodGroup}` : ""}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <span>Ph:</span>
                      <span className="text-slate-200">{patient.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom / Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Emergency Helpline: 108</span>
                  <span className="font-mono text-[9px] text-teal-400">
                    Scan for OPD / Lab / Pharmacy
                  </span>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3 text-xs text-teal-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Zero Clinical Exposure:</span> The QR code only contains the secure UHID and tenant token. Medical diagnoses, lab test results, and billing dues are protected and never exposed in plain text on the card.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THERMAL RECEIPT SLIP PREVIEW */}
          {activeTab === "slip" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Format: 80mm Standard POS Thermal Receipt (ESC/POS Printer Ready)
              </div>

              {/* Printable Thermal Slip */}
              <div className="print-thermal-slip max-w-[320px] mx-auto bg-white p-5 border border-dashed border-slate-300 rounded-xl shadow-md font-mono text-xs text-slate-900 space-y-3">
                <div className="text-center border-b border-dashed border-slate-300 pb-2">
                  <div className="font-black text-sm uppercase tracking-tight">
                    {currentTenant.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentTenant.unitName}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    Ph: +91 040 2345 6789
                  </div>
                </div>

                <div className="text-center my-2">
                  <span className="inline-block border border-slate-900 px-3 py-0.5 text-xs font-bold uppercase">
                    OPD VISIT TOKEN
                  </span>
                  <div className="text-lg font-black mt-1">
                    {patient.opIpId || "OP-40192"}
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">UHID:</span>
                    <span className="font-bold">{uhid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-bold truncate max-w-[170px]">{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age / Sex:</span>
                    <span>{patient.age}Y / {patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-bold">{patient.attendingDoctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dept:</span>
                    <span>{patient.department}</span>
                  </div>
                </div>

                {/* Thermal QR */}
                <div className="flex flex-col items-center justify-center pt-1">
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="Thermal QR Code"
                      className="w-28 h-28 object-contain"
                    />
                  )}
                  <span className="text-[9px] text-slate-500 mt-1">
                    Scan for Triage &amp; Prescriptions
                  </span>
                </div>

                <div className="text-center text-[9px] text-slate-400 border-t border-dashed border-slate-300 pt-2">
                  Generated {new Date().toLocaleDateString("en-IN")} {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCAN TEST & LOOKUP */}
          {activeTab === "scan" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Scan className="w-4 h-4 text-teal-600" />
                  USB 2D Barcode Scanner / Webhook Emulation
                </div>
                <p className="text-xs text-slate-500">
                  Hardware laser and camera 2D QR scanners deliver scanned text into this input. You can also paste raw QR text or UHID directly.
                </p>

                <form onSubmit={handleScanLookup} className="flex gap-2">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder={`e.g. ${uhid} or {"uhid":"${uhid}"...}`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    Test Scan
                  </button>
                </form>

                {/* Quick Fill Button */}
                <button
                  type="button"
                  onClick={() => {
                    const payload = createPatientQrPayload({
                      uhid,
                      tenantCode: currentTenant.tenantCode || "APEX",
                    });
                    setScanInput(payload);
                  }}
                  className="text-xs text-teal-700 font-medium hover:underline flex items-center gap-1"
                >
                  Fill current patient payload to test
                </button>
              </div>

              {/* Scan Results Output */}
              {scanResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 animate-in fade-in space-y-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Valid Patient QR Code Decoded Successfully!
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-emerald-100 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">
                        Decoded UHID
                      </span>
                      <span className="font-bold text-slate-900">{scanResult.uhid}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">
                        Tenant Unit
                      </span>
                      <span className="font-bold text-slate-900">
                        {scanResult.tenantCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">
                        Payload Checksum
                      </span>
                      <span className="font-bold text-emerald-700">
                        {scanResult.chk || "VALID"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">
                        Version
                      </span>
                      <span className="font-bold text-slate-700">
                        v{scanResult.version || 1}
                      </span>
                    </div>
                  </div>

                  {onSelectPatient && (
                    <button
                      onClick={() => {
                        onSelectPatient(scanResult.uhid);
                        onClose();
                      }}
                      className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                    >
                      Confirm &amp; Load Patient Record
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500 no-print">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>Active Hospital:</span>
            <span className="font-bold text-slate-800">{currentTenant.name}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
