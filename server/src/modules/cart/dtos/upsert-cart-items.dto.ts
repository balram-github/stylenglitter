import { IsNotEmpty, IsNumber, Max } from 'class-validator';

export class UpsertCartItemsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  productId: number;

  @IsNumber()
  @Max(2, { message: 'You cannot add more than 2 items of the same product.' })
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  qty: number;
}
