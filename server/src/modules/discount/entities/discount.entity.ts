import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DiscountEntityType } from '../types/discount-entity-type';
import { DiscountType } from '../types/discount-type';
import { DecimalColumn } from '@/decorators/decimal-column.decorator';

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  type: DiscountType;

  @Column({ name: 'entity_type', type: 'varchar', length: 255 })
  entityType: DiscountEntityType;

  @Column({ name: 'entity_id', type: 'int' })
  @Index('idx_entity_id')
  entityId: number;

  @Column({ name: 'min_qty', type: 'int' })
  minQty: number;

  @Column({ name: 'free_qty', type: 'int' })
  freeQty: number;

  @DecimalColumn({ name: 'flat_price', precision: 10, scale: 2 })
  flatPrice: number;

  @DecimalColumn({ precision: 10, scale: 2 })
  percentage: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
