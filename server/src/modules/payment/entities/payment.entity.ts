import { Order } from '@/modules/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
  Index,
  BeforeInsert,
} from 'typeorm';
import { createPaymentReferenceNo } from '../helpers/create-reference-no';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reference_no', type: 'varchar', nullable: false })
  @Index('idx_reference_no', { unique: true })
  referenceNo: string;

  @OneToOne(() => Order, (order) => order.payment)
  order: Order;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  async generateReferenceNo() {
    if (!this.referenceNo) {
      this.referenceNo = await createPaymentReferenceNo();
    }
  }
}
