import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCreateUser } from "../../services/users";
import { toast } from "sonner";

export default function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, signal }) => handleCreateUser({ body, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "User created successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to create user");
    },
  });
}
