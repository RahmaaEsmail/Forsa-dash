import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCancelCustomerInvoice } from "../../services/customer-invoices";
import { toast } from "sonner";

export default function useCancelCustomerInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleCancelCustomerInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoice-details", variables.id] });
      toast.success("Customer invoice cancelled successfully!");
    },
    onError: (error) => {
      console.error("Error cancelling customer invoice:", error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to cancel customer invoice.";
      toast.error(errMsg);
    }
  });
}
