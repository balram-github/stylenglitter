import { GetOrdersResponse } from "@/services/order/order.types";

export interface OrderCardProps {
  data: GetOrdersResponse["data"]["orders"][number];
}
