import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import {  handledeleteCustomerPayment } from '../../services/customer-payments';
import { toast } from 'sonner';

export default function useDeleteCustomerPayment() {
  const queryClient = useQueryClient();
  return useMutation({
   mutationFn : ({signal , id}) => handledeleteCustomerPayment({signal, id}),
   onSuccess :(res) => {
    if(res?.success) {
      toast.success(res?.meta?.message);
      queryClient.invalidateQueries({
        queryKey:["customer-payments"],
        exact : false
      })
    }
   },
   onError : (res) => {
    toast.error(res?.response?.data?.error?.message  || res?.data?.error?.message)
   }
  })
}
