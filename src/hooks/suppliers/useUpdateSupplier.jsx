import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleUpdateSupplier } from '../../services/suppliers';
import { QUERY_KEYS } from '../../constants';
import { toast } from 'sonner';

export default function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSupplier"],
    mutationFn: ({ signal, id, body }) => handleUpdateSupplier({ signal, id, body }),
    onSuccess: (data, variables) => {
      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.suppliers_key],
        });
        queryClient.invalidateQueries({
          queryKey: ["supplier", variables.id.toString()],
        });
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.error?.message || error?.message || "An error occurred";
      toast.error(message);
    }
  })
}
