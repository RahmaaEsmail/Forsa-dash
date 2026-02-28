import React, { useEffect, useMemo } from "react";
import CustomSelect from "../../../shared/CustomSelect";
import CustomInput from "../../../shared/CustomInput";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import getAllSupplierOptions from "../../../../hooks/suppliers/getAllSupplierOptions";

export default function ProductInventoryForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { data: all_suppliers, isLoading } = useQuery(getAllSupplierOptions());

  const all_suppliers_options = useMemo(() => {
    const list = all_suppliers?.data ?? [];

    return list.map((item) => {
      const first = (item?.first_name ?? "").trim();
      const last = (item?.last_name ?? "").trim();

      // لو first_name فاضي/NULL → اعتمد على name فقط
      const fullName =
        first.length > 0 ? `${first}${last ? ` ${last}` : ""}` : "";

      const label = fullName || (item?.name ?? "Unnamed Supplier");

      return { label, value: item?.id };
    });
  }, [all_suppliers]);

  useEffect(() => {
    console.log("all_suppliers", all_suppliers?.data);
  }, [all_suppliers]);

  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-3 gap-7">
        <CustomSelect
          name={"supplier"}
          control={control}
          label={"Default Supplier"}
          placeholder={"Select Supplier"}
          errors={errors?.supplier}
          options={all_suppliers_options}
          isLoading={isLoading}
        />

        <CustomInput
          name={"min_stock"}
          label={"Minimum stock"}
          register={register}
          errors={errors?.min_stock}
          placeholder={"e.g. 10 tons"}
        />
        <CustomInput
          name={"max_stock"}
          label={"Maximum stock"}
          register={register}
          errors={errors?.max_stock}
          placeholder={"e.g. 10 tons"}
        />
        <CustomInput
          name={"avg_time"}
          label={"Average lead time (days)"}
          register={register}
          errors={errors?.avg_time}
          placeholder={"e.g. 10"}
        />
        <CustomInput
          name={"storage_location_code"}
          label={"Storage location code"}
          register={register}
          errors={errors?.storage_location_code}
          placeholder={"e.g. WH-AI"}
        />
      </div>
    </div>
  );
}
