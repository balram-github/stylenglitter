import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '../token/token.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async generateAuthTokenPair(userId: number) {
    // TODO: Generate auth tokens
    console.log({ userId });
    return {
      accessToken: '',
      refreshToken: '',
    };
  }

  async login(payload: LoginDto) {
    const user = await this.userService.getUser({
      where: { email: payload.email },
    });

    if (!user) {
      throw new NotFoundException('User or password not found');
    }

    if (!user.validatePassword(payload.password)) {
      throw new NotFoundException('User or password not found');
    }

    // TODO: Generate auth tokens and send

    return this.generateAuthTokenPair(user.id);
  }

  async register(payload: CreateUserDto) {
    const newUser = await this.userService.create(payload);

    // TODO: Generate auth tokens and send

    return this.generateAuthTokenPair(newUser.id);
  }
}
