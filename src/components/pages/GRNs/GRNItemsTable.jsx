import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import CustomTable from '../../shared/CustomTable'
import { Input } from '../../ui/input'
import { Card, CardContent } from '../../ui/card'

export default function GRNItemsTable() {
  const { control, register } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: "items"
  });

  const columns = [
    {
      title: "Product",
      className: "text-left px-6",
      render: (_, record) => (
        <div className="text-left font-medium text-slate-900">
          {record.item_name}
        </div>
      )
    },
    {
      title: "Ordered Qty",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center text-slate-600">
          {record.quantity_ordered} <span className="text-xs text-slate-400">{record.unit_name}</span>
        </div>
      )
    },
    {
      title: "Received Qty",
      className: "px-6",
      render: (_, __, index) => (
        <div className="w-[120px] mx-auto">
          <Input 
            type="number"
            {...register(`items.${index}.quantity_received`, { valueAsNumber: true })}
            className="h-9 bg-slate-50 border border-slate-100 text-center rounded-lg focus:ring-primary/20"
            placeholder="0"
          />
        </div>
      )
    }
  ];

  return (
    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <CustomTable
          columns={columns}
          dataSource={fields}
          rowKey="id"
          className="border-none"
        />
      </CardContent>
    </Card>
  );
}
