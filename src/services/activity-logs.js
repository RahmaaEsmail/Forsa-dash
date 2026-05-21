import { apiInstance } from "../api/apiInstance";
import { userEndpoints } from "../api/userEndpoints";

export const handleGetActivityLogs = async ({ params, signal }) => {
  const response = await apiInstance.get(userEndpoints.get_activity, {
    params,
    signal,
  });
  return response.data;
};

export const handleGetActivityMentions = async ({ signal }) => {
  const response = await apiInstance.get(userEndpoints.get_activity_mentions, {
    signal,
  });
  return response.data;
};

export const handleAddComment = async ({ body, signal }) => {
  const response = await apiInstance.post(userEndpoints.add_comment, body, {
    signal,
  });
  return response.data;
};

export const handleUpdateComment = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.add_comment}/${id}`, body, {
    signal,
  });
  return response.data;
};

export const handleDeleteComment = async ({ id, signal }) => {
  const response = await apiInstance.delete(`${userEndpoints.add_comment}/${id}`, {
    signal,
  });
  return response.data;
};
