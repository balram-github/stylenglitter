import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('/register')
  register(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }
}
