import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { handleGetRFQDetails, handleUpdateRFQ, handleChangeRFQStatus } from "../../services/rfqs";
import { toast } from "sonner";

export const RFQ_QUERY_KEYS = {
  details: (id) => ["rfq", id],
  list: (params) => ["rfqs", params],
};

export const useRFQDetails = (id) => {
  return useQuery({
    queryKey: RFQ_QUERY_KEYS.details(id),
    queryFn: ({ signal }) => handleGetRFQDetails({ signal, id }),
    enabled: !!id,
  });
};

export const useUpdateRFQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => handleUpdateRFQ({ id, body }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "RFQ updated successfully");
      queryClient.invalidateQueries({ queryKey: RFQ_QUERY_KEYS.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to update RFQ");
    },
  });
};

export const useChangeRFQStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, body }) => handleChangeRFQStatus({ id, status, body }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || `Status changed to ${variables.status} successfully`);
      queryClient.invalidateQueries({ queryKey: RFQ_QUERY_KEYS.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to Change Rfq Status");
      toast.error(res?.message || res?.data?.message || res?.response?.error?.data?.message)
    },
  });
};
