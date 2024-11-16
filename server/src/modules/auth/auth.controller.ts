import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
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
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @UseGuards(RefreshGuard)
  @Get('refresh-token')
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

  @UseGuards(ThrottlerGuard)
  @Throttle({ medium: { limit: 5, ttl: 10000 } })
  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ long: { limit: 3, ttl: 60000 } })
  @Post('register')
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

  @UseGuards(ThrottlerGuard)
  @Throttle({ long: { limit: 5, ttl: 60 * 60 * 1000 } })
  @Post('password-resets')
  async resetPasswordRequest(@Body() payload: ResetPasswordRequestDto) {
    return this.authService.resetPasswordRequest(payload.email);
  }

  @Post('password-resets/reset')
  async resetPassword(
    @Query('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, payload.password);
  }

  @Post('admin/login')
  async adminLogin(@Body() payload: AdminLoginDto) {
    const adminEmail = this.configService.get<string>('auth.adminEmail');
    const adminPassword = this.configService.get<string>('auth.adminPassword');

    if (payload.email !== adminEmail || payload.password !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPayload = {
      userId: 'admin',
      isAdmin: true,
      cartId: null,
    };

    const accessToken =
      await this.authService.generateAccessToken(tokenPayload);

    return {
      accessToken,
    };
  }
}
