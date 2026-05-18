import { useQuery } from "@tanstack/react-query";
import { handleGetAllPermissions } from "../../services/roles";

export default function useListPermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: ({ signal }) => handleGetAllPermissions({ signal }),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
