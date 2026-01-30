import { ChevronDown, Filter, RotateCcw } from 'lucide-react'
import React, { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectLabel } from '../../../ui/select'
import { SelectGroup, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Input } from '../../../ui/input'

export default function ProductFilterations({ setFilter, filter }) {

  function handleReset() {
    setFilter({
      category: "",
      name: "",
      visibility: "",
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
    <div className='bg-white flex w-fit  items-center rounded-main'>
       <div className='p-6 w-[350px]  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        {/* <Select onValueChange={(e) => handleValueChange("name", e)}
          value={filter?.name}>
          <SelectTrigger className='flex focus:outline-none focus:border-0 gap-1.5 items-center'>
            <SelectValue placeholder="Product Name" />
            <ChevronDown size={15} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Product Name</SelectLabel>
              <SelectItem value="wood">Wood</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
        <Input placeholder="Product Name" value={filter?.name}  onChange={(e) => handleValueChange("name", e.target.value)} />
      </div>

      <div className='p-6 border-r px-7 border-gray-200'>
        <Filter />
      </div>

      <div className='p-6  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <p>Filter By</p>
      </div>

      <div className='p-6  text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <Select
          onValueChange={(e) => handleValueChange("category", e)}
          value={filter?.category}
        >
          <SelectTrigger className='flex focus:outline-none focus:border-0 gap-1.5 items-center'>
            <SelectValue placeholder="Category" />
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
          onValueChange={(e) => handleValueChange("visibility", e)}
          value={filter?.visibility}
        >
          <SelectTrigger className='flex focus:outline-none focus:border-0 gap-1.5 items-center'>
            <SelectValue placeholder="Order Visibility" />
            <ChevronDown size={15} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Visibility</SelectLabel>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
