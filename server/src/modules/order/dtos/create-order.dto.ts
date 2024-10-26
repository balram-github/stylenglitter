import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  addressId: number;
}
