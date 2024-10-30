import { Product } from '@/modules/product/entities/product.entity';
import slugify from 'slugify';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('product_themes')
export class ProductTheme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ name: 'cover_img_url', type: 'varchar' })
  coverImgUrl: string;

  @OneToMany(() => Product, (product) => product.productTheme)
  products: Product[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, trim: true }); // Create a slug from the name
  }
}
