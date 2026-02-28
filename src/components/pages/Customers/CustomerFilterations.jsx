import React from 'react';
import { Input } from '../../ui/input';
import { useCustomerStore } from '../../../store/zustand/customerStore';

export default function CustomerFilterations() {
  const { filters, setFilters } = useCustomerStore();
  const { search } = filters;

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value, page: 1 });
  };

  return (
    <div className="bg-white flex items-center justify-between rounded-main w-full shadow-sm">
      <div className="p-4 w-full md:max-w-md text-secondary font-bold text-sm flex items-center">
        <Input
          placeholder="Search customers..."
          value={search || ''}
          onChange={handleSearchChange}
          className="border border-gray-200"
        />
      </div> 
    </div>
  );
}
