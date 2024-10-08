import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsPhoneNumber('IN')
  phoneNumber: string;
}
