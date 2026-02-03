import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleDeleteProduct } from '../../services/products';
import { toast } from 'sonner';

export default function useDeleteProduct() {
 const queryClient = useQueryClient();

 return useMutation({
  mutationKey : "deleteProduct",
  mutationFn : (id, signal) => handleDeleteProduct({id , signal}),
  onSuccess:(res) => {
    if(res?.success){
      toast.success(res?.meta?.message);
      queryClient.invalidateQueries({
          queryKey : ["products"] ,
          exact : false
        })
    }
  },
  onError :(res) => {
    toast.error(res?.response?.data?.error?.message || res?.message || "There's error while deleting product");
  }
 })
}
