import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { TypeOfPayment } from '../types/payment-method';
import { CreateShippingAddressDto } from './create-shipping-address.dto';
import { Type } from 'class-transformer';

export class ProductsToPurchaseDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  shippingAddress: CreateShippingAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsToPurchaseDto)
  productsToPurchase: ProductsToPurchaseDto[];

  @IsEnum(TypeOfPayment)
  paymentMethod: TypeOfPayment;
}
