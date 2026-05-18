import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateQuotationStatus } from "../../services/quotations";
import { toast } from "sonner";

export const useUpdateQuotationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, body }) => handleUpdateQuotationStatus({ id, status, body }),
        onSuccess: (data, variables) => {
            toast.success(data?.message || `Quotation status updated successfully`);
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.error?.message || error?.response?.data?.message || "Failed to update quotation status");
        }
    });
}
