import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleUpdatePurchaseRequest } from '../../services/purchase-request';

export default function useUpdatePurchaseRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body, signal }) => handleUpdatePurchaseRequest({ id, body, signal }),
    onSuccess: () => {
      queryClient.invalidateQueries(["purchase-requests"]);
    },
  })
}
