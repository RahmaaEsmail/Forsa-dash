import Cookies from "js-cookie";
import { apiInstance } from "../api/apiInstance"
import { userEndpoints } from "../api/userEndpoints"
import { config } from "../api/config";

export const handleLogin = async ({ body }) => {
  const response = await apiInstance.post(userEndpoints.login, body);
  return response?.data;
};



export const handleRefreshToekn = async () => {
  const accessToken = localStorage.getItem(config.localStorageTokenName);
  const refresh_token = Cookies.get(config.localStorageRefreshTokenName);

  if (!refresh_token || !accessToken) {
    throw new Error("Tokens are missing");
  }

  const response = await apiInstance.post(userEndpoints.refresh_token, {
    refresh_token,
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const newAccessToken = response?.data?.meta;

  // Store the new token in localStorage and Cookies
  if (newAccessToken) {
    localStorage.setItem(config.localStorageTokenName, newAccessToken?.access_token);
    Cookies.set(config.localStorageRefreshTokenName , newAccessToken?.refresh_token);
    return newAccessToken;
  }

  throw new Error("Failed to refresh token");
};


export const handleLogout = async () => {
  const response = await apiInstance.post(userEndpoints.logout, body);
  return response?.data;
};

export const handleGetCurrentUser = async({signal}) => {
  const response = await apiInstance.get(userEndpoints.get_current_user, {
    signal
  });
  return response?.data;
}