import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '@modules/token/token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.query.token;

    if (!token) {
      throw new UnauthorizedException('Verification token is required');
    }

    try {
      const payload = await this.tokenService.verify(token, {
        secret: this.configService.get('auth.emailVerificationSecret'),
      });

      if (payload.purpose !== 'email-verification') {
        throw new UnauthorizedException('Invalid token purpose');
      }

      request.verificationPayload = payload;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired verification token');
    }
  }
}
