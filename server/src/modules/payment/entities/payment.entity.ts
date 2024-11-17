import { Order } from '@/modules/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
  Index,
} from 'typeorm';
import { PaymentStatus } from '../types/payment-status';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
    default: PaymentStatus.INITIATED,
  })
  status: PaymentStatus;

  @Column({ name: 'reference_no', type: 'varchar', nullable: false })
  @Index('idx_reference_no', { unique: true })
  referenceNo: string;

  @Column({ name: 'payment_gateway_id', type: 'varchar', nullable: false })
  @Index('idx_payment_gateway_id', { unique: true })
  paymentGatewayId: string;

  @Column({ name: 'amount', type: 'decimal', nullable: false })
  amount: number;

  @Column({
    name: 'pending_amount',
    type: 'decimal',
    nullable: false,
    default: 0,
  })
  pendingAmount: number;

  @OneToOne(() => Order, (order) => order.payment)
  order: Order;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
