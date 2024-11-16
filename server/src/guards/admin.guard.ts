import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard extends AuthGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First validate the token using parent AuthGuard
    const isValid = await super.canActivate(context);

    if (!isValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.auth;

    if (!user?.isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }

    return true;
  }
}
