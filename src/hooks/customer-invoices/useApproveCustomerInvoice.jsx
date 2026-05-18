import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleApproveCustomerInvoice } from "../../services/customer-invoices";
import { toast } from "sonner";

export default function useApproveCustomerInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleApproveCustomerInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoice-details", variables.id] });
      toast.success("Customer invoice approved successfully!");
    },
    onError: (error) => {
      console.error("Error approving customer invoice:", error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to approve customer invoice.";
      toast.error(errMsg);
    }
  });
}
