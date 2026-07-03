import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  handleProductDetails,
  handleProductPurchaseHistory,
} from "../../services/products";
import { toast } from "sonner";

export default function useProductPurchaseHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: "product-purchase-history",
    mutationFn: ({ id, signal }) =>
      handleProductPurchaseHistory({ id, signal }),
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
