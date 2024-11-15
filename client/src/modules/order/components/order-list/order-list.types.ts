import { GetOrdersResponse } from "@/services/order/order.types";

export interface OrderListProps {
  data: GetOrdersResponse["data"]["orders"];
  hasNext: boolean;
  loading: boolean;
  loadData: () => void;
}
