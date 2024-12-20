import { Column, ColumnOptions } from 'typeorm';
import { decimalTransformer } from '../lib/transformers/decimal.transformer';

export interface DecimalColumnOptions
  extends Omit<ColumnOptions, 'type' | 'transformer'> {
  precision?: number;
  scale?: number;
}

export function DecimalColumn(options: DecimalColumnOptions = {}) {
  return Column({
    type: 'decimal',
    transformer: decimalTransformer,
    ...options,
  });
}
