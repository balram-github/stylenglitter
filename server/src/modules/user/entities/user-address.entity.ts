import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from '@/modules/order/entities/order.entity';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  phoneNumber: string;

  @Column({ name: 'address_line', type: 'varchar', length: 1024 })
  addressLine: string;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'state', type: 'varchar' })
  state: string;

  @Column({ name: 'pin_code', type: 'varchar' })
  pinCode: string;

  @Column({ name: 'country', type: 'varchar' })
  country: string;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  @Index('idx_user_id')
  userId: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Order, (order) => order.shippingAddress)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
