// categoriesOptions.js
import { queryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../constants'
import { handleGetAllCategories } from '../../services/categories'
import { useCategoriesStore } from '../../store/zustand/categoriesStore';

export default function categoriesOptions() {
  const { filters } = useCategoriesStore();
  const { search, page, sort_order } = filters;
  return queryOptions({
    queryKey: [...QUERY_KEYS.categories_key, { search, sort_order, page, per_page : 4 }],
    queryFn: ({ signal }) => handleGetAllCategories({
      signal,
      page,
      per_page : 4,
      search,
      sort_order
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  })
}