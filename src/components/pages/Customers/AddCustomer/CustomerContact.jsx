import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import CustomInput from '../../../shared/CustomInput'
import { Button } from '../../../ui/button'
import { Plus, Trash2 } from 'lucide-react'

export default function CustomerContact() {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts"
  });

  return (
    <div className='flex flex-col gap-6 py-5'>
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-secondary font-bold text-lg">Company Contacts</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => append({ name: "", position: "", email: "", phone: "", mobile: "", whatsapp: "", is_primary: false, receive_notifications: false })}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Contact
        </Button>
      </div>

      {fields.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No contacts added yet.</p>}

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
           
           <h4 className="font-semibold text-slate-700 mb-4">Contact {index + 1}</h4>
           
           <div className='grid grid-cols-2 gap-4'>
             <CustomInput label="Name" name={`contacts.${index}.name`} register={register} errors={errors?.contacts?.[index]?.name} />
             <CustomInput label="Position" name={`contacts.${index}.position`} register={register} errors={errors?.contacts?.[index]?.position} />
             <CustomInput label="Email" name={`contacts.${index}.email`} register={register} type="email" errors={errors?.contacts?.[index]?.email} />
             <CustomInput label="Phone" name={`contacts.${index}.phone`} register={register} errors={errors?.contacts?.[index]?.phone} />
             <CustomInput label="Mobile" name={`contacts.${index}.mobile`} register={register} errors={errors?.contacts?.[index]?.mobile} />
             <CustomInput label="WhatsApp" name={`contacts.${index}.whatsapp`} register={register} errors={errors?.contacts?.[index]?.whatsapp} />
             
             <div className="flex items-center gap-6 mt-4 col-span-2">
               <div className="flex items-center gap-2">
                 <input type="checkbox" id={`is_primary_${index}`} {...register(`contacts.${index}.is_primary`)} className="w-4 h-4 text-primary" />
                 <label htmlFor={`is_primary_${index}`} className="text-secondary font-medium text-sm">Primary Contact</label>
               </div>
               <div className="flex items-center gap-2">
                 <input type="checkbox" id={`receive_notifications_${index}`} {...register(`contacts.${index}.receive_notifications`)} className="w-4 h-4 text-primary" />
                 <label htmlFor={`receive_notifications_${index}`} className="text-secondary font-medium text-sm">Receive Notifications</label>
               </div>
             </div>
           </div>
        </div>
      ))}
    </div>
  )
}
