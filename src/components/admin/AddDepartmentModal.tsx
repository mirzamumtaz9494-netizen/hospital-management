"use client";

import React, { useState } from "react";
import { X, Building2, Plus, MapPin, DollarSign, Bed } from "lucide-react";
import { HospitalDepartmentItem } from "@/types";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDept: HospitalDepartmentItem) => void;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<
    "Clinical" | "Diagnostic" | "Support" | "Administrative"
  >("Clinical");
  const [hodName, setHodName] = useState("");
  const [floorLocation, setFloorLocation] = useState("3rd Floor");
  const [block, setBlock] = useState("Block A (Main Tower)");
  const [bedQuota, setBedQuota] = useState(20);
  const [opFee, setOpFee] = useState(600);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !hodName) return;

    const newDept: HospitalDepartmentItem = {
      id: `dept-${Date.now()}`,
      code: code.toUpperCase().trim(),
      name: name.trim(),
      type,
      hodName: hodName.trim(),
      floorLocation,
      block,
      bedQuota: Number(bedQuota) || 0,
      onDutyDoctors: 2,
      opFee: Number(opFee) || 0,
      status: "Active",
    };

    onSave(newDept);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configure Hospital Department
              </h3>
              <p className="text-xs text-slate-500">
                Register new clinical specialty or diagnostic facility unit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dept Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. ONCO"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono font-bold uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Medical & Surgical Oncology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Classification Type *
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as
                      | "Clinical"
                      | "Diagnostic"
                      | "Support"
                      | "Administrative"
                  )
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-semibold cursor-pointer"
              >
                <option value="Clinical">Clinical</option>
                <option value="Diagnostic">Diagnostic</option>
                <option value="Support">Support</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Head of Department (HOD) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. K. Radhakrishnan"
                value={hodName}
                onChange={(e) => setHodName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Floor Location
              </label>
              <input
                type="text"
                value={floorLocation}
                onChange={(e) => setFloorLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Building Block / Pavilion
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inpatient Bed Quota
              </label>
              <input
                type="number"
                min={0}
                value={bedQuota}
                onChange={(e) => setBedQuota(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default OP Consultation Fee (₹)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={opFee}
                onChange={(e) => setOpFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Save Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
