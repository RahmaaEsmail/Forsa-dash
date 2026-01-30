import React, { useEffect, useMemo, useState } from 'react'
import {  useFormContext } from 'react-hook-form'
import CustomInput from '../../../shared/CustomInput'
import axios from 'axios'
import { useCurrencyFlags } from '../../../../hooks/useCurrencyFlags'
import CustomSelect from '../../../shared/CustomSelect'

const getFirstCurrency = (currenciesObj) => {
  if (!currenciesObj) return null;
  const codes = Object.keys(currenciesObj);
  if (!codes.length) return null;
  const code = codes[0];
  return { code, ...currenciesObj[code] }; // {code:"EGP", name:"Egyptian pound", symbol:"£"}
};


export default function AddProductPrice() {
  const { data , isLoading } = useCurrencyFlags();


  const currencyData = useMemo(() => { 
    if(data?.data) 
      return data?.data
    return []
  },[data])

  const uniqueCurrencyOptions = useMemo(() => {
    const map = new Map();
    for (const item of currencyData ?? []) {
      const cur = getFirstCurrency(item?.currencies);
      if (!cur) continue;
      if (!map.has(cur.code)) {
        map.set(cur.code, {
          value: cur.code,
          textValue: `${cur.code} - ${cur.name}`,
          label: (
            <div className="flex items-center gap-2">
              <img src={item?.flags?.png} alt={item?.flags?.alt} className='w-5 h-5' />
              <span className="text-muted-foreground">
                — {cur.name}{cur.symbol ? ` (${cur.symbol})` : ""}
              </span>
            </div>
          ),
        });
      }
    }
    return Array.from(map.values());
  }, [currencyData]);


  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useFormContext();

  function onSubmit(values) {
    console.log("values", values);
  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-7'>
      <div className='grid grid-cols-3 gap-7'>
        <CustomSelect isRequired={true} control={control} options={uniqueCurrencyOptions} errors={errors?.currency} label={"Currency"} name={"currency"} placeholder={"e.g 1300"} />
        <CustomInput register={register} errors={errors?.cost_price} label={"Cost Price"} name={"cost_price"} placeholder={"e.g 1300"} />
        <CustomInput register={register} errors={errors?.selling_price} label={"Selling Price"} name={"selling_price"} placeholder={"e.g 1300"} />
      </div>

      <CustomInput register={register} errors={errors?.discount_role} label={"Default Discount Rule"} name={"discount_role"} placeholder={"e.g 1300"} />
 
    </form>
  )
}
