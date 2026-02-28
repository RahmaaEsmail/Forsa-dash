import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleDeletePurchaseRequest } from '../../services/purchase-request';
import { toast } from 'sonner';
import { QUERY_KEYS } from '../../constants';

export default function useDeletePurchaseRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deletePurchaseRequest"],
    mutationFn: ({ signal, id }) => handleDeletePurchaseRequest({ signal, id }),
    onSuccess: (data) => {
      console.log("data", data);
      if (data?.success) {
        toast.success(data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.purchase_key,
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
