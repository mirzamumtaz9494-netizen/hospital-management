"use client";

import React, { useState } from "react";
import { X, Plus, Pill, ShieldCheck } from "lucide-react";
import { MedicineItem, MedicineCategory, MedicineDosageForm, MedicineSchedule } from "@/types";

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine: (newMed: MedicineItem) => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onAddMedicine,
}) => {
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState<MedicineCategory>("Antibiotics");
  const [dosageForm, setDosageForm] = useState<MedicineDosageForm>("Tablet");
  const [strength, setStrength] = useState("500mg");
  const [manufacturer, setManufacturer] = useState("Sun Pharma");
  const [batchNo, setBatchNo] = useState("BATCH-101");
  const [expiryDate, setExpiryDate] = useState("12/2027");
  const [stockQuantity, setStockQuantity] = useState("100");
  const [minReorderLevel, setMinReorderLevel] = useState("25");
  const [unitCost, setUnitCost] = useState("80");
  const [mrp, setMrp] = useState("110");
  const [schedule, setSchedule] = useState<MedicineSchedule>("Schedule H");
  const [rackLocation, setRackLocation] = useState("Rack B-02");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter medicine brand name");
      return;
    }

    const newMed: MedicineItem = {
      id: `med-${Date.now()}`,
      code: `MED-${Math.floor(120 + Math.random() * 50)}`,
      name,
      genericName,
      category,
      dosageForm,
      strength,
      manufacturer,
      batchNo,
      expiryDate,
      stockQuantity: parseInt(stockQuantity, 10) || 100,
      minReorderLevel: parseInt(minReorderLevel, 10) || 25,
      unitCost: parseFloat(unitCost) || 80,
      mrp: parseFloat(mrp) || 110,
      schedule,
      rackLocation,
      status: "In Stock",
    };

    onAddMedicine(newMed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-800">
              <Pill className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Add Pharmaceutical Item to Formulary
              </h3>
              <p className="text-xs text-slate-500">
                Specify chemical molecule, batch info, pricing &amp; reorder threshold
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Medicine Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ciprobid 500"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Generic Molecule Name
              </label>
              <input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="e.g. Ciprofloxacin 500mg"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MedicineCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="Antibiotics">Antibiotics</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Analgesics & Pain">Analgesics &amp; Pain</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Respiratory">Respiratory</option>
                <option value="IV Fluids & Infusions">IV Fluids &amp; Infusions</option>
                <option value="Surgical & Consumables">Surgical &amp; Consumables</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Dosage Form</label>
              <select
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value as MedicineDosageForm)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Injection">Injection</option>
                <option value="Syrup">Syrup</option>
                <option value="IV Infusion">IV Infusion</option>
                <option value="Ointment">Ointment</option>
                <option value="Inhaler">Inhaler</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Schedule</label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value as MedicineSchedule)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="OTC">OTC (Over the Counter)</option>
                <option value="Schedule H">Schedule H</option>
                <option value="Schedule H1">Schedule H1 (Controlled)</option>
                <option value="Narcotic">Narcotic</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Batch Number</label>
              <input
                type="text"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YYYY"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Initial Stock Qty</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Min Reorder Level</label>
              <input
                type="number"
                value={minReorderLevel}
                onChange={(e) => setMinReorderLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Unit MRP (₹)</label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Rack / Storage Bin</label>
              <input
                type="text"
                value={rackLocation}
                onChange={(e) => setRackLocation(e.target.value)}
                placeholder="Rack A-01"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Save Medicine to Formulary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
