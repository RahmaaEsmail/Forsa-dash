import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCreateCustomerInvoice } from "../../services/customer-invoices";
import { toast } from "sonner";

export default function useCreateCustomerInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleCreateCustomerInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-invoices"] });
      toast.success("Customer invoice created successfully!");
    },
    onError: (error) => {
      console.error("Error creating customer invoice:", error);
      const errMsg = (error?.response?.data?.error?.message)|| "Failed to create customer invoice.";
      toast.error(errMsg);
    }
  });
}
