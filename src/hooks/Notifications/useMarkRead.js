import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleMarkNotificationRead } from "../../services/notifications";
import { toast } from "sonner";

export default function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, signal }) => handleMarkNotificationRead({ id, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["unread_count"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to mark as read");
    },
  });
}
