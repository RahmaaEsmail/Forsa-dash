import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleChangeCustomerStatus } from "../../services/customers";

export default function useChangeCustomerStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleChangeCustomerStatus,
        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data?.message || "Status changed successfully");
            }
            queryClient.invalidateQueries(["customers"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to change status");
        }
    });
}
