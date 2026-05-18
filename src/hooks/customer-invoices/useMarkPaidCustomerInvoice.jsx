import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleMarkPaidCustomerInvoice } from "../../services/customer-invoices";
import { toast } from "sonner";

export default function useMarkPaidCustomerInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleMarkPaidCustomerInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoice-details", variables.id] });
      toast.success("Customer invoice marked as paid successfully!");
    },
    onError: (error) => {
      console.error("Error marking customer invoice paid:", error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to mark customer invoice paid.";
      toast.error(errMsg);
    }
  });
}
