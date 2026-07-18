import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import CustomInput from "../../shared/CustomInput";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAddSupplier } from "../../../services/suppliers";
import { toast } from "sonner";

export default function CreateSupplierModal({
  open,
  onOpenChange,
  initialName,
  onCreated,
}) {
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      company_name: "",
      vat_number: "",
      commercial_register: "",
      address_label: "Main Office",
      address_line_1: "",
      city: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      methods.reset({
        company_name: initialName || "",
        vat_number: "",
        commercial_register: "",
        address_label: "Main Office",
        address_line_1: "",
        city: "",
      });
    }
  }, [open, initialName, methods]);

  const { mutate, isPending } = useMutation({
    mutationFn: handleAddSupplier,
    onSuccess: (res) => {
      toast.success("Supplier created successfully");
      queryClient.invalidateQueries(["suppliers"]);
      const newId = res?.data?.id ?? res?.id;
      if (onCreated && newId) {
        onCreated(newId);
      }
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to create supplier");
    },
  });

  const onSubmit = (data) => {
    if (!data.company_name) {
      toast.error("Company name is required");
      return;
    }
    if (!data.city) {
      toast.error("City is required");
      return;
    }

    const payload = {
      company_name: data.company_name,
      vat_number: data.vat_number || "",
      commercial_register: data.commercial_register || "",
      language: "ar",
      source_of_supply: "SA",
      is_active: true,
      addresses: [
        {
          type: "both",
          label: data.address_label || "Main Office",
          address_line_1: data.address_line_1 || "",
          address_line_2: "",
          city: data.city,
          state: "",
          postal_code: "",
          country: "Saudi Arabia",
          is_default: true,
        },
      ],
      // Fallback fields for backend compatibility
      code: "",
      first_name: "",
      last_name: "",
      name: {
        en: data.company_name,
        ar: "",
      },
      email: "",
      phone: "",
      mobile: "",
      website: "",
      tax_treatment: "",
      lead_time_days: "",
      minimum_order_value: "",
      rating: "",
      notes: "",
      category_ids: [],
      payment_terms: [],
      contacts: [],
      bank_accounts: [],
    };

    mutate({ body: payload });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Supplier</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              register={methods.register}
              name="company_name"
              label="Company Name"
              isRequired
              errors={methods.formState.errors.company_name}
              placeholder="Enter company name"
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                register={methods.register}
                name="vat_number"
                label="VAT Number"
                errors={methods.formState.errors.vat_number}
                placeholder="Enter VAT number"
              />
              <CustomInput
                register={methods.register}
                name="commercial_register"
                label="Commercial Register"
                errors={methods.formState.errors.commercial_register}
                placeholder="Enter commercial register"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                register={methods.register}
                name="address_label"
                label="Address Label"
                errors={methods.formState.errors.address_label}
                placeholder="e.g. Main Office, Warehouse"
              />
              <CustomInput
                register={methods.register}
                name="city"
                label="City"
                isRequired
                errors={methods.formState.errors.city}
                placeholder="Enter city"
              />
            </div>

            <CustomInput
              register={methods.register}
              name="address_line_1"
              label="Address Line"
              errors={methods.formState.errors.address_line_1}
              placeholder="e.g. Street, Building No."
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Save Supplier"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
