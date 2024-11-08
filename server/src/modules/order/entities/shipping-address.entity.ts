import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('shipping_addresses')
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  phoneNumber: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ name: 'address_line', type: 'varchar', length: 1024 })
  addressLine: string;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'state', type: 'varchar' })
  state: string;

  @Column({ name: 'pin_code', type: 'varchar' })
  pinCode: string;

  @Column({ name: 'country', type: 'varchar', default: 'India' })
  country: string;

  @OneToOne(() => Order, (order) => order.shippingAddress)
  order: Order;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
