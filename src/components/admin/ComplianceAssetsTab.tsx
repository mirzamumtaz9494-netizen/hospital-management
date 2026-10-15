"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Cpu,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  Wrench,
  CheckCircle2,
  Building,
  RefreshCw,
} from "lucide-react";
import { StatutoryLicenseItem, BiomedicalAssetItem } from "@/types";

interface ComplianceAssetsTabProps {
  licenses: StatutoryLicenseItem[];
  assets: BiomedicalAssetItem[];
  onDownloadLicense: (lic: StatutoryLicenseItem) => void;
  onInitiateRenewal: (lic: StatutoryLicenseItem) => void;
  onLogAssetService: (asset: BiomedicalAssetItem) => void;
}

export const ComplianceAssetsTab: React.FC<ComplianceAssetsTabProps> = ({
  licenses,
  assets,
  onDownloadLicense,
  onInitiateRenewal,
  onLogAssetService,
}) => {
  const [subSection, setSubSection] = useState<"licenses" | "biomedical">(
    "licenses"
  );

  const expiringLicensesCount = licenses.filter(
    (l) => l.status === "Expiring Soon"
  ).length;

  const maintenanceDueAssetsCount = assets.filter(
    (a) => a.status !== "Operational"
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. Sub-Section Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubSection("licenses")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subSection === "licenses"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Statutory &amp; Regulatory Licenses ({licenses.length})
            {expiringLicensesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          <button
            onClick={() => setSubSection("biomedical")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subSection === "biomedical"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            Biomedical Equipment Register ({assets.length})
            {maintenanceDueAssetsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>

        <span className="text-xs text-slate-400 font-semibold hidden md:inline">
          NABH Standard: FMS.4 &amp; FMS.5 (Facility Safety &amp; Biomedical Equipment)
        </span>
      </div>

      {/* 2. STATUTORY LICENSES VIEW */}
      {subSection === "licenses" && (
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Accredited Licenses
                </span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {licenses.length} Certificates
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-teal-700 font-bold">100% compliant</span> mandatory filings
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Expiring Within 60 Days
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-800 tracking-tight">
                {expiringLicensesCount} Certificates
              </div>
              <div className="text-xs text-amber-800 mt-1 font-semibold">
                BMW Waste (16d) &amp; Fire NOC (50d)
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Accreditation Body
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                NABH 5th Ed.
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-blue-700 font-bold">Full Hospital</span> Valid till 2027
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Radiation Safety
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                AERB Certified
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-emerald-700 font-bold">CT / Cath / X-Ray</span> Authorized
              </div>
            </div>
          </div>

          {/* Licenses Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hospital Statutory, Environmental &amp; Safety Licenses Register
                </h3>
                <p className="text-xs text-slate-500">
                  Centralized regulatory repository required for NABH, JCI, and state healthcare inspections
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                    <th className="py-3 px-4">License / Accreditation</th>
                    <th className="py-3 px-4">Issuing Authority</th>
                    <th className="py-3 px-4">Certificate Registration No.</th>
                    <th className="py-3 px-4">Valid Range</th>
                    <th className="py-3 px-4">Countdown</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {licenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {lic.licenseName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {lic.authority}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {lic.licenseNo}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {lic.issueDate} → {lic.expiryDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold text-xs ${
                            lic.daysLeft <= 30
                              ? "text-rose-600 font-bold"
                              : lic.daysLeft <= 60
                              ? "text-amber-600 font-bold"
                              : "text-slate-600"
                          }`}
                        >
                          {lic.daysLeft} days remaining
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            lic.status === "Valid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              lic.status === "Valid"
                                ? "bg-emerald-500"
                                : "bg-amber-500 animate-pulse"
                            }`}
                          ></span>
                          {lic.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onDownloadLicense(lic)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                          {lic.status === "Expiring Soon" && (
                            <button
                              onClick={() => onInitiateRenewal(lic)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                            >
                              Renew
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. BIOMEDICAL ASSETS VIEW */}
      {subSection === "biomedical" && (
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Biomedical Assets
                </span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {assets.length} Units
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-teal-700 font-bold">100% Barcoded</span> with RFID tags
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Class A (High Risk)
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                5 Critical
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-rose-700 font-bold">CT, MRI, ICU Vent</span>, Defib
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Preventive Service Due
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-800 tracking-tight">
                {maintenanceDueAssetsCount} Equipment
              </div>
              <div className="text-xs text-amber-800 mt-1 font-semibold">
                Hamilton Vent &amp; Zoll Defibrillator
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  AMC / CMC Coverage
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                100% Active
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="text-emerald-700 font-bold">OEM Certified</span> Service contracts
              </div>
            </div>
          </div>

          {/* Biomedical Assets Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Biomedical Asset Maintenance &amp; Calibration Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Critical medical diagnostic and life-support assets registered under Biomedical Engineering Dept
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Equipment &amp; Model</th>
                    <th className="py-3 px-4">Dept / Location</th>
                    <th className="py-3 px-4">Serial No.</th>
                    <th className="py-3 px-4">AMC Vendor &amp; Contract</th>
                    <th className="py-3 px-4">Next Calibration</th>
                    <th className="py-3 px-4">Risk Class</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-900">
                            {asset.assetName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {asset.assetCode} • {asset.model}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {asset.department}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {asset.serialNo}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">
                          {asset.amcVendor}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Expires: {asset.amcExpiry}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {asset.nextCalibration}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            asset.riskClass.includes("Class A")
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {asset.riskClass}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            asset.status === "Operational"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : asset.status === "Maintenance Due"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              asset.status === "Operational"
                                ? "bg-emerald-500"
                                : "bg-amber-500 animate-pulse"
                            }`}
                          ></span>
                          {asset.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onLogAssetService(asset)}
                          className="px-2.5 py-1 text-teal-700 hover:bg-teal-50 border border-teal-200/60 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <Wrench className="w-3 h-3" />
                          Log Service
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
