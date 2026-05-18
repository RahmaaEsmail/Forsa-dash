import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { useForm } from "react-hook-form"
import { useCreateDeliveryType, useUpdateDeliveryType } from "../../../hooks/delivery-notes/useDeliveryTypeMutations"
import { Switch } from "../../ui/switch"

export default function DeliveryTypeModal({ open, onOpenChange, editingType = null }) {
  const createMutation = useCreateDeliveryType();
  const updateMutation = useUpdateDeliveryType();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name_en: "",
      name_ar: "",
      code: "",
      description_en: "",
      description_ar: "",
      order: 1,
      is_active: true
    }
  });

  const isActive = watch("is_active");

  useEffect(() => {
    if (editingType) {
      reset({
        name_en: editingType.name?.en || "",
        name_ar: editingType.name?.ar || "",
        code: editingType.code || "",
        description_en: editingType.description?.en || "",
        description_ar: editingType.description?.ar || "",
        order: editingType.order || 1,
        is_active: !!editingType.is_active
      });
    } else {
      reset({
        name_en: "",
        name_ar: "",
        code: "",
        description_en: "",
        description_ar: "",
        order: 1,
        is_active: true
      });
    }
  }, [editingType, reset]);

  const onSubmit = (data) => {
    const payload = {
      name: { en: data.name_en, ar: data.name_ar },
      code: data.code,
      description: { en: data.description_en, ar: data.description_ar },
      order: Number(data.order),
      is_active: data.is_active
    };

    if (editingType) {
      updateMutation.mutate({ id: editingType.id, body: payload }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50/80 border-b">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {editingType ? "Edit Delivery Type" : "Add New Delivery Type"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name_en">Name (EN) *</Label>
              <Input 
                id="name_en" 
                {...register("name_en", { required: "Name (EN) is required" })} 
                className="rounded-xl border-slate-200 h-11"
              />
              {errors.name_en && <p className="text-xs text-red-500">{errors.name_en.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">Name (AR) *</Label>
              <Input 
                id="name_ar" 
                {...register("name_ar", { required: "Name (AR) is required" })} 
                dir="rtl"
                className="rounded-xl border-slate-200 h-11"
              />
              {errors.name_ar && <p className="text-xs text-red-500">{errors.name_ar.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input 
                id="code" 
                {...register("code", { required: "Code is required" })} 
                className="rounded-xl border-slate-200 h-11 uppercase"
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input 
                id="order" 
                type="number"
                {...register("order")} 
                className="rounded-xl border-slate-200 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">Description (EN)</Label>
            <Input 
              id="description_en" 
              {...register("description_en")} 
              className="rounded-xl border-slate-200 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_ar">Description (AR)</Label>
            <Input 
              id="description_ar" 
              {...register("description_ar")} 
              dir="rtl"
              className="rounded-xl border-slate-200 h-11"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="space-y-0.5">
              <Label className="text-base font-bold">Active Status</Label>
              <p className="text-sm text-slate-500">Enable or disable this delivery type</p>
            </div>
            <Switch 
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-11 px-6 border-slate-200 font-bold"
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-bold"
            >
              {editingType ? "Save Changes" : "Create Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
