import { useQuery } from "@tanstack/react-query";
import { handleListUsers } from "../../services/users";

export default function useListUsers(params) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: ({ signal }) => handleListUsers({ params, signal }),
  });
}
