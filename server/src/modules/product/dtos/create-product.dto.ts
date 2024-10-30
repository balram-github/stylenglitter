import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  @MaxLength(255, {
    message: 'Field "$property" maximum length is $constraint1',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  @MaxLength(255, {
    message: 'Field "$property" maximum length is $constraint1',
  })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  @MaxLength(1024, {
    message: 'Field "$property" maximum length is $constraint1',
  })
  description: string;

  @IsInt({ message: 'Field "$property" must be an integer.' })
  @Min(0, { message: 'Field "$property" must be greater than $constraint1' })
  qty: number;

  @IsNumber({}, { message: 'Field "$property" must be a number.' })
  @Min(0, { message: 'Field "$property" must be greater than $constraint1' })
  amount: number;

  @IsNumber({}, { message: 'Field "$property" must be a number.' })
  @Min(0, { message: 'Field "$property" must be greater than $constraint1' })
  baseAmount: number;

  @IsNumber({}, { message: 'Field "$property" must be a number.' })
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  categoryId: number;

  @IsNumber({}, { message: 'Field "$property" must be a number.' })
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  productThemeId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true }) // Validate each item in the array as a URL
  productImages: string[];
}
