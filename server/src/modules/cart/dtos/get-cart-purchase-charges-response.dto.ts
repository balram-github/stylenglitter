import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Discount } from '@/modules/discount/entities/discount.entity';

export class GetCartPurchaseChargesResponseDto {
  @IsNumber()
  subTotal: number;

  @IsNumber()
  deliveryCharge: number;

  @IsNumber()
  payNow: number;

  @IsNumber()
  payLater: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Discount)
  appliedDiscounts: Discount[];
}
