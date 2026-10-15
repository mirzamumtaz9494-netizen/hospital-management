"use client";

import React, { useState } from "react";
import {
  FileText,
  Hash,
  Stethoscope,
  Pill,
  AlertTriangle,
  Printer,
  Save,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { ClinicalPreferencesSettings } from "@/types";

interface ClinicalPreferencesTabProps {
  preferences: ClinicalPreferencesSettings;
  onSavePreferences: (updated: ClinicalPreferencesSettings) => void;
}

export const ClinicalPreferencesTab: React.FC<ClinicalPreferencesTabProps> = ({
  preferences: initialPreferences,
  onSavePreferences,
}) => {
  const [preferences, setPreferences] =
    useState<ClinicalPreferencesSettings>(initialPreferences);

  const handleChange = (field: keyof ClinicalPreferencesSettings, val: any) => {
    setPreferences((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(preferences);
  };

  const mrnPreview = `${preferences.mrnPrefix}${String(
    preferences.currentMrnCounter
  ).padStart(preferences.mrnDigits, "0")}`;

  const ipPreview = `${preferences.ipAdmissionPrefix}${preferences.currentIpCounter}`;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Clinical Workflow, MRN Formats &amp; Safety Rules
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              EHR / EMR Standards
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Automated patient numbering schemes, prescription safety thresholds, and clinical decision support rules
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          Save Clinical Settings
        </button>
      </div>

      {/* 2. Patient Identifier (MRN) & IP/OP Token Numbering */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Patient Numbering Schemes &amp; Sequence Counters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Medical Record (MRN) Format
              </span>
              <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                Preview: {mrnPreview}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Prefix Code
              </label>
              <input
                type="text"
                value={preferences.mrnPrefix}
                onChange={(e) => handleChange("mrnPrefix", e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Digit Padding
                </label>
                <input
                  type="number"
                  min={4}
                  max={8}
                  value={preferences.mrnDigits}
                  onChange={(e) =>
                    handleChange("mrnDigits", Number(e.target.value))
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Next Counter
                </label>
                <input
                  type="number"
                  value={preferences.currentMrnCounter}
                  onChange={(e) =>
                    handleChange("currentMrnCounter", Number(e.target.value))
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Outpatient (OP) Token Rules
              </span>
              <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                Format: {preferences.opTokenPrefix}40125
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Token Prefix
              </label>
              <input
                type="text"
                value={preferences.opTokenPrefix}
                onChange={(e) => handleChange("opTokenPrefix", e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.opTokenResetDaily}
                  onChange={(e) =>
                    handleChange("opTokenResetDaily", e.target.checked)
                  }
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Reset token counter daily at 00:00 AM
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoPrintToken}
                  onChange={(e) =>
                    handleChange("autoPrintToken", e.target.checked)
                  }
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Auto-print thermal OP slip on save
                </span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Inpatient (IP) Admission No.
              </span>
              <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                Preview: {ipPreview}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Admission Prefix
              </label>
              <input
                type="text"
                value={preferences.ipAdmissionPrefix}
                onChange={(e) =>
                  handleChange("ipAdmissionPrefix", e.target.value)
                }
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Next Inpatient Counter
              </label>
              <input
                type="number"
                value={preferences.currentIpCounter}
                onChange={(e) =>
                  handleChange("currentIpCounter", Number(e.target.value))
                }
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Clinical Decision Support & Medication Safety */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Clinical Decision Support &amp; Medication Safety
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Drug-Drug Interaction Alert Sensitivity
            </label>
            <select
              value={preferences.drugInteractionWarning}
              onChange={(e) =>
                handleChange("drugInteractionWarning", e.target.value)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value="High Severity Only">
                High Severity Only (Life-threatening contraindications)
              </option>
              <option value="Moderate & High">
                Moderate &amp; High (Recommended clinical practice)
              </option>
              <option value="All Interactions">
                All Interactions (High noise / research mode)
              </option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-slate-900">
                WHO AWaRe Antibiotic Stewardship Prompt
              </div>
              <div className="text-[11px] text-slate-500">
                Requires mandatory clinical justification when ordering Reserve group antimicrobials
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.antibioticStewardshipPrompt}
              onChange={(e) =>
                handleChange("antibioticStewardshipPrompt", e.target.checked)
              }
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Blood Pressure Unit
            </label>
            <input
              type="text"
              value={preferences.defaultBpUnit}
              onChange={(e) => handleChange("defaultBpUnit", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Body Temperature Unit
            </label>
            <input
              type="text"
              value={preferences.defaultTempUnit}
              onChange={(e) => handleChange("defaultTempUnit", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Body Weight Unit
            </label>
            <input
              type="text"
              value={preferences.defaultWeightUnit}
              onChange={(e) => handleChange("defaultWeightUnit", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
