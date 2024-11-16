/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

export const internalRequest = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

request.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = "/authentication/logout";
    }

    return Promise.reject(error);
  }
);

export const isRequestError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};
