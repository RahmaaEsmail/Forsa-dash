import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useCategoriesStore } from '../../store/zustand/categoriesStore';
import { handleAddCategory, handleEditCategory } from '../../services/categories';
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';

export default function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { filters } = useCategoriesStore();
  const { search, page, sort_order } = filters;


  return useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: ({ signal,id, body }) => handleEditCategory({ signal,id, body }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.categories_key, { search, sort_order, page, per_page: 4 }],
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
