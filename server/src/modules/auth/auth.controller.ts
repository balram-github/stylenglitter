import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { Auth } from '@decorators/auth';
import { RefreshGuard } from '@guards/refresh.guard';
import { EmailVerificationGuard } from '@guards/email-verification.guard';
import { AuthGuard } from '@guards/auth.guard';
import { UserService } from '@modules/user/user.service';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(RefreshGuard)
  @Get('/refresh-token')
  async refreshToken(@Auth() auth) {
    const tokenPayload = { userId: auth.userId, cartId: auth.cartId };

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(tokenPayload),
      this.authService.rotateRefreshToken(tokenPayload, auth.jti),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Throttle({ medium: { limit: 5, ttl: 10000 } })
  @Post('/login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Throttle({ long: { limit: 3, ttl: 60000 } })
  @Post('/register')
  register(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }

  @Get('verify-email')
  @UseGuards(EmailVerificationGuard)
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @UseGuards(AuthGuard)
  async resendVerification(@Auth() auth) {
    const user = await this.userService.getOne({
      where: { id: auth.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    await this.authService.sendVerificationEmail(user);
    return true;
  }
}
