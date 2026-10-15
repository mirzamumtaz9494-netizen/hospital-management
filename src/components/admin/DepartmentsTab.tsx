"use client";

import React, { useState } from "react";
import {
  Building2,
  Stethoscope,
  Bed,
  Users,
  Search,
  Plus,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { HospitalDepartmentItem, DoctorRosterSchedule } from "@/types";

interface DepartmentsTabProps {
  departments: HospitalDepartmentItem[];
  rosters: DoctorRosterSchedule[];
  onAddDepartment: () => void;
  onEditDepartment: (dept: HospitalDepartmentItem) => void;
}

export const DepartmentsTab: React.FC<DepartmentsTabProps> = ({
  departments,
  rosters,
  onAddDepartment,
  onEditDepartment,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");

  const filteredDepts = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hodName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTypeFilter === "All" || d.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const totalBeds = departments.reduce((acc, curr) => acc + curr.bedQuota, 0);
  const totalDoctors = departments.reduce((acc, curr) => acc + curr.onDutyDoctors, 0);

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Departments
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {departments.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-teal-700 font-bold">7 Clinical</span> • 3 Diagnostic/Support
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Bed Quota
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalBeds} Beds
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-blue-700 font-bold">100% capacity</span> allocated
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Clinicians on Duty
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalDoctors} Doctors
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-700 font-bold">Across 4 shifts</span> today
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Emergency Coverage
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            24 / 7
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-rose-700 font-bold">Trauma Team</span> on 8-min response
          </div>
        </div>
      </div>

      {/* 2. Search & Add Department Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by department name, code, or HOD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Department Types</option>
              <option value="Clinical">Clinical Only</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Support">Support</option>
            </select>
          </div>
        </div>

        <button
          onClick={onAddDepartment}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Department
        </button>
      </div>

      {/* 3. Departments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Hospital Clinical &amp; Operational Departments Master
            </h3>
            <p className="text-xs text-slate-500">
              {filteredDepts.length} departments registered • Location assignments, HODs, and consultation fee slabs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">Dept Code &amp; Name</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Head of Dept (HOD)</th>
                <th className="py-3 px-4">Campus Location</th>
                <th className="py-3 px-4 text-center">Bed Quota</th>
                <th className="py-3 px-4 text-center">Clinicians</th>
                <th className="py-3 px-4 text-right">Default OP Fee</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDepts.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 text-[11px]">
                        {dept.code}
                      </span>
                      <span className="font-bold text-slate-900">
                        {dept.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dept.type === "Clinical"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : dept.type === "Diagnostic"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {dept.type}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {dept.hodName}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{dept.floorLocation}, {dept.block}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-900">
                    {dept.bedQuota > 0 ? `${dept.bedQuota} beds` : "—"}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {dept.onDutyDoctors > 0 ? `${dept.onDutyDoctors} MDs` : "—"}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {dept.opFee > 0 ? (
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        ₹{dept.opFee}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onEditDepartment(dept)}
                      className="px-2.5 py-1 text-teal-700 hover:bg-teal-50 rounded-lg text-xs font-bold transition"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Doctor Duty Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Doctor Shift &amp; Duty Roster Allocation
            </h3>
            <p className="text-xs text-slate-500">
              Shift allocations across OPD consultation suites and emergency trauma bays
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Current Shift: Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                <th className="py-3 px-4">Doctor Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Shift</th>
                <th className="py-3 px-4">Working Days</th>
                <th className="py-3 px-4">Consultation Chamber / Bay</th>
                <th className="py-3 px-4 text-right">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rosters.map((rst) => (
                <tr key={rst.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {rst.doctorName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {rst.department}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        rst.shift.includes("Morning")
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : rst.shift.includes("Evening")
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : rst.shift.includes("Night")
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {rst.shift}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {rst.dayOfWeek}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {rst.roomNo}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rst.status === "On Duty"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          rst.status === "On Duty"
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-slate-400"
                        }`}
                      ></span>
                      {rst.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
