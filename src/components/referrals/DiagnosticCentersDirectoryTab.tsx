"use client";

import React, { useState } from "react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Percent,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  DollarSign,
  FileText,
  Search,
} from "lucide-react";
import { ExternalDiagnosticCenter, ExternalDiagnosticTestItem } from "@/types";

interface DiagnosticCentersDirectoryTabProps {
  centers: ExternalDiagnosticCenter[];
  onAddCenter: (center: ExternalDiagnosticCenter) => void;
}

export const DiagnosticCentersDirectoryTab: React.FC<DiagnosticCentersDirectoryTabProps> = ({
  centers,
  onAddCenter,
}) => {
  const [expandedCenterId, setExpandedCenterId] = useState<string | null>(centers[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCenterModalOpen, setIsAddCenterModalOpen] = useState(false);

  // New center form state
  const [newCenterData, setNewCenterData] = useState({
    centerName: "",
    branch: "",
    centerType: "Radiology & Imaging" as any,
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    sharePercentage: 20,
    settlementFrequency: "Monthly" as any,
    bankName: "HDFC Bank",
    accountNumber: "",
    ifscCode: "",
  });

  const toggleExpand = (id: string) => {
    setExpandedCenterId((prev) => (prev === id ? null : id));
  };

  const filteredCenters = centers.filter(
    (c) =>
      c.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.centerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCenterData.centerName.trim()) return;

    const newCenter: ExternalDiagnosticCenter = {
      id: `dc-${Date.now()}`,
      centerName: newCenterData.centerName.trim(),
      branch: newCenterData.branch.trim() || "Main Facility",
      centerType: newCenterData.centerType,
      contactPerson: newCenterData.contactPerson.trim() || "Center Administrator",
      phone: newCenterData.phone.trim() || "+91 40 2000 0000",
      email: newCenterData.email.trim() || "info@center.com",
      address: newCenterData.address.trim() || "Hyderabad, Telangana",
      accreditations: ["NABL"],
      partnershipTerms: {
        model: "Percentage Revenue Share",
        sharePercentage: Number(newCenterData.sharePercentage) || 20,
        concessionNotes: `${newCenterData.sharePercentage}% institutional B2B revenue sharing agreement.`,
        effectiveFrom: new Date().toISOString().split("T")[0],
        effectiveTo: "2027-12-31",
        settlementFrequency: newCenterData.settlementFrequency,
        bankDetails: {
          bankName: newCenterData.bankName,
          accountNumber: newCenterData.accountNumber || "000000000000",
          ifscCode: newCenterData.ifscCode || "HDFC0000001",
          accountHolder: newCenterData.centerName,
        },
      },
      activeStatus: "Active",
      serviceCatalog: [
        {
          testCode: "GEN-MRI-01",
          testName: "MRI Screening Study",
          modality: "MRI",
          standardMrp: 6000,
          hospitalAgreedRate: 6000 * (1 - newCenterData.sharePercentage / 100),
          hospitalShare: 6000 * (newCenterData.sharePercentage / 100),
          preparationInstructions: "No metal implants.",
        },
        {
          testCode: "GEN-CT-01",
          testName: "CT Scan Study",
          modality: "CT Scan",
          standardMrp: 4500,
          hospitalAgreedRate: 4500 * (1 - newCenterData.sharePercentage / 100),
          hospitalShare: 4500 * (newCenterData.sharePercentage / 100),
          preparationInstructions: "Fasting 4 hours if contrast.",
        },
      ],
    };

    onAddCenter(newCenter);
    setIsAddCenterModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partner centers by name, branch or type..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
          />
        </div>

        <button
          onClick={() => setIsAddCenterModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Register Partner Diagnostic Center
        </button>
      </div>

      {/* Center Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredCenters.map((center) => {
          const isExpanded = expandedCenterId === center.id;

          return (
            <div
              key={center.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0 shadow-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{center.centerName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                        {center.partnershipTerms.sharePercentage}% B2B SHARE
                      </span>
                      {center.accreditations.map((acc, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {acc}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {center.branch} • <span className="text-teal-700 font-semibold">{center.centerType}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {center.address}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {center.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => toggleExpand(center.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>{center.serviceCatalog.length} Tariffs & Agreement</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Agreement & Catalog Details */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-slate-50/50 space-y-5 animate-in fade-in duration-150">
                  {/* Terms Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Agreed Revenue Share
                      </div>
                      <div className="text-base font-black text-teal-700">
                        {center.partnershipTerms.sharePercentage}% Institutional Rebate
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        {center.partnershipTerms.concessionNotes}
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Settlement Schedule
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        {center.partnershipTerms.settlementFrequency} Payout Cycle
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Agreement Validity: {center.partnershipTerms.effectiveFrom} to{" "}
                        {center.partnershipTerms.effectiveTo}
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Clearinghouse Bank Account
                      </div>
                      <div className="font-bold text-slate-900 truncate">
                        {center.partnershipTerms.bankDetails.bankName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        A/C: {center.partnershipTerms.bankDetails.accountNumber} • IFSC:{" "}
                        {center.partnershipTerms.bankDetails.ifscCode}
                      </div>
                    </div>
                  </div>

                  {/* Investigation Tariffs Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                        Available Investigation Catalog ({center.serviceCatalog.length} Listed)
                      </span>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200 text-[10px] uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Test Code</th>
                            <th className="py-2.5 px-3">Investigation Name</th>
                            <th className="py-2.5 px-3">Modality</th>
                            <th className="py-2.5 px-3 text-right">Standard MRP</th>
                            <th className="py-2.5 px-3 text-right">Hospital B2B Rate</th>
                            <th className="py-2.5 px-3 text-right">Hospital Share</th>
                            <th className="py-2.5 px-3">Preparation Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {center.serviceCatalog.map((test) => (
                            <tr key={test.testCode} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                                {test.testCode}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                {test.testName}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {test.modality}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                                ₹{test.standardMrp.toLocaleString("en-IN")}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                                ₹{test.hospitalAgreedRate.toLocaleString("en-IN")}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                                +₹{test.hospitalShare.toLocaleString("en-IN")}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 italic max-w-xs truncate text-[11px]">
                                {test.preparationInstructions}
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
        })}
      </div>

      {/* Add Partner Center Modal */}
      {isAddCenterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Register Partner Diagnostic Center</h3>
              <button
                onClick={() => setIsAddCenterModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCenter} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Center Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCenterData.centerName}
                  onChange={(e) => setNewCenterData({ ...newCenterData, centerName: e.target.value })}
                  placeholder="e.g. Apollo Diagnostics Hub"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Branch / Location
                  </label>
                  <input
                    type="text"
                    value={newCenterData.branch}
                    onChange={(e) => setNewCenterData({ ...newCenterData, branch: e.target.value })}
                    placeholder="e.g. Hitech City Branch"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Facility Type
                  </label>
                  <select
                    value={newCenterData.centerType}
                    onChange={(e) => setNewCenterData({ ...newCenterData, centerType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                  >
                    <option value="Radiology & Imaging">Radiology & Imaging</option>
                    <option value="Advanced Pathology">Advanced Pathology</option>
                    <option value="Comprehensive Diagnostic Centre">Comprehensive Diagnostic Centre</option>
                    <option value="Nuclear Medicine & PET">Nuclear Medicine & PET</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Agreed Hospital Share (%) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    required
                    value={newCenterData.sharePercentage}
                    onChange={(e) => setNewCenterData({ ...newCenterData, sharePercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-teal-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Settlement Frequency
                  </label>
                  <select
                    value={newCenterData.settlementFrequency}
                    onChange={(e) => setNewCenterData({ ...newCenterData, settlementFrequency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Fortnightly">Fortnightly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Contact Phone & Email
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCenterData.phone}
                    onChange={(e) => setNewCenterData({ ...newCenterData, phone: e.target.value })}
                    placeholder="+91 40 2345 6789"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                  />
                  <input
                    type="email"
                    value={newCenterData.email}
                    onChange={(e) => setNewCenterData({ ...newCenterData, email: e.target.value })}
                    placeholder="b2b@center.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddCenterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Partner Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
