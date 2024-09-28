import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class EditProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Field "$property" maximum length is $constraint1',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  @MaxLength(1024, {
    message: 'Field "$property" maximum length is $constraint1',
  })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Field "$property" must be an integer.' })
  @Min(0, { message: 'Field "$property" must be greater than $constraint1' })
  qty?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Field "$property" must be a number.' })
  @Min(0, { message: 'Field "$property" must be greater than $constraint1' })
  amount?: number;
}
