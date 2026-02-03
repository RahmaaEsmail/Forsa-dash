import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleProductDetails } from '../../services/products'
import { toast } from 'sonner';

export default function useProductDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: "productDetails",
    mutationFn: (id, signal) => handleProductDetails({ id, signal }),
    onSuccess: (res) => {
      console.log(res);
      if (res?.success || res?.data?.status == "success") {
        queryClient.invalidateQueries({
          queryKey: ["products"],
          exact: false,
        })
      }
    },
    onError: (res) => {
      toast.error(res?.message || res?.data?.message || res?.response?.error?.data?.message)
    }
  })
}
