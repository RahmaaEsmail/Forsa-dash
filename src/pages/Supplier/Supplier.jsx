import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Download, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SuppliersTable from '../../components/pages/Suppliers/SuppliersTable'
import { useQuery } from '@tanstack/react-query'
import getAllSupplierOptions from '../../hooks/suppliers/getAllSupplierOptions'
import getSupplierOptions from '../../hooks/suppliers/getSupplierOptions'
import { useSupplierStore } from '../../store/zustand/supplierStore'
import Pagination from '../../components/shared/Pagination'
import SupplierFilterations from '../../components/pages/Suppliers/SupplierFilteration'
import { exportToExcel } from '../../utils/exportToExcel'

export default function Supplier() {
  const navigate = useNavigate();
  const {filters , setFilters} = useSupplierStore();
  const {page} = filters;
   
  const {
    data : all_suppliers,
    isLoading : fetch_suppliers
  } = useQuery(getSupplierOptions())

    const totals = all_suppliers?.meta?.total || 0;

  function handlePageChange(num) {
    setFilters({page : num});
  }


   
  const SUPPLIER_COL_MAP = {
    id: '#',
    company_name: 'Company',
    commercial_register: 'CR',
    vat_number: 'VAT',
    email: 'Email',
    mobile: 'Mobile',
    phone: 'Phone',
    source_of_supply: 'Source',
    tax_treatment: 'Tax',
    lead_time_days: 'Lead Time (days)',
    minimum_order_value: 'Min Order',
    rating: 'Rating',
    is_active: 'Active',
    website: 'Website',
    notes: 'Notes',
  };

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={"Suppliers"}
        subTitle={
          "Manage all Suppliers, control visibility, and keep suppliers data up to date."
        }
      >
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="border-primary text-primary font-bold hover:bg-primary/5 gap-2"
            onClick={() => exportToExcel(all_suppliers?.data || [], 'suppliers', SUPPLIER_COL_MAP)}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button
            onClick={() => navigate("/create-supplier")}
            className={"px-3!"}>
            <Plus />
            <span>Add new Supplier</span>
          </Button>
        </div>
      </PageHeader>

       <SupplierFilterations />
      <SuppliersTable 
        data={all_suppliers?.data}
        loading={fetch_suppliers}
      />

      <Pagination page={page} per_page={10} total={totals}  onPageChange={handlePageChange}/>
    </div>
  )
}
