import { apiInstance } from "../api/apiInstance";
import { userEndpoints } from "../api/userEndpoints";

export const handleListUsers = async ({ params, signal }) => {
  const response = await apiInstance.get(userEndpoints.users, {
    params,
    signal,
  });
  return response.data;
};

export const handleCreateUser = async ({ body, signal }) => {
  const response = await apiInstance.post(userEndpoints.users, body, {
    signal,
  });
  return response.data;
};

export const handleUpdateUser = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.users}/${id}`, body, {
    signal,
  });
  return response.data;
};

export const handleDeleteUser = async ({ id, signal }) => {
  const response = await apiInstance.delete(`${userEndpoints.users}/${id}`, {
    signal,
  });
  return response.data;
};

export const handleGetUserDetails = async ({ id, signal }) => {
  const response = await apiInstance.get(`${userEndpoints.users}/${id}`, {
    signal,
  });
  return response.data;
};
