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
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // First try to get token from cookie
    let token = request.cookies?.accessToken;

    // If not in cookie, try to get from header
    if (!token) {
      token = extractTokenFromHeader(request);
    }

    if (!token) {
      return true;
    }

    try {
      const secret = this.configService.get('auth.accessJwtTokenSecret');
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
