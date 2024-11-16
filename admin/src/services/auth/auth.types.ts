export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
  };
}

export interface UserStatusResponse {
  data: {
    id: string;
    name: string;
  };
}
