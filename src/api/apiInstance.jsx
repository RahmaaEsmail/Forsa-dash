import axios from "axios";
import { config } from "./config";

const controller = new AbortController();


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
  if(error?.response?.status == 401) {
    localStorage.removeItem(config.localStorageTokenName)
    localStorage.removeItem(config.localStorageUserData)
  }
  return Promise.reject(error);
})