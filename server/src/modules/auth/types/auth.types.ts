export interface AuthTokenPayload {
  userId: number | string;
  cartId: number | null;
  isAdmin?: boolean;
}
