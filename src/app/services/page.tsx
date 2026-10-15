"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Activity,
  Edit,
  X,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { QuickMenuModal } from "@/components/QuickMenuModal";
import { CreateOpModal } from "@/components/CreateOpModal";
import { CreateIpModal } from "@/components/CreateIpModal";
import { useRole } from "@/context/RoleContext";
import { MOCK_HOSPITAL_SERVICES } from "@/data/servicesMockData";
import { HospitalServiceItem } from "@/types";

export default function ServicesPage() {
  const { currentRole } = useRole();
  const [services, setServices] =
    useState<HospitalServiceItem[]>(MOCK_HOSPITAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNewOpModalOpen, setIsNewOpModalOpen] = useState(false);
  const [isNewIpModalOpen, setIsNewIpModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [selectedServiceToEdit, setSelectedServiceToEdit] =
    useState<HospitalServiceItem | null>(null);

  // New Service Form State
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<
    HospitalServiceItem["category"]
  >("Radiology & Imaging");
  const [newDept, setNewDept] = useState("Radiology & Imaging Sciences");
  const [newFee, setNewFee] = useState(1500);
  const [newDuration, setNewDuration] = useState(30);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const categories = [
    "All",
    "Radiology & Imaging",
    "Surgical & OT",
    "Cardiology Procedures",
    "Allied & Day Care",
    "Emergency Services",
  ];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nabhCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newService: HospitalServiceItem = {
      id: `srv-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      name: newName.trim(),
      category: newCategory,
      department: newDept,
      standardFee: Number(newFee) || 0,
      durationMins: Number(newDuration) || 15,
      nabhCode: `NABH-SRV-${Math.floor(100 + Math.random() * 900)}`,
      status: "Active",
      isEmergencyAvailable: newCategory === "Emergency Services",
    };

    setServices((prev) => [newService, ...prev]);
    setIsAddServiceModalOpen(false);
    showToast(`Service "${newService.name}" (${newService.code}) added to hospital tariff!`);

    // Reset form
    setNewCode("");
    setNewName("");
  };

  const handleToggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === "Active" ? "Inactive" : "Active";
          showToast(`Service ${s.name} is now ${newStatus}.`);
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const handleQuickAction = (actionId: string) => {
    setIsQuickMenuOpen(false);
    switch (actionId) {
      case "create_op":
        setIsNewOpModalOpen(true);
        break;
      case "create_ip":
        setIsNewIpModalOpen(true);
        break;
      default:
        showToast(`Action selected: ${actionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeNav="Services"
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link href="/" className="hover:text-slate-600 transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-teal-700 font-bold">Services</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                Hospital Diagnostic &amp; Clinical Services Catalog
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 mr-1" />
                {services.length} Listed Services
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized hospital procedures, imaging tests, surgical packages, NABH codes, and standard price tariffs
            </p>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                showToast("Exporting comprehensive hospital services tariff schedule (Excel/CSV)...");
                setTimeout(() => {
                  showToast("Downloaded carepulse-services-catalog-2026.csv");
                }, 1200);
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Catalog
            </button>

            {currentRole === "cmo" && (
              <button
                onClick={() => setIsAddServiceModalOpen(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service Procedure</span>
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Services Master
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {services.length} Listed
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-teal-700 font-bold">All NABH Coded</span> &amp; active
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Radiology &amp; Imaging
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              19 Procedures
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-blue-700 font-bold">MRI, CT, USG, X-Ray</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Surgical &amp; OT Packages
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              20 Packages
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-purple-700 font-bold">Ortho, Lap, OB-GYN</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Emergency 24/7 Coverage
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              24 / 7
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-rose-700 font-bold">Trauma &amp; Cardiac</span> resuscitation
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services by procedure name, code, dept, or NABH ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Official Hospital Services Tariff Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Component pricing, NABH clinical billing codes, and department allocations
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Service Code &amp; Name</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Avg Duration</th>
                  <th className="py-3 px-4">NABH Code</th>
                  <th className="py-3 px-4 text-right">Standard Tariff</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.slice(0, 25).map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900">
                          {srv.name}
                        </div>
                        <div className="text-[11px] font-mono text-teal-700 font-bold mt-0.5 flex items-center gap-2">
                          <span>{srv.code}</span>
                          {srv.isEmergencyAvailable && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              24/7 ER
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          srv.category === "Radiology & Imaging"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : srv.category === "Surgical & OT"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : srv.category === "Cardiology Procedures"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : srv.category === "Emergency Services"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-teal-50 text-teal-700 border border-teal-200"
                        }`}
                      >
                        {srv.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {srv.department}
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                      {srv.durationMins} mins
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {srv.nabhCode}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        ₹{srv.standardFee.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          srv.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            srv.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        ></span>
                        {srv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(srv.id)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold transition"
                      >
                        {srv.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredServices.length > 25 && (
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center text-xs text-slate-500 font-medium">
              Showing first 25 of {filteredServices.length} listed hospital services. Use search to filter specific records.
            </div>
          )}
        </div>
      </main>

      {/* Add Service Modal */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Register New Service Procedure
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add new test or surgical item to official billing tariff
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddServiceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAD-CT-05"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as HospitalServiceItem["category"]
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Radiology & Imaging">Radiology &amp; Imaging</option>
                    <option value="Surgical & OT">Surgical &amp; OT</option>
                    <option value="Cardiology Procedures">Cardiology Procedures</option>
                    <option value="Allied & Day Care">Allied &amp; Day Care</option>
                    <option value="Emergency Services">Emergency Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Procedure / Investigation Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CT Coronary Angiogram (64-Slice)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Standard Tariff Fee (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    required
                    value={newFee}
                    onChange={(e) => setNewFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Avg Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddServiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Clinical Action Tray Modals */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onActionSelect={handleQuickAction}
      />

      <CreateOpModal
        isOpen={isNewOpModalOpen}
        onClose={() => setIsNewOpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewOpModalOpen(false);
          showToast(`OP consultation generated for ${patient.name}`);
        }}
      />

      <CreateIpModal
        isOpen={isNewIpModalOpen}
        onClose={() => setIsNewIpModalOpen(false)}
        onSuccess={(patient) => {
          setIsNewIpModalOpen(false);
          showToast(`IP admission registered for ${patient.name}`);
        }}
      />
    </div>
  );
}
