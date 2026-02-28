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
      name_en: initialName || "",
      name_ar: "",
      desc: "",
      category_id: "",
      sub_category_id: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      methods.reset({
        name: initialName || "",
        desc: "",
        category_id: "",
        sub_category_id: "",
      });
    }
  }, [open, initialName, methods]);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => handleGetAllCategories({ signal, per_page: 100 }),
    enabled: open,
  });

  // Since subcategories typically depend on category, we'd watch category_id,
  // but for minimal creation, we can fetch all or leave it simple.
  const selectedCategory = methods.watch("category_id");
  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } =
    useQuery({
      queryKey: ["categories", selectedCategory],
      queryFn: ({ signal }) =>
        handleGetAllCategories({
          signal,
          parent_id: selectedCategory,
          per_page: 100,
        }),
      enabled: open && !!selectedCategory,
    });

  const getOptionLabel = (option) => {
    if (!option) return "";
    if (typeof option.name === "object" && option.name !== null) {
      return option.name.en || option.name.ar || "Unnamed Option";
    }
    return option.name || "Unnamed Option";
  };

  const categoryOptions = Array.isArray(categoriesData?.data)
    ? categoriesData.data.map((c) => ({
        label: getOptionLabel(c),
        value: c.id,
      }))
    : [];

  const subCategoryOptions = Array.isArray(subCategoriesData?.data)
    ? subCategoriesData.data.map((c) => ({
        label: getOptionLabel(c),
        value: c.id,
      }))
    : [];

  const { mutate, isPending } = useMutation({
    mutationFn: handleAddProduct,
    onSuccess: (res) => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries(["products"]);
      if (onCreated && res?.data?.id) {
        onCreated(res.data.id);
      } else if (onCreated && res?.id) {
        onCreated(res.id);
      }
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create product");
    },
  });

  const onSubmit = (data) => {
    console.log("data", data);
    // API might expect multipart/form-data for products so we build FormData
    const formData = new FormData();
    formData.append("name[ar]", data?.name_ar);
    formData.append("name[en]", data?.name_en);
    formData.append("description", data?.desc);
    formData.append("category_id", data?.category_id);
    formData.append("sub_category_id", data?.sub_category_id);
    // Object.entries(data).forEach(([key, value]) => {
    //   if (value !== undefined && value !== null && value !== "") {
    //     formData.append(key, value);
    //   }
    // });
    mutate({ body: formData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              register={methods.register}
              name="name_ar"
              label="Product Name in arabic"
              isRequired
              errors={methods.formState.errors.name_ar}
            />
            <CustomInput
              register={methods.register}
              name="name_en"
              label="Product Name in english"
              isRequired
              errors={methods.formState.errors.name_en}
            />
            <CustomInput
              register={methods.register}
              name="desc"
              label="Description"
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomSelect
                control={methods.control}
                name="category_id"
                label="Category"
                options={categoryOptions}
                isLoading={isCategoriesLoading}
                placeholder="Select Category"
              />
              {/* <CustomSelect
                control={methods.control}
                name="sub_category_id"
                label="Sub Category"
                options={subCategoryOptions}
                isLoading={isSubCategoriesLoading}
                placeholder="Select Sub Category"
                disabled={!selectedCategory}
              /> */}
            </div>

            <div className="flex justify-end gap-2 pt-4">
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
