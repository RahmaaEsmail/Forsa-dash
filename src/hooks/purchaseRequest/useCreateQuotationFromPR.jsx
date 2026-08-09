import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCreateQuotation } from "../../services/purchase-request";
import { QUERY_KEYS } from "../../constants";
import { toast } from "sonner";

export default function useCreateQuotationFromPR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createQuotationFromPR"],
    mutationFn: ({ signal, id, body }) =>
      handleCreateQuotation({ signal, id, body }),
    onSuccess: (data) => {
      toast.success(data?.message || "Quotation created successfully!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.purchase_key,
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create quotation.",
      );
    },
  });
}
