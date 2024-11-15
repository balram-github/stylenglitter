import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
