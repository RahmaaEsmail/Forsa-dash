import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import categoriesOptions from '../../hooks/categories/categoriesOptions'
import Pagination from '../../components/shared/Pagination'
import CategoriesTable from '../../components/pages/Categories/CategoriesTable'
import UnitsFilterations from '../../components/pages/Units/UnitsFilterations'
import { useUnitStore } from '../../store/zustand/unitsStore'
import UnitsTable from '../../components/pages/Units/UnitsTable'
import getAllUnitsOptions from '../../hooks/units/getAllUnitsOptions'
import AddUnitModal from '../../components/pages/Units/AddUnitModal'

export default function UnitsPage() {
  const navigate = useNavigate();

  const { filters, setFilters } = useUnitStore();
  const { search, page, sort_order } = filters;

  const [addNewModal , setAddNewModal] = useState(false);
  // data
  const per_page = 4;
  const {
    data: all_units,
    isLoading: units_loading,
  } = useQuery(getAllUnitsOptions())

  const totals = all_units?.meta?.total || 0;

  function handlePageChange(num) {
    setFilters({page : num});
  }



  return (
    <div className="flex pb-6 flex-col gap-10"> <PageHeader
      title={"Units"}
      subTitle={
        "Manage all Units, control visibility, and keep units data up to date."
      }
    >
      <Button 
      onClick={() =>navigate("/create-unit")}
      className={"px-3!"}>
        <Plus />
        <span>Add new Unit</span>
      </Button>
    </PageHeader>

      <UnitsFilterations /> 
      <UnitsTable
        searc={filters?.search}
        page={filters?.page}
        sortOrder={filters?.sort_order}
        per_page={per_page}
        data={all_units?.data || []} loading={units_loading} />
      
      <Pagination page={filters?.page} per_page={per_page} onPageChange={handlePageChange} total={totals} />
    </div>
  )
}
