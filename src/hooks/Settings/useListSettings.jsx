import { useQuery } from "@tanstack/react-query";
import { handleGetAllSettings } from "../../services/settings";

export default function useListSettings() {
  return useQuery({
    queryKey: 'settings',
    queryFn: ({ signal }) => handleGetAllSettings({ signal }),
    staleTime: 5 * 60 * 1000,
  })
}