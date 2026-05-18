import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCreateNotification } from "../../services/notifications";
import { toast } from "sonner";

export default function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, signal }) => handleCreateNotification({ body, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "Notification created successfully");
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to create notification");
    },
  });
}
