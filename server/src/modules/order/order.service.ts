import { DataSource, EntityManager, FindOneOptions, Repository } from 'typeorm';
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
import { PaymentService } from '../payment/payment.service';
import { TypeOfPayment } from './types/payment-method';
import {
  COD_ORDER_DELIVERY_CHARGE,
  PREPAID_ORDER_DELIVERY_CHARGE,
  PREPAID_ORDER_THRESHOLD_FOR_FREE_DELIVERY,
} from './constants';
import { LockedCartItem } from '../cart/types/locked-cart-item';

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
    private paymentService: PaymentService,
  ) {}

  getOne(findOptions: FindOneOptions<Order>, entityManager?: EntityManager) {
    if (entityManager) return entityManager.findOne(Order, findOptions);

    return this.orderRepository.findOne(findOptions);
  }

  async getOrderTotalValue(
    lockedCartItems: LockedCartItem[],
    paymentMethod: TypeOfPayment,
  ) {
    const totalValue = lockedCartItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );

    switch (paymentMethod) {
      case TypeOfPayment.PREPAID: {
        if (totalValue >= PREPAID_ORDER_THRESHOLD_FOR_FREE_DELIVERY) {
          return totalValue;
        }

        return totalValue + PREPAID_ORDER_DELIVERY_CHARGE;
      }
      case TypeOfPayment.COD:
        return COD_ORDER_DELIVERY_CHARGE;
    }
  }

  async createOrder(
    userId: number,
    addressId: number,
    paymentMethod: TypeOfPayment,
  ) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const cart = await this.cartService.getCart(
        { where: { userId } },
        entityManager,
      );

      if (!cart) {
        throw new InternalServerErrorException('Cart not found');
      }

      const lockedCartItems = await this.cartService.getLockedCartItems(
        cart.id,
        entityManager,
      );

      if (lockedCartItems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const order = this.orderRepository.create({
        user: { id: userId },
        shippingAddressId: addressId,
      });

      const savedOrder = await entityManager.save(order);

      const totalOrderValue = await this.getOrderTotalValue(
        lockedCartItems,
        paymentMethod,
      );

      const promisesToRun = lockedCartItems.map(async (cartItem) => {
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

      const { paymentGatewayResponse } =
        await this.paymentService.createPayment(
          savedOrder.id,
          {
            amount: totalOrderValue,
          },
          entityManager,
        );

      return { paymentGatewayResponse };
    });
  }

  getOrderByOrderId(orderId: number) {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
      withDeleted: true,
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
