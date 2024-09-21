import { JwtSignOptions } from '@nestjs/jwt';

export interface TokenSignOptions extends JwtSignOptions {
  expiresIn?: number;
  persistInDB?: boolean;
}
