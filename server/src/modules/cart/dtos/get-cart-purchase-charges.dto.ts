import { TypeOfPayment } from '@/modules/order/types/payment-method';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, ValidateNested } from 'class-validator';

export class GetCartPurchaseProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;
}

export class GetCartPurchaseChargesDto {
  @IsEnum(TypeOfPayment)
  paymentMethod: TypeOfPayment;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetCartPurchaseProductDto)
  products: GetCartPurchaseProductDto[];
}
