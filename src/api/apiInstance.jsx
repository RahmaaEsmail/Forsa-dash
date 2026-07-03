import axios from "axios";
import { config } from "./config";

export const apiInstance = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem(config.localStorageTokenName) || "";
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    } else {
      delete req.headers.Authorization;
    }
    return req;
  },
  (error) => Promise.reject(error),
);

apiInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthEndpoint =
      url.includes("auth/login") || url.includes("auth/refresh");
    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem(config.localStorageTokenName);
      localStorage.removeItem(config.localStorageUserData);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
