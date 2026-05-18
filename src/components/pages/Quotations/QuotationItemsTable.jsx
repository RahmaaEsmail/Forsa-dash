import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import CustomTable from '../../shared/CustomTable';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Trash2, Info, CreditCard } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';

export default function QuotationItemsTable({items, isReadOnly = false, onUpdatePrices, isUpdatingPrices }) {
  const { control, register, watch, setValue } = useFormContext();
  const { fields, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch("items") || [];
  const currency = watch("currency_code") || "SAR";

  const columns = [
    {
      title: "Product",
      className: "text-left px-4",
      render: (_, record, index) => (
        <div className="min-w-[150px] text-left">
           <span className="text-sm font-medium text-slate-900">{record.item_name}</span>
           <div className="text-[10px] text-slate-400">ID: {record.rfq_item_id}</div>
        </div>
      )
    },
    {
      title: "Quantity",
      className: "px-4",
      render: (_, record, index) => (
        <div className="flex items-center gap-2 min-w-[80px]">
          <Input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            disabled={isReadOnly}
            className="w-20 h-8 bg-transparent border-slate-200 text-center rounded-md disabled:opacity-80"
          />
          <span className="text-xs text-slate-400">{record.unit_name}</span>
        </div>
      )
    },
    {
      title: "Cost Price",
      className: "px-4",
      render: (_, __, index) => (
        <div className="w-[100px]">
          <Input 
            type="number"
            {...register(`items.${index}.cost_price`, { valueAsNumber: true })}
            disabled={isReadOnly}
            className="h-8 bg-transparent border-slate-200 text-center rounded-md disabled:opacity-80"
            placeholder="0.00"
          />
        </div>
      )
    },
    {
      title: "Selling Price",
      className: "px-4",
      render: (_, __, index) => (
        <div className="w-[100px]">
          <Input 
            type="number"
            {...register(`items.${index}.selling_price`, { valueAsNumber: true })}
            disabled={isReadOnly}
            className="h-8 bg-transparent border-slate-200 text-center rounded-md font-bold text-primary disabled:opacity-80"
            placeholder="0.00"
          />
        </div>
      )
    },
    {
      title: "Tax %",
      className: "px-4",
      render: (_, __, index) => (
        <div className="w-[70px]">
          <Input 
            type="number"
            {...register(`items.${index}.tax_rate`, { valueAsNumber: true })}
            disabled={isReadOnly}
            className="h-8 bg-transparent border-slate-200 text-center rounded-md disabled:opacity-80"
            placeholder="15"
          />
        </div>
      )
    },
    {
      title: "Available",
      className: "px-4 text-center",
      render: (_, __, index) => (
        <div className="flex justify-center">
            <Checkbox 
                checked={watch(`items.${index}.available`)}
                onCheckedChange={(checked) => !isReadOnly && setValue(`items.${index}.available`, checked)}
                disabled={isReadOnly}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary disabled:opacity-80"
            />
        </div>
      )
    },
    {
      title: "Subtotal",
      className: "px-4 text-right",
      render: (_, record) => {
        const qty = Number(record.quantity) || 0;
        const price = Number(record.selling_price) || 0;
        const subtotal = qty * price;
        return <div className="text-right text-sm font-medium">{subtotal.toFixed(2)}</div>;
      }
    },
    {
      title: "",
      className: "px-4 text-right",
      render: (_, __, index) => (
        !isReadOnly && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => remove(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )
      )
    }
  ];

  // Calculate Summary
  const subtotalTotal = watchItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.selling_price) || 0;
    return acc + (qty * price);
  }, 0);

  const vatTotal = watchItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.selling_price) || 0;
    const taxRate = Number(item.tax_rate) || 0;
    return acc + (qty * price * (taxRate / 100));
  }, 0);

  const grandTotal = subtotalTotal + vatTotal;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <div className="p-5 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-none rounded-md px-2">Items</Badge>
                Quotation Items List
            </h3>

            {onUpdatePrices && !isReadOnly && (
              <Button 
                onClick={onUpdatePrices}
                disabled={isUpdatingPrices}
                variant="outline"
                className="h-9 px-4 rounded-xl border-blue-200 text-blue-600 font-bold hover:bg-blue-50 gap-2 text-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                {isUpdatingPrices ? "Updating Prices..." : "Update Selling Prices"}
              </Button>
            )}
        </div>
        <CardContent className="p-0">
          <CustomTable
            columns={columns}
            dataSource={fields}
            rowKey="id"
            className="border-none p-0"
            tableClassName="w-full border-separate border-spacing-0"
            headerClassName="bg-slate-50 text-slate-500 border-b uppercase text-[10px] tracking-wider"
            rowClassName="border-b last:border-b-0 hover:bg-slate-50/50 transition-colors"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Additional Notes
                </h3>
                <textarea
                    {...register("notes")}
                    disabled={isReadOnly}
                    className="w-full min-h-[120px] p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-80"
                    placeholder="Enter any specific terms, conditions or general notes for this quotation..."
                />
            </div>
        </div>

        {/* <div className="bg-white p-8 border border-slate-100 rounded-2xl shadow-sm space-y-4 h-fit self-start">
           <h3 className="text-sm font-bold text-slate-900 border-b pb-4 mb-4">Summary</h3>
           <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-bold text-slate-900">{subtotalTotal.toFixed(2)} {currency}</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">VAT (calculated):</span>
              <span className="font-bold text-slate-900">{vatTotal.toFixed(2)} {currency}</span>
           </div>
           <div className="flex justify-between items-center pt-4 border-t mt-4">
              <span className="text-slate-900 font-bold text-base">Grand Total:</span>
              <span className="text-primary text-2xl font-bold">{grandTotal.toFixed(2)} {currency}</span>
           </div>
           
           <div className="pt-4">
               <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                   <span className="text-emerald-700 text-xs font-medium">Ready for submission</span>
                   <Badge className="bg-emerald-500 text-white border-none">{fields.length} Items</Badge>
               </div>
           </div>
        </div> */}
      </div>
    </div>
  )
}
