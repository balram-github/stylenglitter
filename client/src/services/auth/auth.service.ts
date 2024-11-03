import { internalRequest, request } from "@/lib/request";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  UserStatusResponse,
} from "./auth.types";

export const verifyEmail = async (token: string) => {
  const response = await request.get<boolean>(
    `/auth/verify-email?token=${token}`
  );
  return response.data;
};

export const resendVerificationEmail = async () => {
  const response = await request.post<boolean>(`/auth/resend-verification`);
  return response.data;
};

export const login = async (data: LoginPayload) => {
  const response = await internalRequest.post<LoginResponse>(`/login`, data);
  return response.data;
};

export const register = async (data: RegisterPayload) => {
  const response = await request.post<LoginResponse>(`/auth/register`, data);
  return response.data;
};

export const getUserStatus = async () => {
  const response = await request.get<UserStatusResponse>(`/users/me`);
  return response.data;
};
