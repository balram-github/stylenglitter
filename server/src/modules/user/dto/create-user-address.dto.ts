import {
  IsNotEmpty,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserAddressDto {
  @IsPhoneNumber('IN')
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  addressLine: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  state: string;

  @IsNotEmpty()
  @IsPostalCode('IN')
  pinCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  country: string;
}
