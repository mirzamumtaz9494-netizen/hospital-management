"use client";

import React, { useState } from "react";
import {
  Building,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  ShieldCheck,
  Save,
  Plus,
  Clock,
  Coins,
  CheckCircle2,
} from "lucide-react";
import { HospitalProfileSettings } from "@/types";

interface HospitalProfileTabProps {
  profile: HospitalProfileSettings;
  onSaveProfile: (updated: HospitalProfileSettings) => void;
  onAddBranch: () => void;
}

export const HospitalProfileTab: React.FC<HospitalProfileTabProps> = ({
  profile: initialProfile,
  onSaveProfile,
  onAddBranch,
}) => {
  const [profile, setProfile] = useState<HospitalProfileSettings>(initialProfile);

  const handleChange = (field: keyof HospitalProfileSettings, val: any) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Hospital Master Profile &amp; Campus Legal Entity
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              NABH 5th Edition
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Official hospital identity, statutory licensing credentials, and multi-branch network configurations
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          Save Hospital Profile
        </button>
      </div>

      {/* 2. Legal Entity & Accreditation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Statutory Registration &amp; Accreditation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registered Hospital Legal Name *
            </label>
            <input
              type="text"
              required
              value={profile.hospitalName}
              onChange={(e) => handleChange("hospitalName", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Establishments Act Registration No. *
            </label>
            <input
              type="text"
              required
              value={profile.registrationNo}
              onChange={(e) => handleChange("registrationNo", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Accreditation Status
            </label>
            <input
              type="text"
              value={profile.nabhTier}
              onChange={(e) => handleChange("nabhTier", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              GSTIN (Tax ID)
            </label>
            <input
              type="text"
              value={profile.gstin}
              onChange={(e) => handleChange("gstin", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              PAN Number
            </label>
            <input
              type="text"
              value={profile.pan}
              onChange={(e) => handleChange("pan", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Communication & Emergency Lines */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Contact Details &amp; Emergency Helpline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              General Boardline Phone
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={profile.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-700 mb-1">
              Emergency 24/7 Hotline
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={profile.emergencyHotline}
                onChange={(e) => handleChange("emergencyHotline", e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={profile.officialEmail}
                onChange={(e) => handleChange("officialEmail", e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Website
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={profile.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Campus Address
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              City &amp; State
            </label>
            <input
              type="text"
              value={`${profile.city}, ${profile.state}`}
              onChange={(e) => {
                const parts = e.target.value.split(",");
                handleChange("city", parts[0]?.trim() || "");
                if (parts[1]) handleChange("state", parts[1]?.trim() || "");
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              PIN / Postal Code
            </label>
            <input
              type="text"
              value={profile.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Multi-Branch Network & Regional Slabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Multi-Campus Network &amp; Active Branch
          </h3>
          <button
            type="button"
            onClick={onAddBranch}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Satellite Branch
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Currently Selected Active Branch
            </label>
            <select
              value={profile.currentBranch}
              onChange={(e) => handleChange("currentBranch", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              {profile.availableBranches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Base Operating Currency
            </label>
            <input
              type="text"
              value={profile.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Financial Fiscal Cycle
            </label>
            <input
              type="text"
              value={profile.fiscalYear}
              onChange={(e) => handleChange("fiscalYear", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
