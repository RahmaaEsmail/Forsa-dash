import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleProductStatus } from '../../services/products'
import { toast } from 'sonner';

export default function useUpdateActiveStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey:"updateProdutStatus",
    mutationFn : (signal) => handleProductStatus({signal}),
    onSuccess:(res) => {
      console.log("res",res);
      if(res?.success || res?.data?.status == "success") {
        toast.success(res?.meta?.message);
        queryClient.invalidateQueries({
          queryKey : ["products"],
          exact : false
        })
      }
    },
    onError:(res) => {
      toast.error(res?.message || res?.data?.message || res?.response?.error?.data?.message)
    }
  })
}
