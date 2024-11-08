import { IsEnum, IsNotEmpty } from 'class-validator';
import { TypeOfPayment } from '../types/payment-method';
import { CreateShippingAddressDto } from './create-shipping-address.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  shippingAddress: CreateShippingAddressDto;

  @IsEnum(TypeOfPayment)
  paymentMethod: TypeOfPayment;
}
