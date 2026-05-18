import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteNotification } from "../../services/notifications";
import { toast } from "sonner";

export default function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, signal }) => handleDeleteNotification({ id, signal }),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.meta?.message || "Notification deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || "Failed to delete notification");
    },
  });
}
