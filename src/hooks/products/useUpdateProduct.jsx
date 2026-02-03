import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleUpdateProduct } from '../../services/products'
import { toast } from 'sonner';

export default function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey : "updateProduct",
    mutationFn :(id , signal) => handleUpdateProduct({id , signal}),
    onSuccess:(res) => {
      console.log(res);
      if(res?.success || res?.data?.status == "success") {
        toast.success(res?.meta?.message || res?.data?.meta?.message);
        queryClient.invalidateQueries({
          queryKey :["products"],
          exact :false,
        })
      }
    },
    onError:(res) => {
      toast.error(res?.message || res?.data?.message || res?.response?.error?.data?.message)
    }
  })
}
