import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleMarkAllNotificationsRead } from "../../services/notifications";
import { toast } from "sonner";

export default function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables) => handleMarkAllNotificationsRead({ signal: variables?.signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "All notifications marked as read");
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["unread_count"] });
      }
    },
    onError: (err) => {
      console.error("Mark All Read Error:", err);
      toast.error(err?.response?.data?.error?.message || "Failed to mark all as read");
    },
  });
}
