import { Payment } from "../payment/payment.types";
import { Product } from "../products/products.types";

export enum TypeOfPayment {
  PREPAID = "prepaid",
  COD = "cod",
}

export enum OrderStatus {
  PAYMENT_PENDING = "payment_pending",
  PAYMENT_FAILED = "payment_failed",
  PLACED = "placed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface OrderItem {
  id: number;
  product: Product;
  qty: number;
  totalPrice: number;
}

export interface ShippingAddress {
  id: number;
  phoneNumber: string;
  name: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface Order {
  id: number;
  orderNo: string;
  status: OrderStatus;
  trackingNo: string | null;
  payment: Payment;
  paymentMethod: TypeOfPayment;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface GetOrdersFilterParams {
  orderNo?: string;
  status?: OrderStatus;
}

export interface GetOrdersParams extends GetOrdersFilterParams {
  page: number;
  limit: number;
}

export interface GetOrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    count: number;
  };
}

export interface GetOrderResponse {
  success: boolean;
  data: Order;
}
