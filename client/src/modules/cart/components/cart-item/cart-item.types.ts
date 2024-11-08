import { CartItem } from "@/services/cart/cart.types";

export interface CartItemProps {
  data: CartItem;
  readonly?: boolean;
  onRemove?: (data: CartItem) => void;
  onUpdateQty?: (data: CartItem, qty: number) => void;
}
