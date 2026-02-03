import axios from "axios";
import { config } from "./config";
export const apiInstance = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

})

apiInstance.interceptors.request.use((req) => {
  const token = localStorage.getItem(config.localStorageTokenName) ? localStorage?.getItem(config.localStorageTokenName) : "";
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    delete req.headers.Authorization;
  }
  return req;

}, (error) => Promise.reject(error))



apiInstance.interceptors.response.use((res) => res , (error) => {
  console.log("interceptor", error);
  if(error?.status == 401) {
    localStorage.removeItem(config.localStorageTokenName)
    localStorage.removeItem(config.localStorageUserData)
    window.location.href = "/login";
    window.location.reload();
  }
  return Promise.reject(error);
})