import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleChangeDeliveryStatus } from '../../services/deliveryNotes';
import { toast } from 'sonner';

export default function useChangeDeliveryNoteStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status , id, body}) => handleChangeDeliveryStatus({ status , id, body}),
    onSuccess: (res) => {
      if (res?.data?.success || res?.success) {
        toast.success(res?.data?.meta?.message || res?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: ["delivery-notes"],
          exact: false
        })
        queryClient.invalidateQueries({
          queryKey: ["delivery-note"],
          exact: false
        })
        // Delivering (or stepping back) a note can move the parent quotation
        // in/out of "delivered" server-side, so refetch quotation views too.
        queryClient.invalidateQueries({
          queryKey: ["quotations"],
          exact: false
        })
        queryClient.invalidateQueries({
          queryKey: ["quotation"],
          exact: false
        })
      }
    },
    onError: (res) => {
      toast.error(res?.response?.data?.error?.message);
    }

  })
}
