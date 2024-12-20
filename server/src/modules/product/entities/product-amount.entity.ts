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
import { DecimalColumn } from '@/decorators/decimal-column.decorator';

@Entity('product_amounts')
export class ProductAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @DecimalColumn({
    name: 'price',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @DecimalColumn({
    name: 'base_price',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  basePrice: number;

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
