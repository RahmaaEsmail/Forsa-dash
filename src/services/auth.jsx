import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"

export const handleLogin = async ({ body }) => {
  const response = await apiInstance.post(userEndpoints.login, body);
  return response?.data;
};

export const handleLogout = async () => {
  const response = await apiInstance.post(userEndpoints.logout, body);
  return response?.data;
};

export const handleGetCurrentUser = async() => {
  const response = await apiInstance.get(userEndpoints.get_current_user);
  return response?.data;
}