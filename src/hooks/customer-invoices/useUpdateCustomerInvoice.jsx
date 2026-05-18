import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateCustomerInvoice } from "../../services/customer-invoices";
import { toast } from "sonner";

export default function useUpdateCustomerInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleUpdateCustomerInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["customer-invoice-details"] });
      toast.success("Customer invoice updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating customer invoice:", error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to update customer invoice.";
      toast.error(errMsg);
    }
  });
}
