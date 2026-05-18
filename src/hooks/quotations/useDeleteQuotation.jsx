import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteQuotation } from "../../services/quotations";
import { toast } from "sonner";

export const useDeleteQuotation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => handleDeleteQuotation(id),
        onSuccess: (data) => {
            toast.success(data?.message || "Quotation deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete quotation");
        }
    });
}
