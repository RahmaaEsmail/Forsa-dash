import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteUser } from "../../services/users";
import { toast } from "sonner";

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, signal }) => handleDeleteUser({ id, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "User deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to delete user");
    },
  });
}
