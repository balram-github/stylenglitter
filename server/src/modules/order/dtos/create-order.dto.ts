import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TypeOfPayment } from '../types/payment-method';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  addressId: number;

  @IsEnum(TypeOfPayment)
  paymentMethod: TypeOfPayment;
}
