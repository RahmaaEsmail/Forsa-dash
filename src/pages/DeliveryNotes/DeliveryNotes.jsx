import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus, Download, FileText } from 'lucide-react'
import DeliveryNoteTable from '../../components/pages/DeliveryNotes/DeliveryNoteTable'
import { useNavigate } from 'react-router-dom'
import useListDeliveryNotes from '../../hooks/delivery-notes/useListDeliveryNotes'
import CustomInput from '../../components/shared/CustomInput'

export default function DeliveryNotes() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: deliveryNotes, isLoading } = useListDeliveryNotes({
    page,
    per_page: 15,
    search
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8">
      <PageHeader title="Delivery Notes" subTitle="Manage dispatch and delivery records for customer orders.">
        <div className='flex gap-3 items-center'>
          <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export
          </Button>


        </div>
      </PageHeader>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[300px]">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Search</label>
              <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search by DO number, customer, or quotation..." 
                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={search}
                    onChange={handleSearchChange}
                  />
              </div>
          </div>
          <Button variant="ghost" className="h-11 px-6 text-slate-500 hover:text-primary font-bold" onClick={handleReset}>
              Reset
          </Button>
      </div>

      <DeliveryNoteTable 
        data={deliveryNotes} 
        isLoading={isLoading} 
        page={page} 
        setPage={setPage} 
      />
    </div>
  )
}
