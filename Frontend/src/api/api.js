import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../auth/tokenManager";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let refreshPromise = null;
let unauthorizedHandler = null;

export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const requestNewAccessToken = async () => {
  const response = await api({
    method: "post",
    url: "/api/auth/refresh",
    skipAuthRefresh: true,
  });

  const newToken = response.data.token;
  setAccessToken(newToken);
  return newToken;
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const shouldSkip =
      originalRequest?.skipAuthRefresh ||
      originalRequest?.url?.includes("/api/auth/refresh");

    const shouldTryRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkip;

    if (!shouldTryRefresh) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = requestNewAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();

      if (unauthorizedHandler) {
        unauthorizedHandler();
      }

      throw refreshError;
    }
  }
);
