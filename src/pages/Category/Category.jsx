import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import categoriesOptions from '../../hooks/categories/categoriesOptions'
import Pagination from '../../components/shared/Pagination'
import CategoriesTable from '../../components/pages/Categories/CategoriesTable'
import CategoryFilterations from '../../components/pages/Categories/CategoryFilter'
import { useCategoriesStore } from '../../store/zustand/categoriesStore'

export default function Category() {
  const navigate = useNavigate();

  const { filters, setFilters } = useCategoriesStore();
  const { search, page, sort_order } = filters;


  // data
  const per_page = 4;
  const {
    data: categories,
    isLoading: categories_loading,
  } = useQuery(categoriesOptions())

  const totals = categories?.meta?.total || 0;

  function handlePageChange(num) {
    setFilters({page : num});
  }



  return (
    <div className="flex pb-6 flex-col gap-10"> <PageHeader
      title={"Category Catalog"}
      subTitle={
        "Manage all building material catgories, control visibility, and keep category data up to date."
      }
    >
      <Button onClick={() => navigate(`/create-categories`)} className={"px-3!"}>
        <Plus />
        <span>Add new category</span>
      </Button>
    </PageHeader>

      <CategoryFilterations />
      <CategoriesTable
        searc={filters?.search}
        page={filters?.page}
        sortOrder={sort_order}
        per_page={per_page}
        data={categories?.data || []} loading={categories_loading} />

      <Pagination page={filters?.page} per_page={per_page} onPageChange={handlePageChange} total={totals} />
    </div>
  )
}
