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
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAddProduct } from "../../../services/products";
import { handleGetAllCategories } from "../../../services/categories";
import { handleGetAllUnits } from "../../../services/units";
import { toast } from "sonner";

export default function CreateProductModal({
  open,
  onOpenChange,
  initialName,
  onCreated,
}) {
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      name_en: "",
      name_ar: "",
      category_id: "",
      unit_of_measure: [],
    },
  });

  React.useEffect(() => {
    if (open) {
      methods.reset({
        name_en: initialName || "",
        name_ar: "",
        category_id: "",
        unit_of_measure: [],
      });
    }
  }, [open, initialName, methods]);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => handleGetAllCategories({ signal, per_page: 100 }),
    enabled: open,
  });

  const { data: unitsData, isLoading: isUnitsLoading } = useQuery({
    queryKey: ["units-all"],
    queryFn: ({ signal }) => handleGetAllUnits({ signal, per_page: 200 }),
    enabled: open,
  });

  const getOptionLabel = (option) => {
    if (!option) return "";
    if (typeof option.name === "object" && option.name !== null) {
      return [option.name.en, option.name.ar].filter(Boolean).join(" - ") || "Unnamed";
    }
    return option.name || "Unnamed";
  };

  const categoryOptions = Array.isArray(categoriesData?.data)
    ? categoriesData.data.map((c) => ({
        label: getOptionLabel(c),
        value: c.id,
      }))
    : [];

  const unitOptions = Array.isArray(unitsData?.data)
    ? unitsData.data.map((u) => ({
        label: getOptionLabel(u),
        value: u.id,
      }))
    : [];

  const { mutate, isPending } = useMutation({
    mutationFn: handleAddProduct,
    onSuccess: (res, variables) => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries(["products"]);
      const newId = res?.data?.id ?? res?.id;
      if (onCreated && newId) {
        const submittedUnits = variables._units || [];
        const firstUnitId = submittedUnits[0] ?? null;
        onCreated(newId, firstUnitId);
      }
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create product");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name[ar]", data.name_ar);
    formData.append("name[en]", data.name_en);
    if (data.category_id) formData.append("category_id", data.category_id);
    const units = Array.isArray(data.unit_of_measure) ? data.unit_of_measure : [];
    units.forEach((uId, idx) => {
      formData.append(`units[${idx}]`, String(uId));
    });
    mutate({ body: formData, _units: units });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                register={methods.register}
                name="name_en"
                label="Name (English)"
                isRequired
                errors={methods.formState.errors.name_en}
              />
              <CustomInput
                register={methods.register}
                name="name_ar"
                label="Name (Arabic)"
                isRequired
                errors={methods.formState.errors.name_ar}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomSelect
                control={methods.control}
                name="category_id"
                label="Category"
                isRequired
                options={categoryOptions}
                isLoading={isCategoriesLoading}
                placeholder="Select category"
              />
              <CustomSelect
                control={methods.control}
                name="unit_of_measure"
                label="Units of Measure"
                isRequired
                options={unitOptions}
                isLoading={isUnitsLoading}
                placeholder="Select units"
                multiple={true}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Save Product"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
