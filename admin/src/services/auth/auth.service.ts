import { internalRequest, request } from "@/lib/request";
import {
  LoginPayload,
  LoginResponse,
  UserStatusResponse,
} from "./auth.types";

export const login = async (data: LoginPayload) => {
  const response = await internalRequest.post<LoginResponse>(`/login`, data);
  return response.data;
};

export const getUserStatus = async () => {
  const response = await request.get<UserStatusResponse>(`/users/admin/me`);
  return response.data;
};
