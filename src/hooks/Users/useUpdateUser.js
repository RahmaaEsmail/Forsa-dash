import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUpdateUser } from "../../services/users";
import { toast } from "sonner";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body, signal }) => handleUpdateUser({ id, body, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "User updated successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to update user");
    },
  });
}
