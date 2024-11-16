import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '../types/order-status';

export class GetOrderListDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;

  @IsOptional()
  @IsString()
  orderNo?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
