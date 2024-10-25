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
import { User } from '@modules/user/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { createOrderNo } from '../helpers/create-order-no';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_no', type: 'varchar', nullable: false })
  @Index('idx_order_no', { unique: true })
  orderNo: string;

  @Column({ name: 'payment_id', type: 'int', nullable: false })
  paymentId: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

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
