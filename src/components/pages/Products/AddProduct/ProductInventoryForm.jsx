import React from 'react'
import CustomSelect from '../../../shared/CustomSelect'
import CustomInput from '../../../shared/CustomInput'
import { useFormContext } from 'react-hook-form'

export default function ProductInventoryForm() {
  const { register, control, formState: { errors } } =useFormContext()
  return (
    <div className='flex flex-col gap-7'>
      <div className='grid grid-cols-3 gap-7'>
        <CustomSelect name={"supplier"} control={control} label={"Default Supplier"} placeholder={"Select Supplier"} errors={errors?.supplier} options={[]} />
        <CustomInput name={"min_stock"} label={"Minimum stock"} register={register} errors={errors?.min_stock} placeholder={"e.g. 10 tons"} />
        <CustomInput name={"max_stock"} label={"Maximum stock"} register={register} errors={errors?.max_stock} placeholder={"e.g. 10 tons"} />
        <CustomInput name={"avg_time"} label={"Average lead time (days)"} register={register} errors={errors?.avg_time} placeholder={"e.g. 10"} />
        <CustomInput name={"storage_location_code"} label={"Storage location code"} register={register} errors={errors?.storage_location_code} placeholder={"e.g. WH-AI"} />
      </div>


    </div>
  )
}
