import React from "react"
import { Card } from "../../ui/card"
import CustomInput from "../../shared/CustomInput"
import CustomSelect from "../../shared/CustomSelect"
import { useForm, useFormContext } from "react-hook-form"
import { DatePickerInput } from "../../shared/CustomInputDate"

export default function CreateQuotationForm() {
  const {register ,handleSubmit, control , formState :{errors}} = useFormContext()
  
  const onSubmit = (data) => {
    console.log("FORM DATA:", data)
  }

  return (
    <Card className="px-5">
      <h2 className="text-secondary text-large font-bold">
        Request Reference #New
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-8">
          <CustomInput
            register={register}
            name="client"
            placeholder="e.g Forsa Company"
            label="Client"
            isRequired={true}
          />

          <CustomInput
            register={register}
            name="requested_by"
            placeholder="e.g shahd"
            label="Requested by"
          />

          <CustomInput
            register={register}
            name="location"
            placeholder="e.g Cairo"
            label="Project Location"
          />

          <DatePickerInput
            control={control}
            name="approval_date"
            placeholder="June 01, 2025"
            label="Approval Date"
            required
          />

          <DatePickerInput
            control={control}
            name="request_date"
            placeholder="June 01, 2025"
            label="Request Date"
          />

          <CustomSelect
            options={[]}
            control={control}
            name="sub_category"
            placeholder="Select one/ more category"
            label="SubCategory (Multiple)"
          />

          <CustomSelect
            options={[]}
            control={control}
            name="category"
            placeholder="Select one/ more category"
            label="Category (Multiple)"
          />
        </div>
      </form>
    </Card>
  )
}
