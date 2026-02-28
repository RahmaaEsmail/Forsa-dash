import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import {  handleToggleCategory } from '../../services/categories';
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';
import { useCategoriesStore } from '../../store/zustand/categoriesStore';

export default function useChangeCategoryStatus() {
  const queryClient = useQueryClient();
  const { filters } = useCategoriesStore();
    const { search, page, sort_order } = filters;
  return useMutation({
    mutationKey: ["changeCategoryStatus"],
    mutationFn: ({ signal, id }) => handleToggleCategory({ signal, id }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.categories_key , {search , sort_order, page , per_page : 4}],
          exact: true,
        })
      }
    },
    onError: (error) => {
      console.log("error", error)
      if (!error?.response?.data?.success) {
        toast.error(error?.response?.data?.error?.message);
      }
    }
  })

}
