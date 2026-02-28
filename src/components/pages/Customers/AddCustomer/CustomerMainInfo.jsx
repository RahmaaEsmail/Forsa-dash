import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import CustomInput from '../../../shared/CustomInput'
import CustomSelect from '../../../shared/CustomSelect'

export default function CustomerMainInfo() {
  const { register, control, formState: { errors } } = useFormContext();
  const customerType = useWatch({ control, name: "customer_type" });

  const typeOptions = [
    { value: "company", label: "Company" },
    { value: "individual", label: "Individual" }
  ];

  return (
    <div className='flex flex-col gap-6 w-full py-5'>
      <div className='grid grid-cols-2 gap-8'>
         <CustomSelect 
            control={control}
            name="customer_type"
            label="Customer Type"
            options={typeOptions}
         />
      </div>

      <h3 className="text-secondary font-bold text-lg border-b pb-2">Basic Details</h3>
      <div className='grid grid-cols-2 gap-8'>
        {customerType === 'company' ? (
          <>
            <CustomInput label={"Company Name"} name={"company_name"} register={register} errors={errors?.company_name} isRequired />
            <CustomInput label={"Website"} name={"website"} register={register} errors={errors?.website} />
            <CustomInput label={"Tax Number"} name={"tax_number"} register={register} errors={errors?.tax_number} />
            <CustomInput label={"Commercial Register"} name={"commercial_register"} register={register} errors={errors?.commercial_register} />
          </>
        ) : (
          <>
            <CustomInput label={"First Name"} name={"first_name"} register={register} errors={errors?.first_name} isRequired />
            <CustomInput label={"Last Name"} name={"last_name"} register={register} errors={errors?.last_name} isRequired />
            <CustomInput label={"Sales User ID"} name={"sales_user_id"} register={register} errors={errors?.sales_user_id} type="number" />
          </>
        )}
      </div>

      <h3 className="text-secondary font-bold text-lg border-b pb-2 mt-4">Contact & Additional Info</h3>
      <div className='grid grid-cols-2 gap-8'>
        <CustomInput label={"Email Address"} name={"email"} register={register} errors={errors?.email} type="email" isRequired />
        <CustomInput label={"Phone Number"} name={"phone"} register={register} errors={errors?.phone} />
        <CustomInput label={"Mobile Number"} name={"mobile"} register={register} errors={errors?.mobile} />
        <CustomInput label={"Notes"} name={"notes"} register={register} errors={errors?.notes} />
      </div>

      <div className="flex items-center gap-2 mt-2">
         <input type="checkbox" id="is_active" {...register("is_active")} className="w-4 h-4 text-primary" />
         <label htmlFor="is_active" className="text-secondary font-medium text-md">Customer is Active</label>
      </div>
    </div>
  )
}
