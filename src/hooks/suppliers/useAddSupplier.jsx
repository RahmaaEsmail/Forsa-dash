import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleAddSupplier } from '../../services/suppliers';
import { QUERY_KEYS } from '../../constants';
import { toast } from 'sonner';

export default function useAddSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addSupplier"],
    mutationFn: ({ signal, body }) => handleAddSupplier({ signal, body }),
    onSuccess: (data) => {
      if (data?.success) {
        // toast.success(data?.meta?.message || "Supplier added successfully");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.suppliers_key],
        })
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.error?.message || error?.message || "An error occurred";
      toast.error(message);
    }
  })
}
