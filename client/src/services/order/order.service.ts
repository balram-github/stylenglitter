import { request } from "@/lib/request";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrdersParams,
  GetOrdersResponse,
} from "./order.types";

export const createOrder = async (payload: CreateOrderPayload) => {
  const {
    data: { data },
  } = await request.post<CreateOrderResponse>("/orders", payload);
  return data;
};

export const getOrders = async (params: GetOrdersParams) => {
  const {
    data: { data },
  } = await request.get<GetOrdersResponse>("/orders", {
    params,
  });
  return data;
};

export const getOrder = async (
  orderNo: string,
  params?: { email?: string; phoneNumber?: string }
) => {
  const {
    data: { data },
  } = await request.get<GetOrderResponse>(`/orders/${orderNo}`, {
    params,
  });
  return data;
};
