import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_amounts')
export class ProductAmount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @OneToOne(() => Product, (product) => product.amount, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
