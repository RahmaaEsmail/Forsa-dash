import React, { useEffect } from "react"
import { Card } from "../../ui/card"
import CustomInput from "../../shared/CustomInput"
import { useFormContext, useFieldArray } from "react-hook-form"
import { DatePickerInput } from "../../shared/CustomInputDate"
import SearchableAsyncSelect from "../../shared/SearchableAsyncSelect"
import { handleGetAllQuotations } from "../../../services/quotations"
import { useQuotationDetails } from "../../../hooks/quotations/useQuotationDetails"
import { handleGetAllCustomers } from "../../../services/customers"
import { handleGetAllUnits } from "../../../services/units"
import { handleGetAllProducts } from "../../../services/products"
import { Button } from "../../ui/button"
import { Trash2, Plus, FileText, Calendar, MapPin, Phone, Info, Package } from 'lucide-react'
import { Badge } from "../../ui/badge"
import CustomTable from "../../shared/CustomTable"
import { Input } from "../../ui/input"
import { useListQuotations } from "../../../hooks/quotations/useListQuotations"
import { useListCustomers } from "../../../hooks/customers/useListCustomers"
import { useListDeliveryTypes } from "../../../hooks/delivery-notes/useListDeliveryTypes"
import CustomSelect from "../../shared/CustomSelect"

export default function DeliveryNoteForm({ isReadOnly = false, isEdit = false }) {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const selectedQuotationId = watch("quotation_id");

  const { data: quotationResponse } = useQuotationDetails(selectedQuotationId);
  const { data: quotation_data } = useListQuotations();
  const { data: customers_data } = useListCustomers();
  const { data: delivery_types_data } = useListDeliveryTypes();

  // Fetch Quotation details when Quotation is selected to populate items
  useEffect(() => {
    if (quotationResponse?.data && !isReadOnly && !isEdit) {
      const quotation = quotationResponse.data;
      const formattedItems = quotation.items?.map(item => ({
        quotation_item_id: item.id,
        item_name: item.item_name || item.item?.name,
        quantity: item.quantity,
        unit_name: item.unit?.name
      })) || [];
      
      setValue("items", formattedItems);
    }
  }, [quotationResponse, setValue, isReadOnly, isEdit]);

  const columns = [
    {
      title: "Product",
      className: "text-left px-6",
      render: (_, record) => (
        <div className="text-left font-medium text-slate-900">
          {record.item_name || 'Item'}
        </div>
      )
    },
    {
      title: "Quantity",
      className: "px-6",
      render: (_, __, index) => (
        <div className="min-w-[100px] flex items-center gap-2">
          <Input 
            type="number" 
            {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
            className="bg-slate-50 border-none h-11 rounded-xl text-center font-bold w-24"
            disabled={isReadOnly}
          />
          <span className="text-xs text-slate-400 font-medium">{fields[index]?.unit_name}</span>
        </div>
      )
    },
    isReadOnly && {
      title: "Delivered",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-emerald-600">
          {record.quantity_delivered || "0.00"} <span className="text-xs text-slate-400">{record.unit_name}</span>
        </div>
      )
    },
    {
      title: "",
      width: "50px",
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

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-0 border-none shadow-sm overflow-hidden bg-white rounded-2xl">
        <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h2 className="text-slate-900 font-bold text-lg">Delivery Information</h2>
                <p className="text-slate-500 text-xs mt-0.5">Basic details for the delivery note</p>
            </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <CustomSelect
              control={control}
              name="quotation_id"
              label="Select Quotation"
              placeholder="Select Quotation..."
              isRequired={true}
              disabled={isReadOnly}
              options={quotation_data?.data?.map(q => ({
                value: q.id.toString(),
                label: `#${q.quotation_number} - ${q.customer?.company_name || 'No Customer'}`,
                textValue: q.quotation_number
              })) || []}
              errors={errors?.quotation_id}
            />

            <DatePickerInput
              control={control}
              name="delivery_date"
              label="Delivery Date"
              placeholder="Select date"
              disabled={isReadOnly}
              icon={<Calendar className="w-4 h-4 text-slate-400" />}
            />

            <div className="col-span-full">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Notes</label>
                <textarea
                    {...register("notes")}
                    disabled={isReadOnly}
                    className="w-full min-h-[100px] p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-80"
                    placeholder="Enter any additional delivery instructions..."
                />
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <div className="p-5 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-none rounded-md px-2">Items</Badge>
                Delivery Items
            </h3>
            {!isReadOnly && (
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 rounded-lg border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => append({ item_id: "", quantity: 1, unit_id: "", description: "", notes: "" })}
                >
                    <Plus className="w-4 h-4" /> Add Item
                </Button>
            )}
        </div>
        <div className="p-0">
          <CustomTable
            columns={columns.filter(Boolean)}
            dataSource={fields}
            rowKey="id"
            className="border-none p-0"
            tableClassName="w-full border-separate border-spacing-0"
            headerClassName="bg-slate-50 text-slate-500 border-b uppercase text-[10px] tracking-wider"
            rowClassName="border-b last:border-b-0 hover:bg-slate-50/50 transition-colors"
          />
        </div>
      </Card>
    </div>
  )
}
