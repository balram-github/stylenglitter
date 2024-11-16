import { request } from "@/lib/request";
import {
  GetOrderResponse,
  GetOrdersParams,
  GetOrdersResponse,
  OrderStatus,
} from "./order.types";

export const getOrders = async (params: GetOrdersParams) => {
  const {
    data: { data },
  } = await request.get<GetOrdersResponse>("/orders/list", {
    params,
  });
  return data;
};

export const getOrder = async (orderNo: string) => {
  const {
    data: { data },
  } = await request.get<GetOrderResponse>(`/orders/${orderNo}`);
  return data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
  trackingNumber?: string,
) => {
  await request.patch(`/orders/${orderId}/status`, { status, trackingNumber });
};
