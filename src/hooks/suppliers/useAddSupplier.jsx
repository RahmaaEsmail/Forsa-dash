import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleAddSupplier } from '../../services/suppliers';
import { QUERY_KEYS } from '../../constants';

export default function useAddSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey : "addSupplier",
    mutationFn:({signal , body}) => handleAddSupplier({signal , body}),
       onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.suppliers_key, { search, page }],
          exact: true,
        })
      }
    },
    onError: (error) => {
      if (!error?.response?.data?.success) {
        toast.error(error?.response?.data?.error?.message);
      }
    }
  })
}
