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
import getAllUnitsOptions from "../../../hooks/units/getAllUnitsOptions";
import useCreateUnit from "../../../hooks/units/useAddUnit";
import useEditUnit from "../../../hooks/units/useEditUnit";
import { symbol } from "zod";
import unitsDetailsOptions from "../../../hooks/units/unitsDetailsOptions";
import { unitsSchema } from "../../../validations/unitsSchema";

export default function AddUnitForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // string or null

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(unitsSchema),
    defaultValues: {
      name_en: "",
      name_ar: "",
      code: "",
      symbol: "",
      is_active: false,
    },
  });

  // -------- Queries --------
  const { data: units, isLoading: unit_loading } = useQuery(
    getAllUnitsOptions()
  );

  const {
    data: unitsDetails,
    isLoading: unit_details_loading,
  } = useQuery(
    {
      ...unitsDetailsOptions({ id }),
    enabled: !!id,
    refetchOnMount:"always",
    }
  );

  const {
    mutate: addUnit,
    isPending: is_adding,
    isSuccess: create_unit_success,
  } = useCreateUnit();

  const {
    mutate: editunit,
    isPending: is_editing,
    isSuccess: edit_unit_success,
  } = useEditUnit();
  
// -------- Reset form when details arrive (edit mode) --------
useEffect(() => {
  if (!id) return;
  
  // Wait for both data sources to be ready
  if (!unitsDetails?.data || !units?.data) return;
  
  const d = unitsDetails?.data;
  const list = units?.data;
    
  console.log("d" , d);
  // Ensure we have valid data
  if (!d || !list?.length) return;
  
  // Use a timeout to ensure this runs after any other state updates
  const timeoutId = setTimeout(() => {
    reset({
      name_en: d.name?.en ?? "",
      name_ar: d.name?.ar ?? "",
      symbol: d?.symbol ?? "",
      is_active: !!d.is_active,
    });
  }, 0);
  
  return () => clearTimeout(timeoutId);
}, [id, unitsDetails, units, reset]);


  // -------- Submit --------
  function onSubmit(values) {
    const data_send = {
      id : id,
      name: {
        en: values.name_en,
        ar: values.name_ar,
      },
      symbol:values?.symbol, // ✅ number/null
      is_active: values.is_active,
    };
  
    id ? editunit({id ,  body: data_send }) : addUnit({ body: data_send });
  }

  // Reset after success (add mode typically)
  useEffect(() => {
    if (!create_unit_success) return;

  if (id) {
    return;
  }
    reset({
        name_en: "",
        name_ar: "",
        code: "",
        symbol: "",
        is_active: false,
      });
  }, [create_unit_success,id, reset]);

  // Loading states
  if (unit_details_loading && id) return <Loading />;

  return (
    <Card className="flex flex-col gap-7 p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <CustomInput
            label={"Name in Arabic"}
            isRequired={true}
            register={register}
            type="text"
            placeholder={"Enter Name Of Unit in Arabic"}
            name={"name_ar"}
            errors={errors.name_ar}
          />

          <CustomInput
            label={"Name in English"}
            isRequired={true}
            register={register}
            type="text"
            placeholder={"Enter Name Of Unit in English"}
            name={"name_en"}
            errors={errors.name_en}
          />

        {/* <CustomInput
            label={"Code"}
            isRequired={true}
            register={register}
            type="text"
            placeholder={"Enter Code Of Unit"}
            name={"code"}
            errors={errors.code}
          /> */}

          <CustomInput
            label={"Symbol"}
            isRequired={true}
            register={register}
            type="text"
            placeholder={"Enter Symbol Of Unit"}
            name={"symbol"}
            errors={errors.symbol}
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
