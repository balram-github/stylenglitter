import { Product } from "../products/products.types";

export interface Cart {
  id: number;
  userId: number;
  cartItems: CartItem[];
  isGuestCart?: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  product?: Product;
  qty: number;
}

export interface GetCartResponse {
  success: boolean;
  data: Cart;
}
