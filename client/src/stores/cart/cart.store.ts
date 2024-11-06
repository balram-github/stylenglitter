import { getGuestCartItems } from "@/services/cart/cart.service";
import { Cart } from "@/services/cart/cart.types";
import { create } from "zustand";

type CartStore = {
  isLoading: boolean;
  cart: Cart;
};

export const useCartStore = create<CartStore>((set) => ({
  isLoading: true,
  cart: {
    id: -1,
    userId: -1,
    isGuestCart: true,
    cartItems: getGuestCartItems(),
  },
  setCart: (cart: Cart) => set({ cart, isLoading: false }),
  upsertCartItem: (productId: number, qty: number) =>
    set((state) => {
      if (qty <= 0) {
        return {
          cart: {
            ...state.cart,
            cartItems: state.cart.cartItems.filter(
              (item) => item.productId !== productId
            ),
          },
        };
      }

      return {
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, { id: -1, productId, qty }],
        },
      };
    }),
  removeCartItem: (productId: number) =>
    set((state) => ({
      cart: {
        ...state.cart,
        cartItems: state.cart.cartItems.filter(
          (item) => item.productId !== productId
        ),
      },
    })),
}));
