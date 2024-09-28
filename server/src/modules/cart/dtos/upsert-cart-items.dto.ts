import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpsertCartItemsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  productId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  qty: number;
}
