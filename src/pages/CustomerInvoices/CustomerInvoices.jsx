import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/shared/Pagination'
import useCustomerInvoices from '../../hooks/customer-invoices/useCustomerInvoices'
import CustomerInvoicesTable from '../../components/pages/CustomerInvoices/CustomerInvoicesTable'

export default function CustomerInvoices() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const per_page = 10;

  const { data, isLoading } = useCustomerInvoices({
    page,
    per_page
  });

  console.log("data", data);
  const totals = data?.meta?.total || 0;

  function handlePageChange(num) {
    setPage(num);
  }

  return (
    <div className="flex pb-6 flex-col gap-8 container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <PageHeader
        title="Customer Invoices"
        subTitle="Manage and track your client billing invoices, edit pending drafts, and keep financial logs aligned."
      >
        <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
          <Receipt className="w-6 h-6" />
        </div>
      </PageHeader>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
        <CustomerInvoicesTable
          page={page}
          per_page={per_page}
          data={data?.data || []}
          loading={isLoading}
        />
        
        {totals > per_page && (
          <div className="mt-6 flex justify-end">
            <Pagination 
              page={page} 
              per_page={per_page} 
              onPageChange={handlePageChange} 
              total={totals} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
