import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  handleGetActivityLogs, 
  handleAddComment, 
  handleUpdateComment, 
  handleDeleteComment,
  handleGetActivityMentions
} from "../../services/activity-logs";
import { toast } from "sonner";

export const ACTIVITY_LOG_QUERY_KEYS = {
  list: (modelType, modelId) => ["activity-logs", modelType, modelId],
  mentions: () => ["activity-logs", "mentions"],
};

export const useActivityLogsList = (modelType, modelId) => {
  return useQuery({
    queryKey: ACTIVITY_LOG_QUERY_KEYS.list(modelType, modelId),
    queryFn: ({ signal }) => 
      handleGetActivityLogs({ 
        params: { model_type: modelType, model_id: modelId }, 
        signal 
      }),
    enabled: !!modelType && !!modelId,
  });
};

export const useActivityMentions = () => {
  return useQuery({
    queryKey: ACTIVITY_LOG_QUERY_KEYS.mentions(),
    queryFn: ({ signal }) => handleGetActivityMentions({ signal }),
  });
};

export const useAddActivityLogComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body }) => handleAddComment({ body }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Comment added successfully");
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_LOG_QUERY_KEYS.list(variables.body.model_type, variables.body.model_id),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error?.message || 
        "Failed to add comment"
      );
    },
  });
};

export const useUpdateActivityLogComment = (modelType, modelId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => handleUpdateComment({ id, body }),
    onSuccess: (data) => {
      toast.success(data?.message || "Comment updated successfully");
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_LOG_QUERY_KEYS.list(modelType, modelId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error?.message || 
        "Failed to update comment"
      );
    },
  });
};

export const useDeleteActivityLogComment = (modelType, modelId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => handleDeleteComment({ id }),
    onSuccess: (data) => {
      toast.success(data?.message || "Comment deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_LOG_QUERY_KEYS.list(modelType, modelId),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error?.message || 
        "Failed to delete comment"
      );
    },
  });
};
