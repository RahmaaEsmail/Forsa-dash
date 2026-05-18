import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCreateRole } from "../../services/roles";
import { toast } from "sonner";

export default function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, signal }) => handleCreateRole({ body, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "Role created successfully");
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to create role");
    },
  });
}
