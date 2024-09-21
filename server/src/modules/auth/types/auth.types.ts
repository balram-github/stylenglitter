export interface AuthTokenPayload {
  userId: number;
}

export interface AccessTokenPayload extends AuthTokenPayload {
  purpose: 'access';
}

export interface RefreshTokenPayload extends AuthTokenPayload {
  purpose: 'refresh';
}
