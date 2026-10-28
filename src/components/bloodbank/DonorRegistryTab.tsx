"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { BloodDonor, BloodGroup } from "@/types";

interface DonorRegistryTabProps {
  donors: BloodDonor[];
  onOpenRegisterModal: () => void;
  onEmergencyCallout: (group: BloodGroup) => void;
}

export const DonorRegistryTab: React.FC<DonorRegistryTabProps> = ({
  donors,
  onOpenRegisterModal,
  onEmergencyCallout,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const filteredDonors = donors.filter((d) => {
    if (selectedGroup !== "All" && d.bloodGroup !== selectedGroup) return false;
    if (selectedStatus !== "All" && d.status !== selectedStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.donorNumber.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q)
    );
  });

  const eligibleCount = donors.filter((d) => d.status === "Eligible").length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Emergency Donor Callout Quick Action */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-rose-800/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Emergency Donor Broadcast System
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight">
            Urgent Blood Requirement Callout
          </h2>
          <p className="text-xs text-rose-200/80 mt-0.5 max-w-xl">
            Instantly dispatch emergency SMS &amp; WhatsApp alerts to verified, eligible donors within a 15 km radius of the hospital.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["O-", "AB-", "A-", "B-"] as BloodGroup[]).map((grp) => (
            <button
              key={grp}
              onClick={() => onEmergencyCallout(grp)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              Alert {grp} Donors
            </button>
          ))}
        </div>
      </div>

      {/* Main Donor Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Voluntary Donor Directory ({filteredDonors.length} Donors)
              </h3>
              <p className="text-[11px] text-slate-500">
                {eligibleCount} currently eligible for donation (&gt;90 days since last draw).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, city..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Blood Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Groups (8)</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Eligible">Eligible Only</option>
              <option value="In Cooldown">In Cooldown</option>
              <option value="Deferred (Low Hb)">Deferred (Low Hb)</option>
            </select>

            {/* + Register Donor Action */}
            <button
              onClick={onOpenRegisterModal}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <Plus className="w-4 h-4" />
              Register Voluntary Donor
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Donor Name &amp; ID</th>
                <th className="py-2.5 px-3.5">Blood Group</th>
                <th className="py-2.5 px-3.5">Age / Gender / Wt</th>
                <th className="py-2.5 px-3.5">Hemoglobin (Hb)</th>
                <th className="py-2.5 px-3.5">Last Donation</th>
                <th className="py-2.5 px-3.5">Total Draws</th>
                <th className="py-2.5 px-3.5">Eligibility Status</th>
                <th className="py-2.5 px-3.5 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No donors match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {d.donorNumber} • {d.city}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs bg-rose-50 text-rose-700 border border-rose-200">
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div>
                        {d.age} Y / {d.gender}
                      </div>
                      <div className="text-[10px] text-slate-400">{d.weightKg} kg</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`font-bold ${
                          d.hemoglobin >= 12.5 ? "text-emerald-700" : "text-rose-600 font-semibold"
                        }`}
                      >
                        {d.hemoglobin} g/dL
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">{d.lastDonationDate}</td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">{d.totalDonations} units</td>
                    <td className="py-3 px-3.5">
                      {d.status === "Eligible" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Eligible
                        </span>
                      )}
                      {d.status === "In Cooldown" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3 text-amber-600" />
                          In Cooldown
                        </span>
                      )}
                      {d.status === "Deferred (Low Hb)" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Deferred (Low Hb)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <a
                        href={`tel:${d.phone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
                        title="Call Donor"
                      >
                        <Phone className="w-3 h-3 text-teal-700" />
                        {d.phone}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
