import React from 'react'
import { Card } from '../../ui/card'
import CustomInput from '../../shared/CustomInput'
import CustomSelect from '../../shared/CustomSelect'
import { useForm } from 'react-hook-form'
import { DatePickerInput } from '../../shared/CustomInputDate'

export default function CreateQuotationForm() {
  const { register, handleSubmit, control } = useForm({
    defaultValues  : {
      client:"",
      requested_by:"",
      location:"",
      approval_date:"",
      request_date:"",
      sub_category:"",
      category:"",
    }
  })
  return (
    <Card className='px-5'>
      <h2 className='text-secondary text-large font-bold'>Request Reference #New</h2>

      <form className='flex flex-col gap-3'>
        <div className='grid grid-cols-2 gap-8'>
          <CustomInput register={register} name={"client"} placeholder={"e.g Forsa Company"} label={"Client"} isRequired={true} />
          <CustomInput register={register} name="requested_by" placeholder={"e.g shahd"} label={"Requested by"} />
          <CustomInput register={register} name="location" placeholder={"e.g shahd"} label={"Project Location"} />
          <DatePickerInput register={register} name="approval_date" placeholder={"dd/mm/yy"} label={"Approval  Date"} />
          <DatePickerInput register={register} name="date" placeholder={"dd/mm/yy"} label={"Request Date"} />
          <CustomSelect options={[]} control={control} name={"sub_category"} placeholder={"Select one/ more category"} label={"SubCategory (Multiple)"} />
          <CustomSelect options={[]} control={control} name="category" placeholder={"Select one/ more category"} label={"Category (Multiple)"} />
        </div>
      </form>
    </Card>
  )
}
