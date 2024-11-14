import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { createOrderNo } from '../helpers/create-order-no';
import { ShippingAddress } from './shipping-address.entity';
import { OrderStatus } from '../types/order-status';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_no', type: 'varchar', nullable: false })
  @Index('idx_order_no', { unique: true })
  orderNo: string;

  @Column({ name: 'payment_id', type: 'int', nullable: true, default: null })
  @Index('idx_payment_id')
  paymentId: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  @Index('idx_user_id')
  userId: number;

  @Column({ name: 'shipping_address_id', type: 'int', nullable: false })
  shippingAddressId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'tracking_no', type: 'varchar', nullable: true })
  trackingNo: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PAYMENT_PENDING,
  })
  status: OrderStatus;

  @OneToOne(() => ShippingAddress, (shippingAddress) => shippingAddress.order)
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: ShippingAddress;

  // One order can have multiple order items
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  orderItems: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order, {
    eager: true,
  })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  async generateOrderNo() {
    if (!this.orderNo) {
      this.orderNo = await createOrderNo();
    }
  }
}
