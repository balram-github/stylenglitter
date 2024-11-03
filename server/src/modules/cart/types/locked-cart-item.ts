import { CartItem } from '../entities/cart-item.entity';

export interface LockedCartItem extends CartItem {
  totalPrice: number;
}
