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
  OneToMany,
} from 'typeorm';
import { Category } from '@modules/category/category.entity';
import { ProductAmount } from './product-amount.entity';
import { CartItem } from '@modules/cart/entities/cart-item.entity';
import { OrderItem } from '@modules/order/entities/order-item.entity';
import { ProductImage } from './product-image.entity';
import { ProductTheme } from '@/modules/product-theme/entities/product-theme.entity';

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

  @Column({ name: 'product_theme_id', type: 'int', nullable: true })
  productThemeId?: number;

  @ManyToOne(() => ProductTheme, (theme) => theme.products)
  @JoinColumn({ name: 'product_theme_id' })
  productTheme: ProductTheme;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  // One product can be part of multiple cart items
  @OneToMany(() => CartItem, (cartItem) => cartItem.product, { cascade: true })
  cartItems: CartItem[];

  // One product can be part of multiple order items
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = `${slugify(this.name, { lower: true, trim: true })}-${this.code}`;
  }
}
