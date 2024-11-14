import { OrderStatus } from '@/modules/order/types/order-status';

export interface OrderStatusChangedNotificationPayload {
  orderId: number;
  status: OrderStatus;
}
