import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleUpdateSettings } from "../../services/settings";
import { toast } from "sonner";

export default function useUpdateSettings() {
  const query = useQueryClient();
  return useMutation({
    mutationFn : ({body , signal}) => handleUpdateSettings({body,signal}),
    onSuccess : (res) => {
      if(res?.success) {
        toast.success(res?.meta?.message)
        query.invalidateQueries({
          queryKey : "settings",
          exact : false
        })
      }
    },
    onError:(res) => {
      toast.error(res?.response?.data?.error?.message || res?.data?.error?.message);
    }
  })
}