import { apiInstance } from "../api/apiInstance";
import { userEndpoints } from "../api/userEndpoints";

export const handleGetAllRoles = async ({ signal, params }) => {
  const response = await apiInstance.get(userEndpoints.roles, {
    signal,
    params,
  });
  return response.data;
};

export const handleCreateRole = async ({ body, signal }) => {
  const response = await apiInstance.post(userEndpoints.roles, body, {
    signal,
  });
  return response.data;
};

export const handleUpdateRole = async ({ id, body, signal }) => {
  const response = await apiInstance.post(`${userEndpoints.roles}/${id}`, body, {
    signal,
  });
  return response.data;
};

export const handleDeleteRole = async ({ id, signal }) => {
  const response = await apiInstance.delete(`${userEndpoints.roles}/${id}`, {
    signal,
  });
  return response.data;
};

export const handleGetAllPermissions = async ({ signal }) => {
  const response = await apiInstance.get(userEndpoints.permissions, {
    signal,
  });
  return response.data;
};
