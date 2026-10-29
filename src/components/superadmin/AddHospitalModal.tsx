"use client";

import React, { useState } from "react";
import { X, Building2, BedDouble, Shield, Check, Plus, Sparkles } from "lucide-react";
import { HospitalTenant, TenantModuleKey, TenantPlanKey } from "@/types";
import { ALL_TENANT_MODULES } from "@/data/tenantMockData";

interface AddHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTenant: (tenant: Omit<HospitalTenant, "id" | "createdAt">) => void | Promise<any>;
}

export const AddHospitalModal: React.FC<AddHospitalModalProps> = ({
  isOpen,
  onClose,
  onAddTenant,
}) => {
  const [name, setName] = useState("");
  const [unitName, setUnitName] = useState("Unit 1");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [bedCapacity, setBedCapacity] = useState<number>(20);
  const [plan, setPlan] = useState<TenantPlanKey>("standard_hospital");

  const [selectedModules, setSelectedModules] = useState<Record<TenantModuleKey, boolean>>({
    opd: true,
    ipd: true,
    pharmacy: true,
    laboratory: true,
    doctors: true,
    services: true,
    blood_bank: false,
    accounts: false,
    reports: false,
    admin: false,
    referrals: true,
  });

  if (!isOpen) return null;

  const toggleModule = (key: TenantModuleKey) => {
    setSelectedModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate estimated monthly price
  let calculatedFee = 0;
  ALL_TENANT_MODULES.forEach((mod) => {
    if (selectedModules[mod.key]) {
      calculatedFee += mod.basePricePerMonth;
    }
  });
  calculatedFee += bedCapacity * 250;

  const handlePlanChange = (newPlan: TenantPlanKey) => {
    setPlan(newPlan);
    if (newPlan === "starter_clinic") {
      setBedCapacity(0);
      setSelectedModules({
        opd: true,
        pharmacy: true,
        doctors: true,
        services: true,
        ipd: false,
        laboratory: false,
        blood_bank: false,
        accounts: false,
        reports: false,
        admin: false,
        referrals: false,
      });
    } else if (newPlan === "standard_hospital") {
      setBedCapacity(20);
      setSelectedModules({
        opd: true,
        ipd: true,
        pharmacy: true,
        laboratory: true,
        doctors: true,
        services: true,
        blood_bank: false,
        accounts: false,
        reports: false,
        admin: false,
        referrals: true,
      });
    } else if (newPlan === "enterprise_multispecialty") {
      setBedCapacity(50);
      setSelectedModules({
        opd: true,
        ipd: true,
        pharmacy: true,
        laboratory: true,
        blood_bank: true,
        doctors: true,
        services: true,
        accounts: true,
        reports: true,
        admin: true,
        referrals: true,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tenantCode = name
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 4)
      .toUpperCase() + `-${Math.floor(10 + Math.random() * 90)}`;

    const planLabel =
      plan === "starter_clinic"
        ? "Starter Day Clinic (0 Beds)"
        : plan === "standard_hospital"
        ? `Standard Hospital (${bedCapacity} Beds)`
        : plan === "enterprise_multispecialty"
        ? `Enterprise Multispecialty (${bedCapacity} Beds)`
        : `Custom Package (${bedCapacity} Beds)`;

    onAddTenant({
      name,
      unitName,
      tenantCode,
      tagline: "Multispecialty Care & Diagnostic Hospital",
      city,
      state,
      contactEmail: contactEmail || `admin@${tenantCode.toLowerCase()}.hms`,
      contactPhone: contactPhone || "+91 98000 00000",
      plan,
      planLabel,
      bedCapacity,
      status: "Active",
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      monthlyFee: calculatedFee,
      currency: "INR",
      logoBadge: bedCapacity > 0 ? `${unitName} • ${bedCapacity} Beds` : `${unitName} • Day Clinic`,
      primaryColor: "teal",
      modules: selectedModules,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Provision New Hospital Client
              </h3>
              <p className="text-xs text-slate-300">
                Setup hospital tenant workspace, bed limits &amp; licensed modules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Preset Plan Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Package Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: "starter_clinic",
                  label: "Starter Day Clinic",
                  beds: "0 Beds (OPD Only)",
                  price: "₹9,500/mo",
                },
                {
                  id: "standard_hospital",
                  label: "Standard Hospital",
                  beds: "20 Inpatient Beds",
                  price: "₹22,500/mo",
                },
                {
                  id: "enterprise_multispecialty",
                  label: "Enterprise Hospital",
                  beds: "50 Beds + Blood Bank",
                  price: "₹48,500/mo",
                },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handlePlanChange(p.id as TenantPlanKey)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    plan === p.id
                      ? "bg-teal-50/70 border-teal-500 text-slate-900 shadow-sm ring-1 ring-teal-500/30"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{p.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.beds}</div>
                  <div className="text-[11px] font-mono font-bold text-teal-600 mt-1">
                    {p.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hospital Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Hospital Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunrise Multispecialty Hospital"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Unit / Branch Name
              </label>
              <input
                type="text"
                placeholder="e.g. Unit 1 / Main Branch"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Bed Capacity (Quota)
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 font-bold"
              />
            </div>
          </div>

          {/* Module Entitlement Checkboxes */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Licensed Modules ({Object.values(selectedModules).filter(Boolean).length}/10 Active)
              </label>
              <span className="text-[11px] text-teal-600 font-mono font-bold">
                Calculated: ₹{calculatedFee.toLocaleString("en-IN")}/mo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_TENANT_MODULES.map((mod) => {
                const isSelected = !!selectedModules[mod.key];
                return (
                  <div
                    key={mod.key}
                    onClick={() => toggleModule(mod.key)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                      isSelected
                        ? "bg-teal-50/50 border-teal-500/60 text-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? "bg-teal-500" : "bg-slate-300"
                          }`}
                        ></span>
                        <span className={isSelected ? "text-slate-900" : "text-slate-500"}>
                          {mod.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {mod.description}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition shrink-0 ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "border border-slate-300 text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500">Monthly Contract Value:</div>
              <div className="text-sm font-bold text-slate-900">
                ₹{calculatedFee.toLocaleString("en-IN")}{" "}
                <span className="text-[10px] font-normal text-slate-500">/ month + GST</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-md shadow-teal-600/20 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Hospital Workspace</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
