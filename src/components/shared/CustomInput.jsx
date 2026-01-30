import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export default function CustomInput({label,errors , register, type="text" , name , isRequired , placeholder}) {
  return (
   <div className='flex flex-col gap-2'>
          <Label className={"font-normal text-secondary text-lg"}>
            <span>{label}{isRequired && <span className='text-red-600'>*</span>}</span>
          </Label>
          <Input
          {...register(name)}
          placeholder={placeholder} type={type} className={"rounded-lg! bg-input-bg p-6 placeholder:text-[#858B9E]"} />
        {errors && <p className='text-sm text-red-500'>{errors?.message}</p>}
        </div>
  )
}
