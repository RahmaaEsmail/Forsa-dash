import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateQuotationPrices } from "../../services/quotations";
import { toast } from "sonner";

export const useUpdateQuotationPrices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => handleUpdateQuotationPrices({ id, body }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Prices updated successfully");
      queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update prices");
    },
  });
};
