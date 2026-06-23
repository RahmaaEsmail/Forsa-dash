import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../ui/select";

export default function QuotationFilter({ filters, onFilterChange, onReset }) {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (val) => {
    onFilterChange({ status: val === 'all' ? undefined : val });
  };

  const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search quotation number or customer..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="pl-10 h-11 bg-slate-50/50 border-slate-100 rounded-xl"
        />
      </div>

      <div className="w-[200px]">
        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-11 bg-slate-50/50 border-slate-100 rounded-xl">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="client_approval">Client Approval</SelectItem>
            <SelectItem value="sales_manager_approval">Sales Manager Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
    

        {hasFilters && (
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="h-11 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-bold"
          >
            <X className="w-4 h-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
