import type { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { extractTokenFromHeader } from '@utils/utils';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const secret = this.configService.get('auth.refreshJwtTokenSecret');
      const payload = this.jwtService.verify(token, { secret });

      // Attach decoded token to be used later
      request['auth'] = payload;
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
