import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleDeleteCategory } from '../../services/categories';
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';
import { useCategoriesStore } from '../../store/zustand/categoriesStore';
import { useSupplierStore } from '../../store/zustand/supplierStore';
import { handleDeleteSupplier } from '../../services/suppliers';

export default function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { filters } = useSupplierStore();
    const { search, page } = filters;
  return useMutation({
    mutationKey: ["deleteSupplier"],
    mutationFn: ({ signal, id }) => handleDeleteSupplier({ signal, id }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.suppliers_key , {search , page}],
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
