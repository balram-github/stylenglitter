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

export interface Discount {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: DiscountType;
  entityType: DiscountEntityType;
  entitySlug: string;
  minQty: number;
  flatPrice: number;
  percentage: number;
}

export enum DiscountEntityType {
  CATEGORY = "category",
  PRODUCT_THEME = "product_theme",
}

export enum DiscountType {
  FLAT_PRICE = "flat_price",
  PERCENTAGE = "percentage",
}

export interface GetCartPurchaseChargesRequest {
  paymentMethod: TypeOfPayment;
  products: {
    productId: number;
    qty: number;
  }[];
}
