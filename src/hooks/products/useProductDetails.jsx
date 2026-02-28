import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleProductDetails } from '../../services/products'
import { toast } from 'sonner';

export default function useProductDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: "productDetails",
    mutationFn: ({id, signal}) => handleProductDetails({ id, signal }),
    onSuccess: (res) => {
    },
    onError: (res) => {
      console.log("res",res);
      toast.error(res?.message || res?.data?.message || res?.response?.error?.data?.message)
    }
  })
}
