import type { Request } from 'express';

export function extractTokenFromHeader(request: Request): string | null {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' && token ? token : null;
}
