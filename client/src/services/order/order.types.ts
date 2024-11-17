import { Payment } from "../payment/payment.types";
import { Product } from "../products/products.types";

export enum TypeOfPayment {
  PREPAID = "prepaid",
  COD = "cod",
}

export interface ShippingAddressPayload {
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  phoneNumber: string;
}

export interface CreateOrderPayload {
  paymentMethod: TypeOfPayment;
  shippingAddress: ShippingAddressPayload;
}

export interface PaymentGatewayResponse {
  amount: number;
  currency: string;
  id: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    paymentGatewayResponse: PaymentGatewayResponse;
    orderNo: string;
  };
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
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  paymentMethod: TypeOfPayment;
}

export interface GetOrdersParams {
  page: number;
  limit: number;
}

export interface GetOrdersResponse {
  success: boolean;
  data: {
    hasNext: boolean;
    orders: Omit<Order, "shippingAddress" | "orderItems">[];
  };
}

export interface GetOrderResponse {
  success: boolean;
  data: Order;
}
