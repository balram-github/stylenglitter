import slugify from 'slugify';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Category } from '@modules/category/category.entity';
import { ProductAmount } from './product-amount.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column('int', { unsigned: true })
  qty: number;

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @Column({ name: 'amount_id', type: 'int', nullable: true })
  amountId?: number;

  @OneToOne(() => ProductAmount, (productAmount) => productAmount.product, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'amount_id' })
  amount: ProductAmount;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, trim: true }); // Create a slug from the name
  }
}
