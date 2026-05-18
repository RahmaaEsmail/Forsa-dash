import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus, Truck } from 'lucide-react'
import { useListDeliveryTypes } from '../../hooks/delivery-notes/useListDeliveryTypes'
import DeliveryTypeTable from '../../components/pages/DeliveryNotes/DeliveryTypeTable'
import DeliveryTypeModal from '../../components/pages/DeliveryNotes/DeliveryTypeModal'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Search, Filter, CheckCircle2, XCircle } from 'lucide-react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select"
import useDebounce from '../../hooks/useDebounce'

export default function DeliveryTypes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  
  const debouncedSearch = useDebounce(search, 500);

  const { data: deliveryTypesResponse, isLoading } = useListDeliveryTypes({
    search: debouncedSearch,
    is_active: isActiveFilter === "all" ? undefined : isActiveFilter === "active",
    per_page: 50
  });

  const deliveryTypes = deliveryTypesResponse?.data || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <PageHeader 
        title="Delivery Types" 
        subTitle="Manage different methods of delivering goods to customers"
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-11 px-4 rounded-xl border-slate-200 bg-slate-50/50 text-slate-600 gap-2 font-bold hidden md:flex">
            <Truck className="w-4 h-4 text-primary" />
            {deliveryTypes.length} Configured Types
          </Badge>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Delivery Type
          </Button>
        </div>
      </PageHeader>

      {/* Filters Section */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by code or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mr-2">
            <Filter className="w-4 h-4" />
            Status:
          </div>
          <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
            <SelectTrigger className="w-full md:w-40 h-11 rounded-xl border-slate-100 bg-slate-50/50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="active" className="text-emerald-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Active Only
                </div>
              </SelectItem>
              <SelectItem value="inactive" className="text-slate-400">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Inactive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        <DeliveryTypeTable 
          data={deliveryTypes} 
          isLoading={isLoading} 
        />
      </div>

      <DeliveryTypeModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </div>
  )
}
