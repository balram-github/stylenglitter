import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ProductSortBy {
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  DATE_ADDED_DESC = 'date_added_desc',
  DATE_ADDED_ASC = 'date_added_asc',
}

export enum ProductAvailability {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  ALL = 'all',
}

export class GetCategoryProductsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy;

  @IsOptional()
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  maxPrice?: number;
}
