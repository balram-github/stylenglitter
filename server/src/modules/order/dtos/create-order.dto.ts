import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  @MaxLength(255, {
    message: 'Field "$property" maximum length is $constraint1',
  })
  name: string;

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
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  categoryId: number;
}
