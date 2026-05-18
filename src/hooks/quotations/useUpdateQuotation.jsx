import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateQuotation } from "../../services/quotations";
import { toast } from "sonner";

export const useUpdateQuotation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }) => handleUpdateQuotation({ id, body }),
        onSuccess: (data, variables) => {
            toast.success(data?.message || `Quotation updated successfully`);
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.error?.message || error?.response?.data?.message || "Failed to update quotation");
        }
    });
}
