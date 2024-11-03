import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@guards/auth.guard';
import { Auth } from '@decorators/auth';
import { ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Add a user address
   */
  @UseGuards(AuthGuard)
  @Post('/me/address')
  async addAddress(@Body() body: CreateUserAddressDto, @Auth() auth) {
    const user = await this.userService.getUser({ where: { id: auth.userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userService.createAddress(user.id, body);
  }

  /**
   * Get logged in user's details
   */
  @UseGuards(AuthGuard)
  @Get('/me')
  async getMyDetails(@Auth() auth) {
    const user = await this.userService.getUser({ where: { id: auth.userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new GetUserDto(user);
  }
}
