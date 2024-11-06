import { CartItem } from "@/services/cart/cart.types";

export interface CartItemProps {
  data: CartItem;
  onRemove: (data: CartItem) => void;
  onUpdateQty: (data: CartItem, qty: number) => void;
}
