import { useQuery } from "@tanstack/react-query";
import { handleGetAllNotifications } from "../../services/notifications";

export default function useListNotifications(params) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: ({ signal }) => handleGetAllNotifications({ signal, params }),
  });
}
