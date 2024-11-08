import { request } from "@/lib/request";
import { CreateOrderPayload, CreateOrderResponse } from "./order.types";

export const createOrder = async (payload: CreateOrderPayload) => {
  const {
    data: { data },
  } = await request.post<CreateOrderResponse>("/orders", payload);
  return data;
};
