import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '../token/token.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthTokenPayload } from './types/auth.types';
import { NotificationService } from '@modules/notification/notification.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private notificationService: NotificationService,
  ) {}

  async generateAccessToken(payload: AuthTokenPayload) {
    return this.tokenService.create(
      {
        ...payload,
        purpose: 'access',
      },
      {
        secret: this.configService.get('auth.accessJwtTokenSecret'),
        expiresIn: this.configService.get<number>('auth.accessJwtTokenExpiry')!,
      },
    );
  }

  async generateRefreshToken(payload: AuthTokenPayload) {
    const jwtid = uuidv4();

    return this.tokenService.create(
      {
        ...payload,
        purpose: 'refresh',
      },
      {
        jwtid,
        secret: this.configService.get('auth.refreshJwtTokenSecret'),
        expiresIn: this.configService.get<number>(
          'auth.refreshJwtTokenExpiry',
        )!,
        persistInDB: true,
      },
    );
  }

  async rotateRefreshToken(payload: AuthTokenPayload, existingTokenId: string) {
    const existingToken = await this.tokenService.get(existingTokenId);

    if (!existingToken) {
      throw new NotFoundException('Token not found');
    }

    await this.tokenService.delete(existingTokenId);

    const newToken = await this.generateRefreshToken(payload);

    return newToken;
  }

  async generateAuthTokenPair(payload: AuthTokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(payload: LoginDto) {
    const user = await this.userService.getOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new NotFoundException('User or password not found');
    }

    if (!user.validatePassword(payload.password)) {
      throw new NotFoundException('User or password not found');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    return this.generateAuthTokenPair({ userId: user.id, cartId: user.cartId });
  }

  async register(payload: CreateUserDto) {
    const existingEmail = await this.userService.getOne({
      where: { email: payload.email },
    });

    if (existingEmail) {
      throw new BadRequestException('A user with this email already exists');
    }

    const newUser = await this.userService.create(payload);
    await this.sendVerificationEmail(newUser);

    return true;
  }

  async generateEmailVerificationToken(userId: number) {
    return this.tokenService.create(
      {
        userId,
        purpose: 'email-verification',
      },
      {
        secret: this.configService.get('auth.emailVerificationSecret'),
        expiresIn: this.configService.get<number>(
          'auth.emailVerificationExpiry',
        )!,
      },
    );
  }

  async sendVerificationEmail(user: User) {
    const token = await this.generateEmailVerificationToken(user.id);
    const verificationUrl = `${this.configService.get('app.frontendUrl')}/verify-email?token=${token}`;

    await this.notificationService.sendEmailTemplate(
      user.email,
      'Verify Your Email',
      'email-verification.html',
      {
        name: user.name,
        verificationUrl,
      },
    );
  }

  async verifyEmail(token: string) {
    const payload = await this.tokenService.verify(token, {
      secret: this.configService.get('auth.emailVerificationSecret'),
    });

    const user = await this.userService.getOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.update(
      { where: { id: user.id } },
      { isEmailVerified: true },
    );

    return true;
  }
}
