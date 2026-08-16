import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleStepBackCustomerInvoice } from "../../services/customer-invoices";
import { toast } from "sonner";

export default function useStepBackCustomerInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleStepBackCustomerInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoice-details", variables.id] });
      toast.success("Customer invoice stepped back successfully!");
    },
    onError: (error) => {
      console.error("Error stepping back customer invoice:", error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to step back customer invoice.";
      toast.error(errMsg);
    }
  });
}
