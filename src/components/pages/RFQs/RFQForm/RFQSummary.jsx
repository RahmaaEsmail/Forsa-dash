import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent } from '../../../ui/card'

export default function RFQSummary() {
  const { register, watch } = useFormContext();
  const items = watch("items") || [];
  const currency = watch("currency_code") || "SAR";

  // Calculate totals (mock calculations for UI demo)
  const subtotal = items.reduce((acc, item) => {
    if (!item.selected) return acc;
    return acc + (Number(item.quantity) * Number(item.target_price || 0));
  }, 0);

  const discount = 0;
  const totalAfterDiscount = subtotal - discount;
  const taxVat = totalAfterDiscount * 0.15;
  const total = totalAfterDiscount + taxVat;

  const Row = ({ label, value, isTotal }) => (
    <div className={`flex justify-between items-center py-1 ${isTotal ? "mt-2 pt-4 border-t border-slate-200" : ""}`}>
      <span className={`text-sm ${isTotal ? "font-bold text-slate-900" : "text-slate-500"}`}>{label}:</span>
      <span className={`text-sm ${isTotal ? "font-bold text-primary text-lg" : "font-medium text-slate-700"}`}>
        {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
      </span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Terms & Conditions:</label>
        <textarea
          {...register("terms_and_conditions")}
          className="w-full min-h-[150px] p-4 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white shadow-sm"
          placeholder="Write here..."
        />
        <div className="flex justify-end">
          <button type="button" className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            Done
          </button>
        </div>
      </div>

      <div className="flex justify-end items-start">
        <div className="w-full max-w-md space-y-1">
          <Row label="Total before discount" value={subtotal} />
          <Row label="Discount" value={discount} />
          <Row label="Total After discount" value={totalAfterDiscount} />
          <Row label="Tax Vat" value={taxVat} />
          <Row label="Total" value={total} isTotal={true} />
        </div>
      </div>
    </div>
  )
}
