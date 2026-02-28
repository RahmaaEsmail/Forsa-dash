import { ArrowDownWideNarrow, ArrowUpWideNarrow, Filter } from 'lucide-react';
import React from 'react';
import { SelectGroup, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem } from '../../ui/select';
import { useCategoriesStore } from '../../../store/zustand/categoriesStore';

export default function CategoryFilterations() {
  const { filters, setFilters } = useCategoriesStore();
  
  // Destructuring the filters state to access search, sort_order, etc.
  const { search, sort_order } = filters;

  // Handle search input change
  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value, page: 1 }); // Reset page when search changes
  };

  // Handle sort order change
  const handleSortChange = (order) => {
    setFilters({ sort_order: order });
  };

  return (
    <div className="bg-white flex items-center rounded-main w-full">
      {/* Product Name Search */}
      <div className="p-6 w-150 text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200">
        <Input
          placeholder="Product Name"
          value={search}
          onChange={handleSearchChange} // Correctly using setFilters to update search
        />
      </div>

      {/* Filter Icon */}
      <div className="p-6 border-r px-7 border-gray-200">
        <Filter />
      </div>

      {/* Filter By Text */}
      <div className="p-6 text-secondary font-bold text-sm flex justify-center items-center border-r border-gray-200">
        <p>Filter By</p>
      </div>

      {/* Sort Order Select */}
      <div className="p-6 text-secondary font-bold text-sm flex justify-center items-center">
        <Select value={sort_order} onValueChange={handleSortChange}> {/* Use sort_order from filters */}
          <SelectTrigger className="flex items-center">
            <SelectValue placeholder="Sort" />
            {sort_order === 'asc' ? <ArrowUpWideNarrow /> : <ArrowDownWideNarrow />}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
