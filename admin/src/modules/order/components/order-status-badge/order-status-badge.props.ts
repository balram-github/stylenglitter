import { OrderStatus } from "@/services/order/order.types";

export interface OrderStatusBadgeProps {
  onClick: () => void;
  status: OrderStatus;
}
