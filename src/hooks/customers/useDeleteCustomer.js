import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleDeleteCustomer } from "../../services/customers";

export default function useDeleteCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleDeleteCustomer,
        onSuccess: (data) => {
            
            if (data?.success) {
                toast.success(data?.meta?.message);
            }
            queryClient.invalidateQueries(["customers"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || "Failed to delete customer");
        }
    });
}
