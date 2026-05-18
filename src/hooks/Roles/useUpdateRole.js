import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateRole } from "../../services/roles";
import { toast } from "sonner";

export default function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body, signal }) => handleUpdateRole({ id, body, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "Role updated successfully");
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to update role");
    },
  });
}
