import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteRole } from "../../services/roles";
import { toast } from "sonner";

export default function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, signal }) => handleDeleteRole({ id, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "Role deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to delete role");
    },
  });
}
