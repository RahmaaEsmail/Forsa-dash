import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export default function CustomInput({label,errors , register, type="text" , name , isRequired , placeholder, ...props}) {
  const getFieldError = (errs, path) => {
    if (!errs || !path) return null;
    const parts = path.split('.');
    let current = errs;
    for (const part of parts) {
      current = current?.[part];
    }
    return current;
  };
  const fieldError = getFieldError(errors, name) || (errors?.message ? errors : null);

  return (
   <div className='flex flex-col gap-2'>
          <Label className={"font-normal text-secondary text-lg"}>
            <span>{label}{isRequired && <span className='text-red-600'>*</span>}</span>
          </Label>
          <Input
          {...register(name, { required: isRequired ? `${label} is required` : false })}
          placeholder={placeholder} 
          type={type} 
          className={"rounded-lg! bg-input-bg p-6 placeholder:text-[#858B9E]"}
          {...props}
          />
        {fieldError && <p className='text-sm text-red-500'>{fieldError?.message}</p>}
        </div>
  )
}


