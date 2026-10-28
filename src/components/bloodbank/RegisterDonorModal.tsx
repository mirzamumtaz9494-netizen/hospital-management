"use client";

import React, { useState } from "react";
import { X, Droplet, User, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { BloodDonor, BloodGroup } from "@/types";

interface RegisterDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (donor: BloodDonor) => void;
}

export const RegisterDonorModal: React.FC<RegisterDonorModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    age: 28,
    gender: "M" as "M" | "F" | "Other",
    bloodGroup: "O+" as BloodGroup,
    phone: "",
    email: "",
    city: "Hyderabad",
    weightKg: 68,
    hemoglobin: 13.5,
    emergencyConsent: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const newDonor: BloodDonor = {
      id: `dnr-${Date.now()}`,
      donorNumber: `DNR-${Math.floor(1100 + Math.random() * 50)}`,
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      weightKg: formData.weightKg,
      hemoglobin: formData.hemoglobin,
      lastDonationDate: "Never / First Time",
      totalDonations: 0,
      status: formData.hemoglobin >= 12.5 && formData.weightKg >= 50 ? "Eligible" : "Deferred (Low Hb)",
      emergencyConsent: formData.emergencyConsent,
    };

    onRegister(newDonor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Droplet className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Register Voluntary Blood Donor</h3>
              <p className="text-[11px] text-slate-500">Record donor vitals and emergency contact consent.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 focus:bg-white"
              >
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Age (Years)</label>
              <input
                type="number"
                min={18}
                max={65}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Weight (kg)</label>
              <input
                type="number"
                min={45}
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
              <span className="text-[10px] text-slate-400">Min 50 kg for blood draw</span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Hemoglobin (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={formData.hemoglobin}
                onChange={(e) => setFormData({ ...formData, hemoglobin: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400">Min 12.5 g/dL required</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">City / Locality</label>
              <input
                type="text"
                placeholder="e.g. Jubilee Hills"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="consent"
              checked={formData.emergencyConsent}
              onChange={(e) => setFormData({ ...formData, emergencyConsent: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="consent" className="text-slate-600 font-medium">
              Consent to receive urgent hospital emergency callouts for critical patients.
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
            >
              Save Donor Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
