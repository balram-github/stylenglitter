import { request } from "@/lib/request";
import {
  GetOrderResponse,
  GetOrdersParams,
  GetOrdersResponse,
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
