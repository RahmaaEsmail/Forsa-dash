import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleChangePurchaseRequestStatus } from '../../services/purchase-request';
import { QUERY_KEYS } from '../../constants';
import { toast } from 'sonner';

export default function useChangePurchaseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["changePurchaseStatus"],
    mutationFn: ({ signal, id, status, body }) => handleChangePurchaseRequestStatus({ signal, id, status, body }),
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
