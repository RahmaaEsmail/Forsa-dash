import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleAddProduct } from '../../services/products'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function useAddProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 

  return useMutation({
    mutationKey : ["addProduct"],
    mutationFn : ({body,signal}) => handleAddProduct({body,signal}) ,
    onSuccess:(res) => {
      console.log("res success from query", res);
      if(res?.data?.success) {
        toast.success(res?.data?.meta?.message);
        navigate("/products");
        queryClient.invalidateQueries({
          queryKey : ["products"] ,
          exact : false
        })
      }
    },
    onError:(res) => {
      console.log("res error from query", res);
     toast.error(res?.response?.data?.error?.message);
    }
  })
}

export default useAddProduct