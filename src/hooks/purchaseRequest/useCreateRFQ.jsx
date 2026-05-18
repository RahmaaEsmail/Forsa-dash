import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleCreateRFQ } from '../../services/purchase-request';
import { QUERY_KEYS } from '../../constants';
import { toast } from 'sonner';

export default function useCreateRFQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createRFQ"],
    mutationFn: ({ signal, id, body }) => handleCreateRFQ({ signal, id, body }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.message || "RFQ created successfully!");
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.purchase_key,
        })
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create RFQ.");
    }
  })
}
