import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RFQDetailsStats({ rfq }) {
  const currency = rfq?.currency?.code || 'SAR';
  
  const StatRow = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center ${isTotal ? "pt-2" : "py-1"}`}>
      <span className={`text-sm ${isTotal ? "font-bold text-slate-900" : "text-slate-500"}`}>{label}</span>
      <span className={`${isTotal ? "text-xl font-bold text-primary" : "text-sm font-semibold text-slate-700"}`}>
        {Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[10px] ml-0.5 opacity-70 font-normal uppercase">{currency}</span>
      </span>
    </div>
  );

  return (
    <Card className="border-none shadow-sm bg-primary/5">
      <CardContent className="p-6 space-y-3">
        <StatRow label="Subtotal" value={rfq.subtotal} />
        <StatRow label="Discount" value={rfq.discount_amount} />
        <StatRow label="VAT Amount" value={rfq.vat_amount} />
        <Separator className="bg-primary/10" />
        <StatRow label="Total Amount" value={rfq.total_amount} isTotal={true} />
      </CardContent>
    </Card>
  );
}
