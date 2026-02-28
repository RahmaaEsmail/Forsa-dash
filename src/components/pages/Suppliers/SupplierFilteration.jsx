import { ArrowDownWideNarrow, ArrowUpWideNarrow, Filter } from 'lucide-react';
import React from 'react';
import { SelectGroup, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem } from '../../ui/select';
import { useSupplierStore } from '../../../store/zustand/supplierStore';

export default function SupplierFilterations() {
  const { filters, setFilters } = useSupplierStore();
  
  // Destructuring the filters state to access search, sort_order, etc.
  const { search } = filters;

   console.log("search", search);
  // Handle search input change
  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value, page: 1 }); // Reset page when search changes
  };

  return (
    <div className="bg-white flex items-center rounded-main w-full">
      {/* Product Name Search */}
      <div className="p-6 w-full text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200">
        <Input
          placeholder="Product Name"
          value={search}
          onChange={handleSearchChange} // Correctly using setFilters to update search
        />
      </div> 
    </div>
  );
}
