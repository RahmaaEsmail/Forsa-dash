import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import CustomInput from "../../shared/CustomInput";
import CustomSelect from "../../shared/CustomSelect";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleAddCustomer } from "../../../services/customers";
import { toast } from "sonner";

export default function CreateCustomerModal({
  open,
  onOpenChange,
  initialName,
  onCreated,
}) {
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      customer_type: "company",
      company_name: "",
      commercial_register: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address_label: "Main Office",
      address_line_1: "",
      city: "",
    },
  });

  const customerType = useWatch({ control: methods.control, name: "customer_type" });

  React.useEffect(() => {
    if (open) {
      methods.reset({
        customer_type: "company",
        company_name: initialName || "",
        commercial_register: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address_label: "Main Office",
        address_line_1: "",
        city: "",
      });
    }
  }, [open, initialName, methods]);

  const { mutate, isPending } = useMutation({
    mutationFn: handleAddCustomer,
    onSuccess: (res) => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries(["customers"]);
      const newId = res?.data?.id ?? res?.id;
      if (onCreated && newId) {
        onCreated(newId);
      }
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to create customer");
    },
  });

  const onSubmit = (data) => {
    if (data.customer_type === "company") {
      if (!data.company_name) {
        toast.error("Company Name is required");
        return;
      }
      if (!data.commercial_register) {
        toast.error("Commercial Register is required");
        return;
      }
    }
    if (data.customer_type === "individual") {
      if (!data.first_name) {
        toast.error("First Name is required");
        return;
      }
      if (!data.last_name) {
        toast.error("Last Name is required");
        return;
      }
    }
    if (!data.phone) {
      toast.error("Phone Number is required");
      return;
    }
    if (!data.city) {
      toast.error("City is required");
      return;
    }
    if (!data.address_line_1) {
      toast.error("Address Line is required");
      return;
    }

    const payload = {
      customer_type: data.customer_type,
      phone: data.phone,
      email: data.email || "",
      is_active: true,
      addresses: [
        {
          type: "both",
          label: data.address_label || "Main Office",
          address_line_1: data.address_line_1,
          address_line_2: "",
          city: data.city,
          state: "",
          postal_code: "",
          country: "Saudi Arabia",
          is_default: true,
        },
      ],
    };

    if (data.customer_type === "company") {
      payload.company_name = data.company_name;
      payload.commercial_register = data.commercial_register;
    } else {
      payload.first_name = data.first_name;
      payload.last_name = data.last_name;
    }

    mutate({ body: payload });
  };

  const typeOptions = [
    { value: "company", label: "Company" },
    { value: "individual", label: "Individual" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomSelect
              control={methods.control}
              name="customer_type"
              label="Customer Type"
              options={typeOptions}
              isRequired
              errors={methods.formState.errors.customer_type}
            />

            {customerType === "company" ? (
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  register={methods.register}
                  name="company_name"
                  label="Company Name"
                  isRequired
                  errors={methods.formState.errors.company_name}
                  placeholder="Enter company name"
                />
                <CustomInput
                  register={methods.register}
                  name="commercial_register"
                  label="Commercial Register"
                  isRequired
                  errors={methods.formState.errors.commercial_register}
                  placeholder="Enter commercial register"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  register={methods.register}
                  name="first_name"
                  label="First Name"
                  isRequired
                  errors={methods.formState.errors.first_name}
                  placeholder="First name"
                />
                <CustomInput
                  register={methods.register}
                  name="last_name"
                  label="Last Name"
                  isRequired
                  errors={methods.formState.errors.last_name}
                  placeholder="Last name"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                register={methods.register}
                name="phone"
                label="Phone Number"
                isRequired
                errors={methods.formState.errors.phone}
                placeholder="Enter phone number"
              />
              <CustomInput
                register={methods.register}
                name="email"
                label="Email Address"
                errors={methods.formState.errors.email}
                placeholder="Enter email address"
                type="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                register={methods.register}
                name="address_label"
                label="Address Label"
                errors={methods.formState.errors.address_label}
                placeholder="e.g. Main Office, Home"
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
              isRequired
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
                {isPending ? "Creating..." : "Save Customer"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}