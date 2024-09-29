import { IsArray, IsNumber } from 'class-validator';

export class RemoveCartItemsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[];
}
