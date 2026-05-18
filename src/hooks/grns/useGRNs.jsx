import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  handleGetAllGRNS, 
  handleGetGRNDetails, 
  handleCreateGRNS, 
  handleUpdateGRNS, 
  handleDeleteGRNS,
  handleApproveGRN,
  handleRejectGRN
} from "../../services/GRNS";
import { toast } from "sonner";

export const GRN_QUERY_KEYS = {
  details: (id) => ["grn", id],
  list: (params) => ["grns", params],
};

export const useListGRNs = (params) => {
  return useQuery({
    queryKey: GRN_QUERY_KEYS.list(params),
    queryFn: ({ signal }) => handleGetAllGRNS({ signal, params }),
  });
};

export const useGRNDetails = (id) => {
  return useQuery({
    queryKey: GRN_QUERY_KEYS.details(id),
    queryFn: ({ signal }) => handleGetGRNDetails({ signal, id }),
    enabled: !!id,
  });
};

export const useCreateGRN = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body }) => handleCreateGRNS({ body }),
    onSuccess: (data) => {
      toast.success(data?.message || "GRN created successfully");
      queryClient.invalidateQueries({ queryKey: ["grns"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to create GRN");
    },
  });
};

export const useUpdateGRN = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => handleUpdateGRNS({ id, body }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "GRN updated successfully");
      queryClient.invalidateQueries({ queryKey: GRN_QUERY_KEYS.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["grns"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to update GRN");
    },
  });
};

export const useDeleteGRN = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => handleDeleteGRNS({ id }),
    onSuccess: (data) => {
      toast.success(data?.message || "GRN deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["grns"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to delete GRN");
    },
  });
};

export const useApproveGRN = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => handleApproveGRN({ id }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "GRN approved successfully");
      queryClient.invalidateQueries({ queryKey: GRN_QUERY_KEYS.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["grns"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to approve GRN");
    },
  });
};

export const useRejectGRN = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => handleRejectGRN({ id, reason }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "GRN rejected successfully");
      queryClient.invalidateQueries({ queryKey: GRN_QUERY_KEYS.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["grns"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to reject GRN");
    },
  });
};
