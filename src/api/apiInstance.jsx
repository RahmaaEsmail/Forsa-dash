import axios from "axios";
import { config } from "./config";
import Cookies from "js-cookie";

export const apiInstance = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor ────────────────────────────────────────────────────
// Attach the latest access token from localStorage to every outgoing request.
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

// ─── Token refresh state ────────────────────────────────────────────────────
// isRefreshing prevents multiple simultaneous refresh calls when several
// requests fail with 401 at the same time (e.g. after the token expires).
// failedQueue holds the resolve/reject callbacks of those waiting requests so
// they are all retried (or all rejected) once the single refresh settles.
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

function forceLogout() {
  localStorage.removeItem(config.localStorageTokenName);
  localStorage.removeItem(config.localStorageUserData);
  Cookies.remove(config.localStorageRefreshTokenName);
  window.location.href = "/login";
}

// ─── Response interceptor ───────────────────────────────────────────────────
apiInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    const url = originalRequest?.url || "";

    // Never attempt a refresh for login or refresh endpoints themselves —
    // a 401 there means bad credentials / invalid refresh token → log out.
    const isAuthEndpoint =
      url.includes("auth/login") || url.includes("auth/refresh") || url.includes("auth/logout");

    if (status !== 401 || isAuthEndpoint || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request and wait.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark this request so we don't enter an infinite retry loop.
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = Cookies.get(config.localStorageRefreshTokenName);
    const accessToken = localStorage.getItem(config.localStorageTokenName);

    if (!refreshToken || !accessToken) {
      // No refresh token available — nothing we can do, log out immediately.
      isRefreshing = false;
      processQueue(error, null);
      forceLogout();
      return Promise.reject(error);
    }

    try {
      // Call the refresh endpoint directly (bypasses this interceptor because
      // the URL matches isAuthEndpoint above).
      const res = await apiInstance.post(
        "auth/refresh",
        { refresh_token: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const newTokens = res?.data?.meta;
      if (!newTokens?.access_token) throw new Error("No access token in refresh response");

      // Persist the new tokens.
      localStorage.setItem(config.localStorageTokenName, newTokens.access_token);
      apiInstance.defaults.headers.common.Authorization = `Bearer ${newTokens.access_token}`;
      if (newTokens.refresh_token) {
        Cookies.set(config.localStorageRefreshTokenName, newTokens.refresh_token);
      }

      // Let all queued requests through with the new token.
      processQueue(null, newTokens.access_token);

      // Retry the original failed request.
      originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
      return apiInstance(originalRequest);
    } catch (refreshError) {
      // Refresh itself failed (expired / revoked) → force logout.
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
