import { useQuery } from "@tanstack/react-query";
import { handleGetAllRoles } from "../../services/roles";

export default function useListRoles(params) {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: ({ signal }) => handleGetAllRoles({ signal, params }),
  });
}
