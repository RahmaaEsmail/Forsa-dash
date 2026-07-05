import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleProductSalesHistory } from "../../services/products";
import { toast } from "sonner";

export default function useProductSalesHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: "product-Sales-history",
    mutationFn: ({ id, page, per_page, signal }) => handleProductSalesHistory({ id, page, per_page, signal }),
    onSuccess: (res) => {},
    onError: (res) => {
      console.log("res", res);
      toast.error(
        res?.message ||
          res?.data?.message ||
          res?.response?.error?.data?.message,
      );
    },
  });
}
