import { Cart } from "@/services/cart/cart.types";
import { Product } from "@/services/products/products.types";
import { create } from "zustand";

type CartStore = {
  isLoading: boolean;
  cart: Cart;
  setLoading: (isLoading: boolean) => void;
  setCart: (cart: Cart) => void;
  upsertCartItem: (product: Product, qty: number) => void;
  removeCartItem: (productId: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  isLoading: false,
  cart: {
    id: -1,
    userId: -1,
    isGuestCart: true,
    cartItems: [],
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setCart: (cart: Cart) => set({ cart }),
  upsertCartItem: (product: Product, qty: number) =>
    set((state) => {
      if (qty <= 0) {
        return {
          cart: {
            ...state.cart,
            cartItems: state.cart.cartItems.filter(
              (item) => item.productId !== product.id
            ),
          },
        };
      }

      const existingItem = state.cart.cartItems.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        return {
          cart: {
            ...state.cart,
            cartItems: state.cart.cartItems.map((item) =>
              item.productId === product.id ? { ...item, qty } : item
            ),
          },
        };
      }

      return {
        cart: {
          ...state.cart,
          cartItems: [
            ...state.cart.cartItems,
            { id: -1, productId: product.id, product, qty },
          ],
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
