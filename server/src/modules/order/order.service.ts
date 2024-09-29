import { DataSource, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from '@modules/product/product.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: number) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const cart = await this.cartService.getCart(
        { where: { userId } },
        entityManager,
      );

      if (!cart) {
        throw new InternalServerErrorException('Cart not found');
      }

      const cartItems = await this.cartService.getLockedCartItems(
        cart.id,
        entityManager,
      );

      if (cartItems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const order = this.orderRepository.create({
        user: { id: userId },
      });

      const savedOrder = await entityManager.save(order);

      const promisesToRun = cartItems.map(async (cartItem) => {
        const orderItem = this.orderItemRepository.create({
          order: savedOrder,
          product: cartItem.product,
          productAmount: cartItem.product.amount,
          qty: cartItem.qty,
          totalPrice: cartItem.totalPrice,
        });

        await entityManager.save(orderItem);

        await this.productService.edit(
          cartItem.product.id,
          {
            qty: cartItem.product.qty - cartItem.qty,
          },
          entityManager,
        );
      });

      await Promise.all(promisesToRun);

      await this.cartService.removeCartItems(cart.id, [], entityManager);
    });
  }

  getOrder(orderId: number, userId: number) {
    return this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['orderItems'],
      withDeleted: true,
    });
  }

  getUserOrders(userId: number, page: number, limit: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit + 1,
      withDeleted: true,
    });
  }
}
