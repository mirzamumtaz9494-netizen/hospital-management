"use client";

import React, { useState } from "react";
import {
  Wallet,
  Receipt,
  CreditCard,
  QrCode,
  ShieldAlert,
  Save,
  CheckCircle2,
  FileCheck,
  Building,
} from "lucide-react";
import { BillingTaxSettings } from "@/types";

interface BillingTaxTabProps {
  settings: BillingTaxSettings;
  onSaveSettings: (updated: BillingTaxSettings) => void;
}

export const BillingTaxTab: React.FC<BillingTaxTabProps> = ({
  settings: initialSettings,
  onSaveSettings,
}) => {
  const [settings, setSettings] = useState<BillingTaxSettings>(initialSettings);

  const handleChange = (field: keyof BillingTaxSettings, val: any) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settings);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Billing, GST Taxation &amp; Payment POS Integrations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              CGST / SGST Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Room rent GST thresholds, pharmacy tax slabs, cashless TPA insurance rules, and terminal routing
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          Save Billing Settings
        </button>
      </div>

      {/* 2. GST & Tax Exemption Thresholds */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Statutory Healthcare Tax Slabs &amp; Exemption Limits
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Room Rent GST Exemption Ceiling (₹) *
            </label>
            <input
              type="number"
              min={0}
              step={500}
              value={settings.roomRentGstExemptionThreshold}
              onChange={(e) =>
                handleChange(
                  "roomRentGstExemptionThreshold",
                  Number(e.target.value)
                )
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Room tariffs below ₹5,000/day are 0% GST exempt per CBIC healthcare notification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Standard Pharmacy Medicine GST Slab (%)
            </label>
            <select
              value={settings.medicineGstSlab}
              onChange={(e) =>
                handleChange("medicineGstSlab", Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value={5}>5% (Life Saving &amp; Insulin)</option>
              <option value={12}>12% (Standard Formulations)</option>
              <option value={18}>18% (Disinfectants &amp; Medical Devices)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Default formulation GST rate applied on retail and IP pharmacy indents.
            </p>
          </div>

          <div className="flex flex-col justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Diagnostic &amp; Pathology GST Exemption
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Clinical biochemistry and radiology investigations are exempt (0% Tax)
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={settings.diagnosticGstExempt}
                onChange={(e) =>
                  handleChange("diagnosticGstExempt", e.target.checked)
                }
                className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-semibold">
                Enforce 0% Clinical Exemption
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Payment Gateway & Terminal Routing */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Point of Sale (POS) Terminals &amp; Digital UPI Slabs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dynamic UPI / QR Code Virtual Payment Address (VPA)
            </label>
            <div className="relative">
              <QrCode className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={settings.upiMerchantId}
                onChange={(e) => handleChange("upiMerchantId", e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Generates instant BharatQR on patient bills for UPI payments
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Integrated Card POS Terminal Provider
            </label>
            <div className="relative">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={settings.cardTerminalProvider}
                onChange={(e) =>
                  handleChange("cardTerminalProvider", e.target.value)
                }
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Hardware bridge routing transaction charge slips to billing terminals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Auto-Submit TPA Cashless Pre-Authorization
              </div>
              <div className="text-[11px] text-slate-500">
                Pushes clinical diagnostic codes &amp; bed estimates to insurance portal via NHA HCX
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSubmitTpaPreauth}
              onChange={(e) =>
                handleChange("autoSubmitTpaPreauth", e.target.checked)
              }
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Fee Waiver Authorization Threshold (₹)
            </label>
            <input
              type="number"
              min={0}
              step={500}
              value={settings.cmoDiscountApprovalLimit}
              onChange={(e) =>
                handleChange(
                  "cmoDiscountApprovalLimit",
                  Number(e.target.value)
                )
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Discounts exceeding this threshold require Medical Director approval
            </p>
          </div>
        </div>
      </div>

      {/* 4. Tax Invoice Numbering & Legal Footer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Invoice Numbering &amp; Legal Receipt Declaration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tax Invoice Prefix
            </label>
            <input
              type="text"
              value={settings.invoicePrefix}
              onChange={(e) => handleChange("invoicePrefix", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Sequential Invoice Counter
            </label>
            <input
              type="number"
              value={settings.currentInvoiceCounter}
              onChange={(e) =>
                handleChange("currentInvoiceCounter", Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Official Receipt Footer Legal Note
          </label>
          <textarea
            rows={2}
            value={settings.receiptFooterLegal}
            onChange={(e) =>
              handleChange("receiptFooterLegal", e.target.value)
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-teal-500"
          ></textarea>
        </div>
      </div>
    </form>
  );
};
