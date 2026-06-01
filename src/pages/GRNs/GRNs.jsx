import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useListGRNs } from '../../hooks/grns/useGRNs'
import GRNTable from '../../components/pages/GRNs/GRNTable'
import GRNFilter from '../../components/pages/GRNs/GRNFilter'

export default function GRNs() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data: grns, isLoading } = useListGRNs({
    page,
    per_page: 15,
    ...filters
  });

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8">
      <PageHeader title="Goods Received Notes" subTitle="Track and manage received inventory from suppliers.">
        <div className='flex gap-3 items-center'>
          <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export
          </Button>


        </div>
      </PageHeader>

      <GRNFilter 
        onFilter={handleFilter} 
        onReset={handleReset} 
        filters={filters} 
      />

      <GRNTable 
        data={grns} 
        isLoading={isLoading} 
        page={page} 
        setPage={setPage} 
      />
    </div>
  )
}
