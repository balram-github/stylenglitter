import {
  DataSource,
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  Repository,
} from 'typeorm';
import {
  BadRequestException,
  Injectable,
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
import { Jobs } from '@/jobs/jobs';
import { Cron } from '@nestjs/schedule';
import { GetOrderListDto } from './dtos/get-order-list.dto';
import { ProductsToPurchaseDto } from './dtos/create-order.dto';
import { Product } from '../product/entities/product.entity';

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

  private async validateProductsToPurchase(
    productsToPurchase: { product: Product; qty: number }[],
  ) {
    for (const { product, qty: qtyToPurchase } of productsToPurchase) {
      if (!product) {
        throw new BadRequestException(
          'One of the products in your cart do not exist',
        );
      }

      if (qtyToPurchase > product.qty) {
        throw new BadRequestException(
          `Product "${product.name}" does not have the requested quantity available. Please reduce the quantity or remove the product from your cart.`,
        );
      }
    }

    return true;
  }

  async createOrder(
    shippingAddress: CreateShippingAddressDto,
    paymentMethod: TypeOfPayment,
    productsToPurchase: ProductsToPurchaseDto[],
    userId: number | null,
  ) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const productsWithDetails = await this.productService.get(
        {
          where: {
            id: In(productsToPurchase.map((product) => product.productId)),
          },
          lock: { mode: 'pessimistic_write' },
        },
        entityManager,
      );

      const productsToPurchaseWithDetails = productsToPurchase.map(
        (product) => ({
          product: productsWithDetails.find((p) => p.id === product.productId)!,
          qty: product.qty,
        }),
      );

      await this.validateProductsToPurchase(productsToPurchaseWithDetails);

      const address = this.shippingAddressRepository.create(shippingAddress);

      const savedShippingAddress = await entityManager.save(address);

      const order = this.orderRepository.create({
        user: userId ? { id: userId } : null,
        shippingAddress: savedShippingAddress,
        paymentMethod,
      });

      const savedOrder = await entityManager.save(order);

      const { payNow: totalOrderValue, payLater: pendingAmount } =
        await this.cartService.getCartPurchaseCharges({
          products: productsToPurchaseWithDetails,
          paymentMethod,
        });

      const promisesToRun = productsToPurchaseWithDetails.map(
        async (productToPurchase) => {
          const orderItem = this.orderItemRepository.create({
            order: savedOrder,
            product: productToPurchase.product,
            productAmount: productToPurchase.product.amount,
            qty: productToPurchase.qty,
            totalPrice:
              productToPurchase.product.amount.price * productToPurchase.qty,
          });

          await entityManager.save(orderItem);
        },
      );

      await Promise.all(promisesToRun);

      const { paymentGatewayResponse, payment } =
        await this.paymentService.createPayment(
          savedOrder.id,
          {
            amount: totalOrderValue,
            pendingAmount,
          },
          entityManager,
        );

      Object.assign(savedOrder, { paymentId: payment.id });

      await entityManager.save(savedOrder);

      return { paymentGatewayResponse, orderNo: savedOrder.orderNo };
    });
  }

  async updateOrderStatus(
    filterExpression: FindOptionsWhere<Order>,
    status: OrderStatus,
    trackingNumber?: string,
  ) {
    const order = await this.getOne({ where: filterExpression });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;

    order.trackingNo = trackingNumber || null;

    await this.orderRepository.save(order);

    this.eventEmitter.emitAsync(NotificationTopic.ORDER_STATUS_UPDATED, {
      orderId: order.id,
      status,
    });

    return order;
  }

  getOrderByOrderId(orderId: number) {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'orderItems',
        'orderItems.product',
        'orderItems.product.images',
        'orderItems.product.amount',
        'orderItems.product.category',
      ],
      withDeleted: true,
    });
  }

  getOrder(filterExpression: FindOptionsWhere<Order>) {
    return this.orderRepository.findOne({
      where: filterExpression,
      relations: [
        'orderItems',
        'orderItems.product',
        'orderItems.product.images',
      ],
      withDeleted: true,
    });
  }

  async getOrderList({ orderNo, status, page, limit }: GetOrderListDto) {
    const where: FindOptionsWhere<Order> = {};

    if (orderNo) {
      where.orderNo = orderNo;
    }

    if (status) {
      where.status = status;
    }

    const [orders, count] = await Promise.all([
      this.orderRepository.find({
        where,
        relations: [
          'shippingAddress',
          'payment',
          'orderItems',
          'orderItems.product',
          'orderItems.product.images',
        ],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        withDeleted: true,
      }),
      this.orderRepository.count({ where }),
    ]);

    return {
      orders,
      count,
    };
  }

  async getUserOrders(userId: number, page: number, limit: number) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit + 1,
      withDeleted: true,
    });

    const hasNext = orders.length > limit;

    return { orders: orders.slice(0, limit), hasNext };
  }

  private async consumeProductInventory(order: Order) {
    const promisesToRun = order.orderItems.map(async (orderItem) => {
      return this.dataSource.manager.transaction(async (entityManager) => {
        if (!orderItem.product) {
          console.warn(
            'Order item product not found while consuming product qty',
          );
          return;
        }

        const product = await this.productService.getOne(
          {
            where: { id: orderItem.product.id },
            lock: { mode: 'pessimistic_write' },
          },
          entityManager,
        );

        if (product) {
          await this.productService.edit(
            product.id,
            {
              qty: Math.max(product.qty - orderItem.qty, 0),
            },
            entityManager,
          );
        }
      });
    });

    await Promise.all(promisesToRun);
  }

  @OnEvent(NotificationTopic.PAYMENT_PAID)
  private async handlePaymentPaidEvent(
    payload: PaymentPaidNotificationPayload,
  ) {
    try {
      const { paymentId } = payload;

      const order = await this.getOne({
        where: { paymentId },
        relations: ['orderItems'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      await this.updateOrderStatus({ id: order.id }, OrderStatus.PLACED);

      await this.consumeProductInventory(order);
    } catch (error) {
      console.error(error);
    }
  }

  @OnEvent(NotificationTopic.PAYMENT_FAILED)
  private async handlePaymentFailedEvent(
    payload: PaymentFailedNotificationPayload,
  ) {
    try {
      const { paymentId } = payload;

      await this.updateOrderStatus({ paymentId }, OrderStatus.PAYMENT_FAILED);
    } catch (error) {
      console.error(error);
    }
  }

  @OnEvent(NotificationTopic.REFUND_INITIATED)
  private async handleRefundInitiatedEvent(
    payload: PaymentRefundInitiatedNotificationPayload,
  ) {
    try {
      const { paymentId } = payload;

      await this.updateOrderStatus({ paymentId }, OrderStatus.CANCELLED);
    } catch (error) {
      console.error(error);
    }
  }

  @OnEvent(NotificationTopic.REFUND_COMPLETED)
  private async handleRefundCompletedEvent(
    payload: PaymentRefundCompletedNotificationPayload,
  ) {
    try {
      const { paymentId } = payload;

      await this.updateOrderStatus({ paymentId }, OrderStatus.CANCELLED);
    } catch (error) {
      console.error(error);
    }
  }

  @OnEvent(NotificationTopic.REFUND_FAILED)
  private async handleRefundFailedEvent(
    payload: PaymentRefundFailedNotificationPayload,
  ) {
    try {
      const { paymentId } = payload;

      await this.updateOrderStatus({ paymentId }, OrderStatus.CANCELLED);
    } catch (error) {
      console.error(error);
    }
  }

  // Scheduled jobs
  @Cron(Jobs.SET_PAYMENT_PENDING_ORDERS_TO_PAYMENT_FAILED.cronTime, {
    name: Jobs.SET_PAYMENT_PENDING_ORDERS_TO_PAYMENT_FAILED.name,
  })
  async setPaymentPendingOrdersToPaymentFailed() {
    console.log(
      'Running set payment pending orders to payment failed scheduled job',
    );
    const last12Hours = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const pendingOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.PAYMENT_PENDING,
        createdAt: LessThanOrEqual(last12Hours),
      },
      relations: ['orderItems'],
    });

    const promisesToRun = pendingOrders.map(async (order) => {
      try {
        await this.updateOrderStatus(
          { id: order.id },
          OrderStatus.PAYMENT_FAILED,
        );
      } catch (error) {
        console.log(`Error updating order ${order.id} to payment failed`);
        console.error(error);
      }
    });

    await Promise.allSettled(promisesToRun);
  }
}
