import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '@modules/order/entities/order.entity';
import { UserAddress } from './user-address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 320 })
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  @Index()
  phoneNumber: string;

  @Column({ name: 'cart_id', type: 'int', nullable: false })
  cartId: number;

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => UserAddress, (address) => address.user, {
    cascade: true,
    eager: true,
  })
  addresses: UserAddress[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}