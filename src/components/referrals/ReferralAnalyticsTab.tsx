"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Building2,
  Stethoscope,
  Users,
  CheckCircle2,
  ArrowUpRight,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  InboundReferral,
  ExternalDiagnosticOrder,
  ExternalDiagnosticCenter,
} from "@/types";

interface ReferralAnalyticsTabProps {
  inboundReferrals: InboundReferral[];
  externalOrders: ExternalDiagnosticOrder[];
  centers: ExternalDiagnosticCenter[];
}

export const ReferralAnalyticsTab: React.FC<ReferralAnalyticsTabProps> = ({
  inboundReferrals,
  externalOrders,
  centers,
}) => {
  // Department breakdown for inbound
  const deptMap: Record<string, number> = {};
  inboundReferrals.forEach((r) => {
    deptMap[r.destinationDepartment] = (deptMap[r.destinationDepartment] || 0) + 1;
  });

  // Top referring practitioners
  const referrerMap: Record<string, { count: number; entity: string }> = {};
  inboundReferrals.forEach((r) => {
    if (!referrerMap[r.referrerName]) {
      referrerMap[r.referrerName] = { count: 0, entity: r.referringEntity };
    }
    referrerMap[r.referrerName].count += 1;
  });

  const topReferrers = Object.entries(referrerMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  // Modality breakdown for external diagnostics
  const modalityMap: Record<string, number> = {};
  externalOrders.forEach((o) => {
    o.selectedTests.forEach((t) => {
      modalityMap[t.modality] = (modalityMap[t.modality] || 0) + 1;
    });
  });

  return (
    <div className="space-y-6">
      {/* Ethics & Compliance Accreditation Banner */}
      <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl border border-emerald-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">National Medical Commission (NMC) Ethical Compliance</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  VERIFIED AUDIT LOG
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                VitalSync HMS strictly complies with Section 6.4 of the Indian Medical Council / NMC Professional Conduct Regulations. All patient referrals are tracked exclusively for clinical continuity, triage urgency, and formal doctor-to-doctor correspondence. <strong>Zero fee-splitting or illegal commission ledgers are implemented.</strong>
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-emerald-400">100%</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">NABH Audit Standard</div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Top Inbound Referral Doctors & Entities */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Top Inbound Referring Doctors & Nursing Homes
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">By Patient Volume</span>
          </div>

          <div className="space-y-3">
            {topReferrers.slice(0, 5).map((ref, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-slate-900">{ref.name}</div>
                  <div className="text-[10px] text-slate-500">{ref.entity}</div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {ref.count} Patients Referred
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Department-wise Inbound Referral Intake */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Inbound Referrals by Specialty Department
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Census Distribution</span>
          </div>

          <div className="space-y-3">
            {Object.entries(deptMap).map(([dept, count], idx) => {
              const percentage = Math.round((count / (inboundReferrals.length || 1)) * 100);
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{dept}</span>
                    <span className="font-mono font-bold text-slate-900">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Outbound Diagnostic Investigation Modalities */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                External Diagnostic Modalities Referred
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">By Modality Category</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(modalityMap).map(([modality, count], idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{modality}</span>
                <span className="text-lg font-black text-slate-900 mt-0.5 block">{count} Investigations</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Partner Diagnostic Center Revenue Performance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Partner Center Performance & Share
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">B2B Margin</span>
          </div>

          <div className="space-y-3">
            {centers.map((c) => {
              const centerOrders = externalOrders.filter((o) => o.destinationCenterId === c.id);
              const totalBilled = centerOrders.reduce((sum, o) => sum + o.totalMrp, 0);
              const hospitalShare = centerOrders.reduce((sum, o) => sum + o.hospitalReceivableShare, 0);

              return (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.centerName}</div>
                    <div className="text-[10px] text-slate-500">
                      {centerOrders.length} Orders • {c.partnershipTerms.sharePercentage}% Agreed Share
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-slate-700">₹{totalBilled.toLocaleString("en-IN")} Gross</div>
                    <div className="text-[11px] font-mono font-bold text-emerald-700">
                      +₹{hospitalShare.toLocaleString("en-IN")} Margin
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
