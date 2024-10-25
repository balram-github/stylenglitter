import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { OrderItem } from '@/modules/order/entities/order-item.entity';

@Entity('product_amounts')
export class ProductAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId: number;

  @OneToOne(() => Product, (product) => product.amount, {
    onDelete: 'CASCADE',
  })
  product: Product;

  // One product can be part of multiple order items
  @OneToMany(() => OrderItem, (orderItem) => orderItem.productAmount)
  orderItems: OrderItem[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
