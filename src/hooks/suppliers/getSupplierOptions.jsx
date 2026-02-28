// categoriesOptions.js
import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../constants'
import { handleGetAllCategories } from '../../services/categories'
import { useCategoriesStore } from '../../store/zustand/categoriesStore';
import { useSupplierStore } from '../../store/zustand/supplierStore';
import { handleGetAllSupplier } from '../../services/suppliers';

export default function getSupplierOptions() {
  const { filters } = useSupplierStore();
  const { search, page } = filters;
  return queryOptions({
    queryKey: [QUERY_KEYS.suppliers_key, { search, page }],
    queryFn: ({ signal }) => handleGetAllSupplier({
      signal,
      page,
      per_page : 4,
      search,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  })
}