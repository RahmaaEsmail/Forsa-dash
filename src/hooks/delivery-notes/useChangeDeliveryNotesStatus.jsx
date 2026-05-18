import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleChangeDeliveryStatus } from '../../services/deliveryNotes';
import { toast } from 'sonner';

export default function useChangeDeliveryNoteStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status , id}) => handleChangeDeliveryStatus({ status , id}),
    onSuccess: (res) => {
      if (res?.data?.success || res?.success) {
        toast.success(res?.data?.meta?.message || res?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: ["delivery-notes"],
          exact: false
        })
      }
    },
    onError: (res) => {
      toast.error(res?.response?.data?.error?.message);
    }

  })
}
