import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenSignOptions } from './types/token.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';
import { addSeconds } from 'date-fns';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) {}

  async get(tokenId: string) {
    return this.tokenRepository.findOne({ where: { tokenId } });
  }

  async create(
    payload: object | Buffer,
    { persistInDB, ...options }: TokenSignOptions = {},
  ) {
    const jwtToken = await this.jwtService.signAsync(payload, options);

    if (persistInDB && options?.jwtid) {
      const expiresAt = options?.expiresIn
        ? addSeconds(new Date(), options.expiresIn)
        : null;
      const newToken = this.tokenRepository.create({
        tokenId: options.jwtid,
        expiresAt,
      });

      await this.tokenRepository.save(newToken);
    }

    return jwtToken;
  }

  async delete(tokenId: string) {
    const token = await this.tokenRepository.findOne({ where: { tokenId } });

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return this.tokenRepository.softDelete({ tokenId });
  }
}
