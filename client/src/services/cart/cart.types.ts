import { Discount } from "../discount/discount.types";
import { TypeOfPayment } from "../order/order.types";
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

export interface GetCartPurchaseChargesResponse {
  success: boolean;
  data: {
    subTotal: number;
    deliveryCharge: number;
    payNow: number;
    payLater: number;
    appliedDiscounts: Discount[];
  };
}

export interface GetCartPurchaseChargesRequest {
  paymentMethod: TypeOfPayment;
  products: {
    productId: number;
    qty: number;
  }[];
}
