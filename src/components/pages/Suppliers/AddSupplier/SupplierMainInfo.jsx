import React from "react";
import { useFormContext } from "react-hook-form";
import CustomInput from "../../../shared/CustomInput";

export default function SupplierMainInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Basic */}
      <CustomInput
        label={"Code"}
        register={register}
        name={"code"}
        isRequired={true}
        type="text"
        errors={errors}
        placeholder={"Enter Code"}
      />

      <CustomInput
        label={"Company Name"}
        register={register}
        name={"company_name"}
        isRequired={true}
        type="text"
        errors={errors}
        placeholder={"Enter Company Name"}
      />

      <CustomInput
        label={"First Name"}
        register={register}
        name={"first_name"}
        isRequired={true}
        type="text"
        errors={errors}
        placeholder={"Enter First Name"}
      />

      <CustomInput
        label={"Last Name"}
        register={register}
        name={"last_name"}
        isRequired={true}
        type="text"
        errors={errors}
        placeholder={"Enter Last Name"}
      />

      {/* Bilingual Name Object */}
      <CustomInput
        label={"Name (EN)"}
        register={register}
        name={"name.en"}
        isRequired={true}
        type="text"
        errors={errors}
        placeholder={"Enter English Name"}
      />

      <CustomInput
        label={"Name (AR)"}
        register={register}
        name={"name.ar"}
        isRequired={true}
        type="text"
        errors={errors}
        placeholder={"أدخل الاسم بالعربي"}
      />

      {/* Contact (main) */}
      <CustomInput
        label={"Email"}
        type="email"
        register={register}
        name={"email"}
        isRequired={true}
        errors={errors}
        placeholder={"Enter Email"}
      />

      <CustomInput
        label={"Phone"}
        register={register}
        name={"phone"}
        isRequired={true}
        type="tel"
        errors={errors}
        placeholder={"Enter Phone Number"}
      />

      <CustomInput
        label={"Mobile"}
        register={register}
        name={"mobile"}
        isRequired={false}
        type="tel"
        errors={errors}
        placeholder={"Enter Mobile Number"}
      />

      <CustomInput
        label={"Website"}
        register={register}
        name={"website"}
        isRequired={false}
        type="url"
        errors={errors}
        placeholder={"https://example.com"}
      />

      {/* Tax & Registration */}
      <CustomInput
        label={"Tax Treatment"}
        register={register}
        name={"tax_treatment"}
        isRequired={false}
        type="text"
        errors={errors}
        placeholder={"e.g. VAT Registered"}
      />

      <CustomInput
        label={"VAT Number"}
        register={register}
        name={"vat_number"}
        isRequired={false}
        type="text"
        errors={errors}
        placeholder={"Enter VAT Number"}
      />

      <CustomInput
        label={"Commercial Register"}
        register={register}
        name={"commercial_register"}
        isRequired={false}
        type="text"
        errors={errors}
        placeholder={"Enter CR"}
      />

      {/* Settings */}
      <CustomInput
        label={"Language"}
        register={register}
        name={"language"}
        isRequired={false}
        type="text"
        errors={errors}
        placeholder={"ar / en"}
      />

      <CustomInput
        label={"Source of Supply"}
        register={register}
        name={"source_of_supply"}
        isRequired={false}
        type="text"
        errors={errors}
        placeholder={"e.g. SA"}
      />

      {/* Business Terms */}
      <CustomInput
        label={"Lead Time (Days)"}
        register={register}
        name={"lead_time_days"}
        isRequired={false}
        type="number"
        errors={errors}
        placeholder={"e.g. 7"}
      />

      <CustomInput
        label={"Minimum Order Value"}
        register={register}
        name={"minimum_order_value"}
        isRequired={false}
        type="number"
        errors={errors}
        placeholder={"e.g. 5000"}
      />

      <CustomInput
        label={"Rating"}
        register={register}
        name={"rating"}
        isRequired={false}
        type="number"
        errors={errors}
        placeholder={"e.g. 4.5"}
      />

      {/* Category IDs (Array) */}
      <CustomInput
        label={"Category IDs"}
        register={register}
        name={"category_ids"}
        isRequired={false}
        type="text"
        errors={errors}
        placeholder={"e.g. 1,2,3"}
      />

      {/* Notes */}
      <div className="md:col-span-2">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          className="w-full min-h-[110px] rounded-md border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Write notes..."
          {...register("notes")}
        />
        {errors?.notes && (
          <p className="text-sm text-red-500 mt-1">
            {errors.notes.message?.toString()}
          </p>
        )}
      </div>

      {/* Active */}
      <div className="md:col-span-2 flex items-center gap-3 pt-2">
        <input
          id="is_active"
          type="checkbox"
          className="h-4 w-4"
          {...register("is_active")}
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Active Supplier
        </label>
      </div>
    </div>
  );
}