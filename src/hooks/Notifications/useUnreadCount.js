import { useQuery } from "@tanstack/react-query";
import { handleGetUnreadNotificationsCount } from "../../services/notifications";

export default function useUnreadCount() {
  return useQuery({
    queryKey: ["unread_count"],
    queryFn: ({ signal }) => handleGetUnreadNotificationsCount({ signal }),
    staleTime: 60 * 1000, // 1 minute
  });
}
