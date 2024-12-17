import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateShippingAddressDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

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
}
