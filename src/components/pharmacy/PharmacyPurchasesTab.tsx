"use client";

import React, { useState } from "react";
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  Building,
  IndianRupee,
} from "lucide-react";
import { PharmacyPurchaseOrder } from "@/types";

interface PharmacyPurchasesTabProps {
  purchaseOrders: PharmacyPurchaseOrder[];
  onCreatePo: () => void;
  onReceiveGoods: (poId: string) => void;
}

export const PharmacyPurchasesTab: React.FC<PharmacyPurchasesTabProps> = ({
  purchaseOrders,
  onCreatePo,
  onReceiveGoods,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPos = purchaseOrders.filter((po) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      po.poNumber.toLowerCase().includes(q) ||
      po.supplierName.toLowerCase().includes(q) ||
      po.status.toLowerCase().includes(q)
    );
  });

  const totalProcurement = purchaseOrders.reduce(
    (acc, po) => acc + po.totalAmount,
    0
  );

  return (
    <div className="space-y-4">
      {/* 3 Supplier Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-teal-700" />
            <span>Monthly Procurement Value</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{totalProcurement.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-teal-800 font-semibold mt-1">
            Direct Distributor Bulk Margins (18–24%)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Active Purchase Orders</span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {purchaseOrders.length} Orders
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Sun Pharma, Cipla, GSK
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Goods Received (GRN) Compliance</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            100%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Batch &amp; Expiry barcode verified
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PO number, distributor or status..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCreatePo}
              className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              New Purchase Order
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Pharmaceutical Distributor / C&amp;F</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Expected Delivery</th>
                <th className="py-3 px-4">Item SKUs</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPos.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {po.poNumber}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {po.supplierName}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {po.orderDate}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {po.expectedDate}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {po.itemsCount} Products
                  </td>

                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                    ₹{po.totalAmount.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === "Goods Received (GRN)"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : po.status === "Payment Settled"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {po.status === "Order Placed" ? (
                      <button
                        onClick={() => onReceiveGoods(po.id)}
                        className="px-2.5 py-1 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-[11px] transition shadow-2xs"
                      >
                        Record GRN
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Completed
                      </span>
                    )}
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
