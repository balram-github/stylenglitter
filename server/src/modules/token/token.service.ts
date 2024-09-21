import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { TokenSignOptions } from './types/token.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';

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

  async create(payload: object | Buffer, options?: TokenSignOptions) {
    const jwtid = uuidv4();
    const jwtToken = await this.jwtService.signAsync(payload, {
      ...options,
      jwtid,
    });

    if (options?.persistInDB) {
      const newToken = this.tokenRepository.create({
        tokenId: jwtid,
        expiresAt: options?.expiresIn,
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
