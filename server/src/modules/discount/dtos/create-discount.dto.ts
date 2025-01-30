import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DiscountEntityType } from '../types/discount-entity-type';
import { DiscountType } from '../types/discount-type';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: DiscountType;

  @IsNotEmpty()
  @IsString()
  entityType: DiscountEntityType;

  @IsNotEmpty()
  @IsNumber()
  entityId: number;

  @IsNotEmpty()
  @IsNumber()
  minQty: number;

  @IsNotEmpty()
  @IsNumber()
  freeQty: number;

  @IsNotEmpty()
  @IsNumber()
  flatPrice: number;

  @IsNotEmpty()
  @IsNumber()
  percentage: number;
}
