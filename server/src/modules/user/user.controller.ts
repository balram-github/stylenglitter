import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@/guards/auth-guard';
import { Auth } from '@decorators/auth';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMyDetails(@Auth() auth) {
    const user = await this.userService.getUser({ where: { id: auth.userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
