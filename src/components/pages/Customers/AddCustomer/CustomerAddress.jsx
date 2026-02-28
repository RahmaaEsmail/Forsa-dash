import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import CustomInput from '../../../shared/CustomInput'
import { Button } from '../../../ui/button'
import { Plus, Trash2 } from 'lucide-react'

export default function CustomerAddress() {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses"
  });

  return (
    <div className='flex flex-col gap-6 py-5'>
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-secondary font-bold text-lg">Addresses</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => append({ type: "both", label: "", address_line_1: "", address_line_2: "", city: "", state: "", postal_code: "", country: "", is_default: false })}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Address
        </Button>
      </div>

      {fields.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No addresses added yet.</p>}

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border border-slate-200 rounded-md relative bg-slate-50">
           <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => remove(index)}
           >
              <Trash2 className="w-4 h-4" />
           </Button>
           
           <h4 className="font-semibold text-slate-700 mb-4">Address {index + 1}</h4>
           
           <div className='grid grid-cols-2 gap-4'>
             <CustomInput label="Type (e.g., both, billing, shipping)" name={`addresses.${index}.type`} register={register} errors={errors?.addresses?.[index]?.type} />
             <CustomInput label="Label (e.g., Head Office, Home)" name={`addresses.${index}.label`} register={register} errors={errors?.addresses?.[index]?.label} />
             <CustomInput label="Address Line 1" name={`addresses.${index}.address_line_1`} register={register} errors={errors?.addresses?.[index]?.address_line_1} />
             <CustomInput label="Address Line 2" name={`addresses.${index}.address_line_2`} register={register} errors={errors?.addresses?.[index]?.address_line_2} />
             <CustomInput label="City" name={`addresses.${index}.city`} register={register} errors={errors?.addresses?.[index]?.city} />
             <CustomInput label="State" name={`addresses.${index}.state`} register={register} errors={errors?.addresses?.[index]?.state} />
             <CustomInput label="Postal Code" name={`addresses.${index}.postal_code`} register={register} errors={errors?.addresses?.[index]?.postal_code} />
             <CustomInput label="Country" name={`addresses.${index}.country`} register={register} errors={errors?.addresses?.[index]?.country} />
             
             <div className="flex items-center gap-2 mt-4 col-span-2">
               <input type="checkbox" id={`is_default_address_${index}`} {...register(`addresses.${index}.is_default`)} className="w-4 h-4 text-primary" />
               <label htmlFor={`is_default_address_${index}`} className="text-secondary font-medium text-sm">Is Default Address</label>
             </div>
           </div>
        </div>
      ))}
    </div>
  )
}
