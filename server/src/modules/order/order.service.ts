import {
  DataSource,
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from '@modules/product/product.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { TypeOfPayment } from './types/payment-method';
import { CreateShippingAddressDto } from './dtos/create-shipping-address.dto';
import { ShippingAddress } from './entities/shipping-address.entity';
import { UserService } from '../user/user.service';
import { OrderStatus } from './types/order-status';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NotificationTopic } from '../notification/types/notification-topics';
import { PaymentPaidNotificationPayload } from '../notification/types/payment-paid-notification-payload';
import { PaymentFailedNotificationPayload } from '../notification/types/payment-failed-notification-payload';
import { PaymentRefundInitiatedNotificationPayload } from '../notification/types/payment-refund-initiated-payload';
import { PaymentRefundFailedNotificationPayload } from '../notification/types/payment-refund-failed-payload';
import { PaymentRefundCompletedNotificationPayload } from '../notification/types/payment-refund-complete-payload';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ShippingAddress)
    private shippingAddressRepository: Repository<ShippingAddress>,
    private productService: ProductService,
    private cartService: CartService,
    private paymentService: PaymentService,
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  getOne(findOptions: FindOneOptions<Order>, entityManager?: EntityManager) {
    if (entityManager) return entityManager.findOne(Order, findOptions);

    return this.orderRepository.findOne(findOptions);
  }

  async createOrder(
    userId: number,
    shippingAddress: CreateShippingAddressDto,
    paymentMethod: TypeOfPayment,
  ) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const user = await this.userService.getOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

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

      const address = this.shippingAddressRepository.create({
        ...shippingAddress,
        name: user.name,
        email: user.email,
      });

      const savedShippingAddress = await entityManager.save(address);

      const order = this.orderRepository.create({
        user: { id: userId },
        shippingAddress: savedShippingAddress,
      });

      const savedOrder = await entityManager.save(order);

      const { payNow: totalOrderValue } =
        await this.cartService.getCartPurchaseCharges(
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

      const { paymentGatewayResponse, payment } =
        await this.paymentService.createPayment(
          savedOrder.id,
          {
            amount: totalOrderValue,
          },
          entityManager,
        );

      Object.assign(savedOrder, { paymentId: payment.id });

      await entityManager.save(savedOrder);

      return { paymentGatewayResponse, orderNo: savedOrder.orderNo };
    });
  }

  updateOrderStatus(
    filterExpression: FindOptionsWhere<Order>,
    status: OrderStatus,
  ) {
    return this.orderRepository.update(filterExpression, { status });
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

  @OnEvent(NotificationTopic.PAYMENT_PAID)
  private async handlePaymentPaidEvent(
    payload: PaymentPaidNotificationPayload,
  ) {
    const { paymentId } = payload;

    await this.updateOrderStatus({ paymentId }, OrderStatus.PLACED);
  }

  @OnEvent(NotificationTopic.PAYMENT_FAILED)
  private async handlePaymentFailedEvent(
    payload: PaymentFailedNotificationPayload,
  ) {
    const { paymentId } = payload;

    await this.updateOrderStatus({ paymentId }, OrderStatus.PAYMENT_FAILED);
  }

  @OnEvent(NotificationTopic.REFUND_INITIATED)
  private async handleRefundInitiatedEvent(
    payload: PaymentRefundInitiatedNotificationPayload,
  ) {
    const { paymentId } = payload;

    await this.updateOrderStatus({ paymentId }, OrderStatus.CANCELLED);
  }

  @OnEvent(NotificationTopic.REFUND_COMPLETED)
  private async handleRefundCompletedEvent(
    payload: PaymentRefundCompletedNotificationPayload,
  ) {
    const { paymentId } = payload;

    await this.updateOrderStatus({ paymentId }, OrderStatus.CANCELLED);
  }

  @OnEvent(NotificationTopic.REFUND_FAILED)
  private async handleRefundFailedEvent(
    payload: PaymentRefundFailedNotificationPayload,
  ) {
    const { paymentId } = payload;

    await this.updateOrderStatus({ paymentId }, OrderStatus.CANCELLED);
  }
}
