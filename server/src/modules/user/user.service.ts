import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getUser(findOptions: FindOneOptions<User>) {
    return this.userRepository.findOne(findOptions);
  }

  async update(
    findOptions: FindOneOptions<User>,
    updatePayload: UpdateUserDto,
  ) {
    const user = await this.getUser(findOptions);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updatePayload);

    return this.userRepository.save(user);
  }

  create(payload: CreateUserDto) {
    const newUser = this.userRepository.create(payload);

    return this.userRepository.save(newUser);
  }
}
