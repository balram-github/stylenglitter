import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOneOptions, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cart } from '../cart/entities/cart.entity';
import { UserAddress } from './entities/user-address.entity';
import { CreateUserAddressDto } from './dto/create-user-address.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectDataSource() private readonly dataSource: DataSource,
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
    return this.dataSource.manager.transaction(async (entityManager) => {
      const newCart = this.cartRepository.create();

      const savedCart = await entityManager.save(newCart);

      const newUser = this.userRepository.create({
        ...payload,
        cartId: savedCart.id,
      });

      const savedUser = await entityManager.save(newUser);

      savedCart.userId = savedUser.id;

      await entityManager.save(savedCart);

      return savedUser;
    });
  }

  createAddress(userId: number, payload: CreateUserAddressDto) {
    const address = this.userAddressRepository.create({
      ...payload,
      userId,
    });

    return this.userAddressRepository.save(address);
  }
}
