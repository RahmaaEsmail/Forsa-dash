import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SuppliersTable from '../../components/pages/Suppliers/SuppliersTable'
import { useQuery } from '@tanstack/react-query'
import getAllSupplierOptions from '../../hooks/suppliers/getAllSupplierOptions'
import getSupplierOptions from '../../hooks/suppliers/getSupplierOptions'
import { useSupplierStore } from '../../store/zustand/supplierStore'
import Pagination from '../../components/shared/Pagination'
import SupplierFilterations from '../../components/pages/Suppliers/SupplierFilteration'

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


   
  return (

    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={"Suppliers"}
        subTitle={
          "Manage all Suppliers, control visibility, and keep suppliers data up to date."
        }
      >
        {/* <Button
          onClick={() => navigate("/create-supplier")}
          className={"px-3!"}>
          <Plus />
          <span>Add new Supplier</span>
        </Button> */}
      </PageHeader>

       <SupplierFilterations />
      <SuppliersTable 
        data={all_suppliers?.data}
        loading={fetch_suppliers}
      />

      <Pagination page={page} per_page={4} total={totals}  onPageChange={handlePageChange}/>
    </div>
  )
}
