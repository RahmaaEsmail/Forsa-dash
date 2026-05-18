import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import CustomTable from '../../../shared/CustomTable';
import { Input } from '../../../ui/input';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import SearchableAsyncSelect from '../../../shared/SearchableAsyncSelect';
import { handleGetAllProducts } from '../../../../services/products';

export default function RFQItemsTable({ items, isEdit = false }) {
  const { control, register, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  console.log("items", items);
  const watchItems = watch("items") || [];
  const currency = watch("currency_code") || "SAR";

  const handleProductSelect = (product, index) => {
    console.log("product", product);
    if (product) {
      setValue(`items.${index}.item_name`, product.name?.en || product.name?.ar || product.name || "");
      setValue(`items.${index}.specifications`, product.description || "");
      if (product.units && product.units.length > 0) {
        setValue(`items.${index}.unit_name`, product.units[0].name?.en || product.units[0].name?.ar || "");
      } else {
        setValue(`items.${index}.unit_name`, "");
      }
      setValue(`items.${index}.unit_price`, product.selling_price || product.cost_price || "");
      setValue(`items.${index}.target_price`, product.target_price || product.cost_price || "");
    } else {
      setValue(`items.${index}.item_name`, "");
      setValue(`items.${index}.specifications`, "");
      setValue(`items.${index}.unit_name`, "");
      setValue(`items.${index}.unit_price`, "");
      setValue(`items.${index}.target_price`, "");
    }
  };

  const columns = [
    {
      title: "Product",
      className: "text-left px-4",
      render: (_, record, index) => (
        <div className="min-w-[200px] text-left">
          <SearchableAsyncSelect
            control={control}
            name={`items.${index}.purchase_request_item_id`}
            placeholder="Search product..."
            fetchFn={handleGetAllProducts}
            queryKeyPrefix="products"
            onSelectOption={(prod) => handleProductSelect(prod, index)}
          />
        </div>
      )
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
      render: (_, record, index) => {
        const unitName = watchItems[index]?.unit_name || record.unit_name || "";
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              className="w-16 h-8 bg-transparent border-none text-center"
            />
            <span className="text-sm text-gray-500">{unitName}</span>
          </div>
        );
      }
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
    // {
    //   title: "Subtotal",
    //   className: "px-4",
    //   render: (_, record) => {
    //     const qty = Number(record.quantity) || 0;
    //     const price = Number(record.unit_price) || 0;
    //     const discount = Number(record.discount) || 0;
    //     const subtotal = (qty * price) - discount;
    //     return <div className="text-center text-sm font-medium">{subtotal.toFixed(2)}</div>;
    //   }
    // },
    // {
    //   title: "Tax Amount",
    //   className: "px-4",
    //   render: (_, record) => {
    //     const qty = Number(record.quantity) || 0;
    //     const price = Number(record.unit_price) || 0;
    //     const discount = Number(record.discount) || 0;
    //     const subtotal = (qty * price) - discount;
    //     const tax = subtotal * 0.15; // 15% VAT
    //     return <div className="text-center text-sm font-medium">{tax.toFixed(2)}</div>;
    //   }
    // },
    // {
    //   title: "Total",
    //   className: "px-4",
    //   render: (_, record) => {
    //     const qty = Number(record.quantity) || 0;
    //     const price = Number(record.unit_price) || 0;
    //     const discount = Number(record.discount) || 0;
    //     const subtotal = (qty * price) - discount;
    //     const tax = subtotal * 0.15;
    //     const total = subtotal + tax;
    //     return <div className="text-center text-sm font-bold">{total.toFixed(2)}</div>;
    //   }
    // },
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
          {/* <TabsTrigger value="pricing" className="px-0 py-4 shadow-none! data-[state=active]:shadow-none! rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary text-[#B2B8CF] text-base font-medium">Pricing</TabsTrigger> */}
          {/* <TabsTrigger value="comparison" className="px-0 py-4 shadow-none! data-[state=active]:shadow-none! rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary text-[#B2B8CF] text-base font-medium">Prices comparison list</TabsTrigger> */}
          {/* <TabsTrigger value="inventory" className="px-0 py-4 shadow-none! data-[state=active]:shadow-none! rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary text-[#B2B8CF] text-base font-medium">Inventory & Procurement</TabsTrigger> */}
          {/* <TabsTrigger value="attachments" className="px-0 py-4 shadow-none! data-[state=active]:shadow-none! rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary text-[#B2B8CF] text-base font-medium">Attachments</TabsTrigger> */}
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
                     selected: true
                   })}
                 >
                    <Plus className="w-4 h-4" /> Add Product
                 </Button>
                 {/* <Button variant="destructive" className="bg-red-500 hover:bg-red-600 flex items-center gap-2 h-9">
                    <Plus className="w-4 h-4" /> Add section
                 </Button> */}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-secondary">Notes & Conditions</h3>
              <textarea
                {...register("notes")}
                className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                placeholder="Write here..."
              />
              {/* <div className="flex justify-end">
                 <Button className="bg-red-500 hover:bg-red-600 h-9 px-6">Done</Button>
              </div> */}
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
    </div>
  )
}

