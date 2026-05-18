import { ChevronDown, Filter, RotateCcw, Search } from 'lucide-react'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup } from '../../ui/select'
import { Input } from '../../ui/input'
import SearchableAsyncSelect from '../../shared/SearchableAsyncSelect'
import { handleGetAllSupplier } from '../../../services/suppliers'
import { handleGetRFQs } from '../../../services/rfqs'

export default function GRNFilter({ onFilter, onReset, filters = {} }) {
  function handleReset() {
    onReset();
  }

  function handleValueChange(name, value) {
    onFilter({
      ...filters,
      [name]: value
    });
  }

  return (
    <div className='bg-white flex w-full items-center rounded-2xl shadow-sm border border-slate-100 overflow-x-auto min-h-[70px]'>
       <div className='p-4 min-w-[250px] text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <div className="relative w-full">
          <Input 
            placeholder="Search GRN..." 
            value={filters?.search || ""}  
            onChange={(e) => handleValueChange("search", e.target.value)} 
            className="pl-9 h-10 bg-slate-50 border-none shadow-none focus-visible:ring-0"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className='p-4 border-r px-7 border-gray-200 text-slate-400'>
        <Filter size={20} />
      </div>

      <div className='p-4 text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200 whitespace-nowrap px-6'>
        <p>Filter By</p>
      </div>

      <div className='p-4 min-w-[200px] text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
         <SearchableAsyncSelect
            control={null}
            name="supplier_id"
            placeholder="Supplier"
            fetchFn={handleGetAllSupplier}
            queryKeyPrefix="suppliers"
            className="border-none bg-transparent h-auto p-0"
            value={filters?.supplier_id}
            onChange={(val) => handleValueChange("supplier_id", val)}
            hideLabel={true}
          />
      </div>

      <div className='p-4 min-w-[200px] text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
         <SearchableAsyncSelect
            control={null}
            name="rfq_id"
            placeholder="Purchase Order / RFQ"
            fetchFn={(params) => handleGetRFQs({ params: { ...params, view: 'po' } })}
            queryKeyPrefix="grn_rfqs"
            getOptionLabel={(option) => `#${option.rfq_number}`}
            className="border-none bg-transparent h-auto p-0"
            value={filters?.rfq_id}
            onChange={(val) => handleValueChange("rfq_id", val)}
            hideLabel={true}
          />
      </div>

      <div className='p-4 min-w-[150px] text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200'>
        <Select
          onValueChange={(e) => handleValueChange("status", e)}
          value={filters?.status || ""}
        >
          <SelectTrigger className='flex focus:outline-none border-none bg-transparent gap-2 items-center w-full justify-between shadow-none focus:ring-0'>
            <SelectValue placeholder="Status" />
            <ChevronDown size={15} className="text-slate-400" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div
        onClick={handleReset}
        className='p-4 gap-1.5 text-red-500 font-bold text-sm flex justify-center items-center cursor-pointer hover:bg-red-50 transition-colors px-6 ml-auto'>
        <RotateCcw size={16} />
        <p className="whitespace-nowrap">Reset Filter</p>
      </div>
    </div>
  )
}
