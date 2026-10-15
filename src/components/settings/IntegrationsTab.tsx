"use client";

import React, { useState } from "react";
import {
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Cpu,
  Zap,
} from "lucide-react";
import { ExternalIntegrationItem } from "@/types";

interface IntegrationsTabProps {
  integrations: ExternalIntegrationItem[];
  onTestIntegration: (item: ExternalIntegrationItem) => void;
  onRefreshAll: () => void;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
  integrations,
  onTestIntegration,
  onRefreshAll,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">
              Healthcare Interoperability, HL7 Analyzers &amp; ABDM Bridges
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              FHIR R4 / HL7 v2.5 / DICOM 3.0
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Bi-directional diagnostic machine interfaces, radiology PACS image archives, and national health mission APIs
          </p>
        </div>

        <button
          onClick={onRefreshAll}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-700" />
          Poll Gateways
        </button>
      </div>

      {/* 2. ABDM Milestones Spotlight Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              National Health Authority (NHA) Accredited
            </div>
            <h3 className="text-base font-bold text-white">
              Ayushman Bharat Digital Mission (ABDM) Integration Suite
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Fully certified for Milestone 1 (ABHA Creation &amp; Verification), Milestone 2 (HIP EHR Linking &amp; Teleconsultation), and Milestone 3 (HIU Consent Management).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              M1, M2 &amp; M3 Live
            </span>
          </div>
        </div>
      </div>

      {/* 3. Integrations Cards List */}
      <div className="space-y-3.5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {item.integrationName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.details}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                <span>Endpoint: {item.endpointUrl}</span>
                <span>•</span>
                <span>Latency: {item.latencyMs}ms</span>
                <span>•</span>
                <span>Last Sync: {item.lastSync}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => onTestIntegration(item)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-teal-700" />
                Test Ping
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
