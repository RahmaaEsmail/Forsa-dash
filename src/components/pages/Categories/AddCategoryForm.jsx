import React, { useEffect, useMemo } from "react";
import { Card } from "../../ui/card";
import CustomInput from "../../shared/CustomInput";
import { useForm, Controller } from "react-hook-form";
import CustomTextarea from "../../shared/CustomTextarea";
import CustomSelect from "../../shared/CustomSelect";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { categoriesSchema } from "../../../validations/categoriesSchema";
import useCreateCategory from "../../../hooks/categories/useCreateCategory";
import categoriesAllOptions from "../../../hooks/categories/categoriesAllOptions";
import categoriesDetailsOptions from "../../../hooks/categories/categoriesDetailsOptions";
import { useSearchParams } from "react-router-dom";
import Loading from "../../shared/Loading";
import useUpdateCategory from "../../../hooks/categories/useUpdateCategory";

export default function AddCategoryForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // string or null

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      desc_ar: "",
      desc_en: "",
      is_active: false,
      parent_id: "", // ✅ string (Radix Select friendly)
    },
  });

  // -------- Queries --------
  const { data: categories, isLoading: categories_loading } = useQuery(
    categoriesAllOptions()
  );

  const {
    data: categoriesDetails,
    isLoading: category_details_loading,
  } = useQuery(
    {
      ...categoriesDetailsOptions({ id }),
    enabled: !!id,
    refetchOnMount:"always",
    }
  );

  const {
    mutate: addCategory,
    isPending: is_adding,
    isSuccess: create_category_success,
  } = useCreateCategory();

  const {
    mutate: editCategory,
    isPending: is_editing,
    isSuccess: edit_category_success,
  } = useUpdateCategory();

  // -------- Options (string values) + exclude self --------
  const categoryOptions = useMemo(() => {
    const currentId = id ? String(id) : null;

    const list = categories?.data || [];
    return list
      .filter((item) => String(item.id) !== currentId) // ✅ prevent selecting self
      .map((item) => ({
        label: `${item?.name?.en} - ${item?.name?.ar}`,
        value: String(item?.id), // ✅ string value
      }));
  }, [categories, id]);

  
// -------- Reset form when details arrive (edit mode) --------
useEffect(() => {
  if (!id) return;
  
  // Wait for both data sources to be ready
  if (!categoriesDetails?.data || !categories?.data) return;
  
  const d = categoriesDetails.data;
  const list = categories.data;
  
  // Ensure we have valid data
  if (!d || !list?.length) return;
  
  const parentId = d.parent?.id != null ? String(d.parent.id) : "";
  
  // Only validate if there's a parent_id
  let finalParentId = "";
  if (parentId) {
    const exists = list.some((c) => String(c.id) === parentId);
    finalParentId = exists ? parentId : "";
  }
  
  // Use a timeout to ensure this runs after any other state updates
  const timeoutId = setTimeout(() => {
    reset({
      name_en: d.name?.en ?? "",
      name_ar: d.name?.ar ?? "",
      desc_ar: d.description?.ar ?? "",
      desc_en: d.description?.en ?? "",
      is_active: !!d.is_active,
      parent_id: finalParentId,
    });
  }, 0);
  
  return () => clearTimeout(timeoutId);
}, [id, categoriesDetails, categories, reset]);


  // -------- Submit --------
  function onSubmit(values) {
    const data_send = {
      id : id,
      name: {
        en: values.name_en,
        ar: values.name_ar,
      },
      description: {
        en: values.desc_en,
        ar: values.desc_ar,
      },
      parent_id: values.parent_id ? Number(values.parent_id) : null, // ✅ number/null
      is_active: values.is_active,
    };
  
    id ? editCategory({id ,  body: data_send }) : addCategory({ body: data_send });
  }

  // Reset after success (add mode typically)
  useEffect(() => {
    if (!create_category_success) return;

  if (id) {
    return;
  }
    reset({
        name_en: "",
        name_ar: "",
        desc_ar: "",
        desc_en: "",
        is_active: false,
        parent_id: "",
      });
  }, [create_category_success,id, reset]);

  // Loading states
  if (category_details_loading && id) return <Loading />;

  return (
    <Card className="flex flex-col gap-7 p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <CustomInput
            label={"Name in Arabic"}
            isRequired={true}
            register={register}
            type="text"
            placeholder={"Enter Name Of Category in Arabic"}
            name={"name_ar"}
            errors={errors.name_ar}
          />

          <CustomInput
            label={"Name in English"}
            isRequired={true}
            register={register}
            type="text"
            placeholder={"Enter Name Of Category in English"}
            name={"name_en"}
            errors={errors.name_en}
          />

          <CustomTextarea
            label={"Description in Arabic"}
            isRequired={true}
            register={register}
            placeholder={"Enter Description Of Category in Arabic"}
            name={"desc_ar"}
            errors={errors.desc_ar}
          />

          <CustomTextarea
            label={"Description in English"}
            isRequired={true}
            register={register}
            placeholder={"Enter Description Of Category in English"}
            name={"desc_en"}
            errors={errors.desc_en}
          />

          <CustomSelect
            key={`parent-select-${id || 'new'}-${categoryOptions.length}`}
            name={"parent_id"}
            control={control}
            placeholder={categories_loading ? "Loading..." : "Choose Parent Of Category"}
            label={"Parent"}
            options={categoryOptions}
            disabled={categories_loading}
            errors={errors.parent_id}
          />

          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Switch
                  id="active-mode"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="active-mode">Active Mode</Label>
          </div>
        </div>

        <div className="flex justify-end items-end">
          <Button
            type="submit"
            size="large"
            className={"rounded-md w-28 p-3"}
            variant="default"
            disabled={(is_adding || is_editing)}
          >
            {(is_adding || is_editing) ? "Loading....." : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
