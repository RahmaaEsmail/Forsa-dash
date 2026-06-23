import React, { useState } from 'react'
import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import CustomTable from '../../../shared/CustomTable';
import { Input } from '../../../ui/input';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Plus, Trash2, PackagePlus, ToggleLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import CreateProductModal from '../../PurchaseRequests/CreateProductModal';

export default function RFQItemsTable({ items, isEdit = false, prData }) {
  const { control, register, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const watchItems = watch("items") || [];
  const currency = watch("currency_code") || "SAR";

  const columns = [
    {
      title: "Product",
      className: "text-left px-4",
      render: (_, record, index) => {
        const isCustom = !!watchItems[index]?.is_custom;
        const itemName = watchItems[index]?.item_name || record.item_name || "";

        if (isEdit && itemName && !isCustom) {
          return (
            <div className="min-w-[200px] text-left">
              <input
                readOnly
                value={itemName}
                className="w-full bg-transparent border-none h-10 rounded-md text-sm font-medium text-slate-700 cursor-default focus:outline-none"
              />
            </div>
          );
        }

        return (
          <div className="min-w-[220px] text-left space-y-1">
            {isCustom ? (
              <div className="flex items-center gap-1">
                <Input
                  {...register(`items.${index}.item_name`)}
                  placeholder="Enter product name..."
                  className="bg-transparent border h-10 rounded-md text-sm flex-1 focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  title="Create this product in catalog"
                  onClick={() => {
                    setNewProductName(watchItems[index]?.item_name || "");
                    setActiveItemIndex(index);
                    setIsProductModalOpen(true);
                  }}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-md shrink-0"
                >
                  <PackagePlus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Controller
                control={control}
                name={`items.${index}.purchase_request_item_id`}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      const selectedPrItem = prData?.data?.items?.find(i => String(i.id) === String(val));
                      if (selectedPrItem) {
                        setValue(`items.${index}.item_name`, selectedPrItem.item_name || selectedPrItem.item?.name?.en || "");
                        setValue(`items.${index}.specifications`, selectedPrItem.specifications || "");
                        setValue(`items.${index}.unit_name`, selectedPrItem.unit?.name?.en || selectedPrItem.unit?.name?.ar || "");
                        setValue(`items.${index}.unit_price`, 0);
                        setValue(`items.${index}.target_price`, selectedPrItem.target_price || 0);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-transparent border text-sm h-10 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select PR product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {prData?.data?.items?.map(item => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.item_name || item.item?.name?.en || `Item #${item.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            <button
              type="button"
              onClick={() => {
                setValue(`items.${index}.is_custom`, !isCustom);
                if (isCustom) {
                  setValue(`items.${index}.item_name`, "");
                }
              }}
              className="text-[11px] text-slate-400 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <ToggleLeft className="w-3 h-3" />
              {isCustom ? "Select from PR" : "Enter custom item"}
            </button>
          </div>
        );
      }
    },
    {
      title: "Description",
      className: "text-left px-4",
      render: (_, record, index) => (
        <div className="min-w-[200px]">
           <Input
             {...register(`items.${index}.specifications`)}
             placeholder="e.g industrial pipe"
             className="bg-transparent border-none h-10 rounded-md text-sm"
           />
        </div>
      )
    },
    {
      title: "Quantity/Unit",
      className: "px-4",
      render: (_, record, index) => (
        <div className="flex items-center gap-2 min-w-[140px]">
          <Input
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            className="w-16 h-8 bg-transparent border-none text-center"
          />
          <Input
            {...register(`items.${index}.unit_name`)}
            placeholder="Unit"
            className="w-20 h-8 bg-transparent border-b border-gray-200 border-t-0 border-l-0 border-r-0 rounded-none text-sm text-gray-600 focus:ring-0 px-1"
          />
        </div>
      )
    },
    {
      title: "Unit Price",
      className: "px-4",
      render: (_, __, index) => (
        <div className="w-[100px]">
          <Input
            type="number"
            {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
            className="h-8 bg-transparent border-none text-center"
            placeholder="0.00"
          />
        </div>
      )
    },
    {
      title: "Target Price",
      className: "px-4",
      render: (_, __, index) => (
        <div className="w-[100px]">
          <Input
            type="number"
            {...register(`items.${index}.target_price`, { valueAsNumber: true })}
            className="h-8 bg-transparent border-none text-center"
            placeholder="0.00"
          />
        </div>
      )
    },
    {
      title: "Discounts",
      className: "px-4",
      render: (_, __, index) => (
        <div className="w-[80px]">
          <Input
            type="number"
            {...register(`items.${index}.discount`, { valueAsNumber: true })}
            className="h-8 bg-transparent border-none text-center"
            placeholder="0.00"
          />
        </div>
      )
    },
    {
      title: "Total Price",
      className: "px-4",
      render: (_, __, index) => {
        const item = watchItems[index] || {};
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unit_price) || 0;
        const total = qty * price;
        return (
          <div className="w-[100px] text-center text-sm font-semibold text-slate-700">
            {total.toFixed(2)}
          </div>
        );
      }
    },
    {
      title: "",
      className: "px-4",
      render: (_, __, index) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => remove(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )
    }
  ];

  // Calculate Summary
  const subtotalTotal = watchItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unit_price) || 0;
    return acc + (qty * price);
  }, 0);

  const discountTotal = watchItems.reduce((acc, item) => acc + (Number(item.discount) || 0), 0);
  const totalAfterDiscount = subtotalTotal - discountTotal;
  const vatTotal = totalAfterDiscount * 0.15;
  const grandTotal = totalAfterDiscount + vatTotal;

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-transparent p-0 h-auto w-full justify-start border-b rounded-none gap-8">
          <TabsTrigger value="general" className="px-0 py-4 shadow-none! data-[state=active]:shadow-none! rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary text-[#B2B8CF] text-base font-medium">General info</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <CustomTable
                columns={columns}
                dataSource={fields}
                rowKey="id"
                className="border-none p-0"
                tableClassName="w-full border-separate border-spacing-0"
                headerClassName="bg-[#F9FAFB] border-b"
                rowClassName="border-b last:border-b-0"
              />
              <div className="p-4 bg-white flex justify-end gap-3">
                 <Button
                   type="button"
                   variant="destructive"
                   className="bg-red-500 hover:bg-red-600 flex items-center gap-2 h-9"
                   onClick={() => append({
                     purchase_request_item_id: "",
                     item_name: "",
                     specifications: "",
                     quantity: 1,
                     unit_name: "",
                     unit_price: "",
                     target_price: "",
                     discount: "",
                     tax_rate: 15,
                     selected: true,
                     is_custom: false
                   })}
                 >
                    <Plus className="w-4 h-4" /> Add Product
                 </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-secondary">Notes & Conditions</h3>
                <textarea
                  {...register("notes")}
                  className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  placeholder="Write here..."
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-secondary">Terms & Conditions</h3>
                <textarea
                  {...register("terms_and_conditions")}
                  className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  placeholder="Enter terms and conditions..."
                />
              </div>
            </div>

            <div className="bg-white p-6 border rounded-xl shadow-sm space-y-3 h-fit self-start">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total before discount:</span>
                  <span className="font-bold">{subtotalTotal.toFixed(2)} {currency}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Discounts:</span>
                  <span className="font-bold">{discountTotal.toFixed(2)} {currency}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total After Discount:</span>
                  <span className="font-bold">{totalAfterDiscount.toFixed(2)} {currency}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">VAT (15%):</span>
                  <span className="font-bold">{vatTotal.toFixed(2)} {currency}</span>
               </div>
               <div className="flex justify-between items-center pt-3 border-t mt-3">
                  <span className="text-gray-900 font-bold">Total:</span>
                  <span className="text-primary text-xl font-bold">{grandTotal.toFixed(2)} {currency}</span>
               </div>
               <div className="pt-2 text-right">
                  <span className="text-emerald-500 text-sm font-bold">Submit 15</span>
               </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CreateProductModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        initialName={newProductName}
        onCreated={(id, firstUnitId) => {
          if (activeItemIndex !== null) {
            // product was saved to catalog; item_name stays as typed
          }
        }}
      />
    </div>
  )
}
