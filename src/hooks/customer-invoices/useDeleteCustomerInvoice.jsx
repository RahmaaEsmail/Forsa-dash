import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteCustomerInvoice } from "../../services/customer-invoices";
import { toast } from "sonner";

export default function useDeleteCustomerInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleDeleteCustomerInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      toast.success("Customer invoice deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting customer invoice:", error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error?.message || "Failed to delete customer invoice.";
      toast.error(errMsg);
    }
  });
}
