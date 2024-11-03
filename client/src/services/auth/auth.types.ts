export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface UserStatusResponse {
  data: {
    id: number;
    email: string;
    name: string;
  };
}
