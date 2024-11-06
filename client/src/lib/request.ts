/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

const refreshTokens = async () => {
  const { data } = await axios.post("/api/refresh-token", {
    withCredentials: true,
  });

  return data;
};

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const internalRequest = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Store pending requests
let failedQueue: any[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token refresh
request.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If refreshing is in progress, queue the request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => request(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { success } = await refreshTokens();

      if (!success) {
        // If refresh failed, reject all queued requests
        processQueue(error);
        // Redirect to login or dispatch logout action
        window.location.href = "/authentication/logout";
        return Promise.reject(error);
      }

      // Process queued requests
      processQueue();

      // Retry the original request
      return request(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const isRequestError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};
