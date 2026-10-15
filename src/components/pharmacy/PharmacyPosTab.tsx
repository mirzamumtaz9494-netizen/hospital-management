"use client";

import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Printer,
  Sparkles,
  CheckCircle2,
  IndianRupee,
  Barcode,
  Pill,
} from "lucide-react";
import { MedicineItem, PharmacyOrder, PharmacyRxItem } from "@/types";

interface CartItem extends PharmacyRxItem {
  stockAvailable: number;
}

interface PharmacyPosTabProps {
  medicines: MedicineItem[];
  onCompleteSale: (newOrder: PharmacyOrder) => void;
}

export const PharmacyPosTab: React.FC<PharmacyPosTabProps> = ({
  medicines,
  onCompleteSale,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Customer Demographics
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("");
  const [doctorName, setDoctorName] = useState("Self / Retail OTC");
  const [paymentMode, setPaymentMode] = useState<string>("UPI");
  const [discountPercent, setDiscountPercent] = useState<number>(5);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "cart-1",
      medicineId: "med-5",
      medicineName: "Dolo 650 Tablet",
      genericName: "Paracetamol 650mg",
      dosage: "1 Tab",
      frequency: "As needed",
      duration: "1 Strip",
      quantity: 15,
      batchNo: "DLO-774",
      expiryDate: "05/2028",
      unitPrice: 2.26,
      totalPrice: 34,
      stockAvailable: 580,
    },
    {
      id: "cart-2",
      medicineId: "med-2",
      medicineName: "Pan 40 Tablet",
      genericName: "Pantoprazole 40mg",
      dosage: "1 Tab",
      frequency: "Once Daily",
      duration: "1 Strip",
      quantity: 10,
      batchNo: "PAN-881",
      expiryDate: "08/2027",
      unitPrice: 14.5,
      totalPrice: 145,
      stockAvailable: 340,
    },
  ]);

  const categories = [
    "All",
    "Antibiotics",
    "Analgesics & Pain",
    "Cardiovascular",
    "Gastrointestinal",
    "Antidiabetic",
    "Respiratory",
    "IV Fluids & Infusions",
  ];

  const filteredMedicines = medicines.filter((m) => {
    if (selectedCategory !== "All" && m.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.batchNo.toLowerCase().includes(q)
    );
  });

  const addToCart = (med: MedicineItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicineId === med.id);
      if (existing) {
        return prev.map((item) =>
          item.medicineId === med.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.unitPrice,
              }
            : item
        );
      } else {
        const unitPrice = med.mrp / (med.dosageForm === "Tablet" ? 10 : 1);
        return [
          ...prev,
          {
            id: `item-${Date.now()}-${med.id}`,
            medicineId: med.id,
            medicineName: med.name,
            genericName: med.genericName,
            dosage: "1 Unit",
            frequency: "As directed",
            duration: "Course",
            quantity: 1,
            batchNo: med.batchNo,
            expiryDate: med.expiryDate,
            unitPrice: med.mrp,
            totalPrice: med.mrp,
            stockAvailable: med.stockQuantity,
          },
        ];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? {
                  ...item,
                  quantity: newQty,
                  totalPrice: newQty * item.unitPrice,
                }
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = taxableAmount * 0.12; // 12% GST average pharma rate
  const grandTotal = Math.round(taxableAmount + gstAmount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty. Please add items to checkout.");
      return;
    }

    const orderNo = `RX-${Math.floor(7710 + Math.random() * 50)}`;
    const billNo = `PHB-${Math.floor(5020 + Math.random() * 50)}`;

    const newOrder: PharmacyOrder = {
      id: `pos-${Date.now()}`,
      rxNumber: orderNo,
      billNumber: billNo,
      patientName: customerName.trim() || "Retail Customer",
      initials: customerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "RC",
      mrId: `MR-${Math.floor(10460 + Math.random() * 50)}`,
      opIpNumber: `WLK-${Math.floor(120 + Math.random() * 50)}`,
      age: 35,
      gender: "M",
      phone: customerPhone || "9876543210",
      prescribingDoctor: doctorName,
      source: "Retail Walk-in",
      orderDate: "Today",
      orderTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: cart,
      subtotal,
      discount: discountAmount,
      tax: gstAmount,
      netTotal: grandTotal,
      paymentStatus: "Paid",
      paymentMode,
      dispenseStatus: "Dispensed",
      dispensedBy: "Chief Pharmacist V. Murthy",
      dispensedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes: "Direct Point of Sale (POS) retail transaction.",
    };

    onCompleteSale(newOrder);
    setCart([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Medicine Catalog Browser (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Search & Category Filter */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-800" />
              Formulary Drug Catalog
            </span>
            <span className="text-[11px] text-slate-500">
              {filteredMedicines.length} Medicines Found
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, generic molecule, or batch..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[68vh] overflow-y-auto pr-1">
          {filteredMedicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">
                      {med.code} • {med.dosageForm}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-0.5 group-hover:text-teal-800 transition">
                      {med.name}
                    </h4>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-xs shrink-0">
                    ₹{med.mrp}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1 mt-1" title={med.genericName}>
                  {med.genericName}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                  <span>Batch: {med.batchNo}</span>
                  <span>Exp: {med.expiryDate}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    med.stockQuantity <= med.minReorderLevel
                      ? "bg-rose-100 text-rose-700 font-semibold"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Stock: {med.stockQuantity}
                </span>

                <button
                  onClick={() => addToCart(med)}
                  className="px-2.5 py-1 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: POS Cash Counter Cart (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-teal-800" />
              <h3 className="font-bold text-slate-900 text-sm">
                Retail Cash Counter / POS
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {cart.length} Items
            </span>
          </div>

          {/* Customer Inputs */}
          <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-slate-500 text-[10px] font-semibold block mb-0.5">
                Customer / Patient
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-500 text-[10px] font-semibold block mb-0.5">
                Phone Number
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="p-4 space-y-2 max-h-[36vh] overflow-y-auto divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-600">Cart is empty</p>
                <p className="text-slate-400">Click &quot;Add&quot; on medicines from the catalog</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-bold text-slate-900 truncate">
                      {item.medicineName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Batch {item.batchNo} • ₹{item.unitPrice.toFixed(1)}/unit
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold w-6 text-center text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Total & Delete */}
                  <div className="text-right shrink-0 ml-3">
                    <div className="font-mono font-black text-slate-900 text-xs">
                      ₹{Math.round(item.totalPrice)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Checkout Summary */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Discount ({discountPercent}%):</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                  className="w-12 px-1 py-0.5 text-right font-mono text-xs bg-white border border-slate-200 rounded"
                />
                <span className="font-mono text-emerald-700 font-semibold">
                  -₹{discountAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>GST (12%):</span>
              <span className="font-mono">₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="font-mono text-lg text-teal-800">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Payment Mode Selector */}
            <div className="pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["UPI", "Cash", "Card"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-1.5 rounded-lg font-bold text-xs border transition ${
                      paymentMode === mode
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                cart.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-teal-800 hover:bg-teal-900 text-white shadow-teal-800/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Sale &amp; Print Tax Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
