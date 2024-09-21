import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { Auth } from '@decorators/auth';
import { RefreshGuard } from '@guards/refresh-guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(RefreshGuard)
  @Get('/refresh-token')
  async refreshToken(@Auth() auth) {
    const tokenPayload = { userId: auth.userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(tokenPayload),
      this.authService.rotateRefreshToken(tokenPayload, auth.jti),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('/login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('/register')
  register(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }
}
