import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus, Download } from 'lucide-react'
import QuotationFilter from '../../components/pages/Quotations/QuotationFilter'
import QuotationTable from '../../components/pages/Quotations/QuotationTable'
import { useNavigate } from 'react-router-dom'
import { useListQuotations } from '../../hooks/quotations/useListQuotations'
import ExportExcelModal from '../../components/shared/ExportExcelModal'

const QUOTATION_COL_MAP = {
  quotation_number: 'Quotation #',
  quotation_date:   'Date',
  'customer.name':  'Customer',
  'customer.company_name': 'Company',
  'purchase_request.pr_number': 'PR Number',
  total_amount:     'Total Amount',
  'currency.code':  'Currency',
  status:           'Status',
};

export default function Quotations() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
  });

  const { data: quotations, isLoading } = useListQuotations({
    page,
    per_page: 15,
    ...filters
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ search: '', status: undefined });
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8">
      <PageHeader title="Quotations Management" subTitle="Manage and track all customer quotations in one place.">
        <div className='flex gap-3 items-center'>
          <Button
            variant="outline"
            className="h-11 px-6 rounded-xl border-primary text-primary gap-2 font-bold hover:bg-primary/5"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="w-4 h-4" />
            {selectedRowKeys.length > 0 ? `Export Selected (${selectedRowKeys.length})` : 'Export Excel'}
          </Button>

          <Button 
            onClick={() => navigate(`/create_quote`)}
            className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Create Quotation
          </Button>
        </div>
      </PageHeader>

      <QuotationFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={handleReset} 
      />

      <QuotationTable 
        data={quotations} 
        isLoading={isLoading} 
        page={page} 
        setPage={setPage} 
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={setSelectedRowKeys}
      />

      <ExportExcelModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        data={quotations?.data || []}
        selectedRowKeys={selectedRowKeys}
        columnMap={QUOTATION_COL_MAP}
        filename="quotations"
      />
    </div>
  )
}
