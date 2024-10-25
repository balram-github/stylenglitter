import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Razorpay from 'razorpay';
import { EntityManager, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentPayload } from './types/create-payment-payload';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('RAZORPAY_CLIENT') private readonly razorpayClient: Razorpay,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(
    orderId: number,
    payload: CreatePaymentPayload,
    transactionEntityManager: EntityManager,
  ) {
    const payment = this.paymentRepository.create({});

    const savedPayment = await transactionEntityManager.save(payment);

    const response = await this.razorpayClient.orders.create({
      amount: payload.amount,
      currency: 'INR',
      receipt: savedPayment.referenceNo,
      payment_capture: true,
      notes: {
        internal_order_id: orderId,
      },
    });

    return { payment, paymentGatewayResponse: response };
  }
}
