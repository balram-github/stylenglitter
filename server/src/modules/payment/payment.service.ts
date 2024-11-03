import crypto from 'crypto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type Razorpay from 'razorpay';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentPayload } from './types/create-payment-payload';
import { createPaymentReferenceNo } from './helpers/create-reference-no';
import { ConfigService } from '@nestjs/config';
import { VerifyPaymentDto } from './dtos/verify-payment.dto';
import { VerifyWebhookSignaturePayload } from './types/verify-webhook-signature-payload';
import {
  OrderPaidWebhookEventPayload,
  PaymentFailedWebhookEventPayload,
  RefundCreatedWebhookEventPayload,
  RefundFailedWebhookEventPayload,
  RefundProcessedWebhookEventPayload,
  WebhookEventPayload,
} from './types/webhook-event-payload';
import { PaymentStatus } from './types/payment-status';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationTopic } from '../notification/types/notification-topics';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    @Inject('RAZORPAY_CLIENT') private readonly razorpayClient: Razorpay,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private eventEmitter: EventEmitter2,
  ) {}

  getOne(findOptions: FindOneOptions<Payment>, entityManager?: EntityManager) {
    if (entityManager) return entityManager.findOne(Payment, findOptions);

    return this.paymentRepository.findOne(findOptions);
  }

  async createPayment(
    orderId: number,
    payload: CreatePaymentPayload,
    transactionEntityManager: EntityManager,
  ) {
    const paymentReferenceNo = await createPaymentReferenceNo();

    const response = await this.razorpayClient.orders.create({
      amount: payload.amount * 100,
      currency: 'INR',
      receipt: paymentReferenceNo,
      payment_capture: true,
      notes: {
        internal_order_id: orderId,
      },
    });

    const payment = this.paymentRepository.create({
      referenceNo: paymentReferenceNo,
      paymentGatewayId: response.id,
      amount: payload.amount,
    });

    const savedPayment = await transactionEntityManager.save(payment);

    return { payment: savedPayment, paymentGatewayResponse: response };
  }

  async verifyPaymentSignature(payload: VerifyPaymentDto) {
    const payment = await this.getOne({
      where: { paymentGatewayId: payload.razorpay_order_id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const hmac = crypto.createHmac(
      'sha256',
      this.configService.getOrThrow<string>('payment.razorPaySecretKey'),
    );

    hmac.update(payment.paymentGatewayId + '|' + payload.razorpay_payment_id);

    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === payload.razorpay_signature) {
      return true;
    }

    return false;
  }

  async verifyWebhookSignature({
    payload,
    signature,
  }: VerifyWebhookSignaturePayload) {
    const hmac = crypto.createHmac(
      'sha256',
      this.configService.getOrThrow<string>('payment.razorPayWebhookSecret'),
    );

    hmac.update(payload);

    const generatedSignature = hmac.digest('hex');

    return generatedSignature === signature;
  }

  private async handlePaymentOrderPaid(payload: OrderPaidWebhookEventPayload) {
    const {
      payload: { order },
    } = payload;

    const paymentEntity = await this.getOne({
      where: { paymentGatewayId: order.entity.id },
    });

    if (!paymentEntity) {
      throw new NotFoundException('Payment not found');
    }

    paymentEntity.status = PaymentStatus.SUCCESSFUL;

    await this.paymentRepository.save(paymentEntity);

    this.eventEmitter.emit(NotificationTopic.PAYMENT_PAID, {
      paymentId: paymentEntity.id,
    });
  }

  private async handlePaymentFailed(payload: PaymentFailedWebhookEventPayload) {
    const {
      payload: { payment },
    } = payload;

    const paymentEntity = await this.getOne({
      where: { paymentGatewayId: payment.entity.order_id },
    });

    if (!paymentEntity) {
      throw new NotFoundException('Payment not found');
    }

    paymentEntity.status = PaymentStatus.FAILED;

    await this.paymentRepository.save(paymentEntity);

    // TODO - Send email for payment failed
  }

  private async handleRefundCreated(payload: RefundCreatedWebhookEventPayload) {
    const {
      payload: { payment },
    } = payload;

    const paymentEntity = await this.getOne({
      where: { paymentGatewayId: payment.entity.order_id },
    });

    if (!paymentEntity) {
      throw new NotFoundException('Payment not found');
    }

    paymentEntity.status = PaymentStatus.REFUND_INITIATED;

    await this.paymentRepository.save(paymentEntity);

    // TODO - Send email for refund initiated
  }

  private async handleRefundProcessed(
    payload: RefundProcessedWebhookEventPayload,
  ) {
    const {
      payload: { payment },
    } = payload;

    const paymentEntity = await this.getOne({
      where: { paymentGatewayId: payment.entity.order_id },
    });

    if (!paymentEntity) {
      throw new NotFoundException('Payment not found');
    }

    paymentEntity.status = PaymentStatus.REFUND_COMPLETE;

    await this.paymentRepository.save(paymentEntity);

    // TODO - Send email for refund complete
  }

  private async handleRefundFailed(payload: RefundFailedWebhookEventPayload) {
    const {
      payload: { payment },
    } = payload;

    const paymentEntity = await this.getOne({
      where: { paymentGatewayId: payment.entity.order_id },
    });

    if (!paymentEntity) {
      throw new NotFoundException('Payment not found');
    }

    paymentEntity.status = PaymentStatus.REFUND_FAILED;

    await this.paymentRepository.save(paymentEntity);

    // TODO - Send email for refund failed
  }

  async handleWebhookEvent(eventPayload: WebhookEventPayload) {
    switch (eventPayload.event) {
      case 'order.paid': {
        return this.handlePaymentOrderPaid(eventPayload);
      }
      case 'payment.failed': {
        return this.handlePaymentFailed(eventPayload);
      }
      case 'refund.created': {
        return this.handleRefundCreated(eventPayload);
      }
      case 'refund.failed': {
        return this.handleRefundFailed(eventPayload);
      }
      case 'refund.processed': {
        return this.handleRefundProcessed(eventPayload);
      }
    }
  }
}
