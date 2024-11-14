import { IsEnum } from 'class-validator';
import { OrderStatus } from '../types/order-status';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
