import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import CustomInput from '../../../shared/CustomInput'
import CustomSelect from '../../../shared/CustomSelect'
import { Button } from '../../../ui/button'
import { Plus, Trash2 } from 'lucide-react'

export default function CustomerPaymentTerms() {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "payment_terms"
  });

  const statusOptions = [
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "none", label: "None" }
  ];

  return (
    <div className='flex flex-col gap-6 py-5'>
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-secondary font-bold text-lg">Payment Terms</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => append({ payment_term_id: "", credit_limit: 0, credit_days: 0, credit_status: "none", is_default: false })}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Payment Term
        </Button>
      </div>

      {fields.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No payment terms added yet.</p>}

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
           
           <h4 className="font-semibold text-slate-700 mb-4">Term {index + 1}</h4>
           
           <div className='grid grid-cols-2 gap-4'>
             <CustomInput label="Payment Term ID" name={`payment_terms.${index}.payment_term_id`} register={register} type="number" errors={errors?.payment_terms?.[index]?.payment_term_id} />
             <CustomInput label="Credit Limit" name={`payment_terms.${index}.credit_limit`} register={register} type="number" errors={errors?.payment_terms?.[index]?.credit_limit} />
             <CustomInput label="Credit Days" name={`payment_terms.${index}.credit_days`} register={register} type="number" errors={errors?.payment_terms?.[index]?.credit_days} />
             
             <CustomSelect 
                control={control}
                name={`payment_terms.${index}.credit_status`}
                label="Credit Status"
                options={statusOptions}
             />
             
             <div className="flex items-center gap-2 mt-4 col-span-2">
               <input type="checkbox" id={`is_default_term_${index}`} {...register(`payment_terms.${index}.is_default`)} className="w-4 h-4 text-primary" />
               <label htmlFor={`is_default_term_${index}`} className="text-secondary font-medium text-sm">Is Default Term</label>
             </div>
           </div>
        </div>
      ))}
    </div>
  )
}
