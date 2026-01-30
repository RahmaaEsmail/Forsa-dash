import { ChevronDown, Filter, RotateCcw, Star } from 'lucide-react'
import React, { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectLabel } from '../../ui/select'
import { SelectGroup, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Input } from '../../ui/input'

export default function QuotationsFilter({ setFilter, filter }) {

  function handleReset() {
    setFilter({
      date: "",
      status: "",
      favorite: "",
    })
  }

  function handleValueChange(name, value) {
    setFilter({
      ...filter,
      [name]: value
    })
  }
  
  console.log("search",filter);

  return (
    <div className='bg-white flex w-full  items-center rounded-main'>
       <div className='p-6 w-[350px]  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <Input placeholder="Search" value={filter?.name}  onChange={(e) => handleValueChange("name", e.target.value)} />
      </div>

      <div className='p-6 border-r px-7 border-gray-200'>
        <Filter />
      </div>

      <div className='p-6  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <p>Filter By</p>
      </div>

      <div className='p-6  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <Select
          onValueChange={(e) => handleValueChange("date", e)}
          value={filter?.date}
        >
          <SelectTrigger className='flex focus:outline-none focus:border-0 gap-1.5 items-center'>
            <SelectValue placeholder="date" />
            <ChevronDown size={15} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="wood">Wood</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

     

      <div className='p-6  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <Select
          onValueChange={(e) => handleValueChange("status", e)}
          value={filter?.status}
        >
          <SelectTrigger className='flex focus:outline-none focus:border-0 gap-1.5 items-center'>
            <SelectValue placeholder="Order Status" />
            <ChevronDown size={15} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="rfq">RFQ</SelectItem>
              <SelectItem value="approved">Waiting PM Approval</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

        <div className='p-6 gap-2  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
         <Star color="#F16000" stroke='#F16000' fill='#F16000' size={20}/>
         <span>Favourite</span>
      </div>

      <div
        onClick={handleReset}
        className='p-6  gap-1.5  text-danger font-bold text-sm flex justify-center items-center'>
        <RotateCcw cursor={"pointer"} size={16} />
        <p className='cursor-pointer'>Reset Filter</p>
      </div>
    </div>
  )
}
