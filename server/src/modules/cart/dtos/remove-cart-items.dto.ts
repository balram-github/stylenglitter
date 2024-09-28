import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class RemoveCartItemsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  productIds: number[];
}
