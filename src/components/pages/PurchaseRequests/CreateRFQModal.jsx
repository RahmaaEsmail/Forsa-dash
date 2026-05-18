import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { useForm } from 'react-hook-form'
import CustomInput from '../../shared/CustomInput'
import { DatePickerInput } from '../../shared/CustomInputDate'
import SearchableAsyncSelect from '../../shared/SearchableAsyncSelect'
import { handleGetAllSupplier } from '../../../services/suppliers'
import { handleGetAllPaymentTerms } from '../../../services/purchase-request'
import CustomTable from '../../shared/CustomTable'
import { Input } from '../../ui/input'
import useCreateRFQ from '../../../hooks/purchaseRequest/useCreateRFQ'

export default function CreateRFQModal({ open, onOpenChange, pr }) {
  const { mutate: createRFQ, isPending } = useCreateRFQ();
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      supplier_id: "",
      currency_code: "SAR",
      payment_term_id: "",
      receipt_date: new Date(),
      notes: "",
      items: pr?.items?.map(item => ({
        purchase_request_item_id: item.id,
        item_name: item.item_name || item?.item?.name?.en,
        quantity: item.remaining_quantity || item.quantity,
        max_quantity: item.remaining_quantity || item.quantity,
        selected: true
      })) || []
    }
  });

  const items = watch("items");

  const onSubmit = (values) => {
    const payload = {
      supplier_id: Number(values.supplier_id),
      currency_code: values.currency_code,
      payment_term_id: Number(values.payment_term_id),
      receipt_date: values.receipt_date ? new Date(values.receipt_date).toISOString().split('T')[0] : null,
      notes: values.notes,
      items: values.items
        .filter(item => item.selected && item.quantity > 0)
        .map(item => ({
          purchase_request_item_id: item.purchase_request_item_id,
          quantity: Number(item.quantity)
        }))
    };

    createRFQ({ id: pr.id, body: payload }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  const columns = [
    {
      title: "",
      width: "50px",
      render: (_, __, index) => (
        <input 
          type="checkbox" 
          {...register(`items.${index}.selected`)} 
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
      )
    },
    {
      title: "Item",
      dataIndex: "item_name",
    },
    {
      title: "Quantity",
      render: (_, row, index) => (
        <div className="flex flex-col gap-1">
          <Input 
            type="number"
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            max={row.max_quantity}
            className="w-24 h-8"
          />
          <span className="text-[10px] text-muted-foreground">Max: {row.max_quantity}</span>
        </div>
      )
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create RFQ from PR #{pr?.pr_number}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <SearchableAsyncSelect
              control={control}
              name="supplier_id"
              label="Supplier"
              placeholder="Select supplier"
              isRequired={true}
              fetchFn={handleGetAllSupplier}
              queryKeyPrefix="suppliers"
            />

            <SearchableAsyncSelect
              control={control}
              name="payment_term_id"
              label="Payment Terms"
              placeholder="Select terms"
              isRequired={true}
              fetchFn={handleGetAllPaymentTerms}
              queryKeyPrefix="payment-terms"
            />

            <CustomInput
              register={register}
              name="currency_code"
              label="Currency"
              placeholder="e.g. SAR"
            />

            <DatePickerInput
              control={control}
              name="receipt_date"
              label="Receipt Date"
              placeholder="Select date"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Items to include</label>
            <CustomTable 
              columns={columns}
              dataSource={items}
              rowKey="purchase_request_item_id"
              className="border rounded-lg overflow-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full min-h-[80px] p-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Add internal notes..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create RFQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
