import React from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export default function CustomTextarea({label,errors , isRequired , placeholder , register , name}) {
  return (
   <div className='flex flex-col gap-2'>
        <Label className={"font-normal text-secondary text-lg"}>
          <span>{label}{isRequired && <span>*</span>}</span>
        </Label>
        <Textarea placeholder={placeholder} 
       {...register(name)}
        className={"rounded-lg! bg-input-bg p-6 placeholder:text-[#858B9E]"} />
                {errors && <p className='text-sm text-red-500'>{errors?.message}</p>}

      </div>
  )
}
