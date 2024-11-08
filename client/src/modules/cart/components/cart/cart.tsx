import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart/cart.store";
import { Loader2, ShoppingCart } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useUser } from "@/hooks/use-user";
import {
  getGuestCart,
  getUserCart,
  removeCartItemsFromDB,
  saveGuestCartItemsToDB,
  upsertCartItemToDB,
} from "@/services/cart/cart.service";
import type { Cart as ICart } from "@/services/cart/cart.types";
import { Product } from "@/services/products/products.types";
import { toast } from "@/hooks/use-toast";
import { CartItem } from "../cart-item/cart-item";
import { useRouter } from "next/router";

export const Cart = () => {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const {
    isLoading,
    cart,
    setCart,
    setLoading,
    removeCartItem: removeCartItemFromStore,
    upsertCartItem: upsertCartItemToStore,
  } = useCartStore();

  const syncCart = async () => {
    try {
      setLoading(true);
      let cart: ICart;

      if (isLoggedIn) {
        await saveGuestCartItemsToDB();
        cart = await getUserCart();
      } else {
        cart = await getGuestCart();
      }
      setCart(cart);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncCart();
  }, [isLoggedIn]);

  const handleUpsertToCart = async (product: Product, qty: number) => {
    try {
      await upsertCartItemToDB(product.id, qty, !isLoggedIn);

      upsertCartItemToStore(product, qty);
    } catch (error) {
      console.error(error);

      toast({
        title: "Failed to update item in cart",
        description: "Please try again later",
      });
    }
  };

  const handleRemoveCartItem = async (productId: number) => {
    try {
      await removeCartItemsFromDB([productId], !isLoggedIn);

      removeCartItemFromStore(productId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to remove item from cart",
        description: "Please try again later",
      });
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push(
        `/authentication/login?redirectTo=${encodeURIComponent("/checkout")}`
      );
    } else {
      router.push("/checkout");
    }
  };

  const totalCartValue = useMemo(() => {
    return cart.cartItems.reduce((acc, item) => {
      if (item.product) {
        return acc + Number(item.product.amount.price) * item.qty;
      }
      return acc;
    }, 0);
  }, [cart.cartItems]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart size={20} />
          {cart.cartItems.length > 0 && (
            <div className="absolute top-0 right-0 bg-rose-500 text-white min-w-4 min-h-4 rounded-full flex items-center justify-center text-xs">
              {cart.cartItems.length}
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="h-screen w-full max-w-[540px]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg md:text-2xl font-bold">
            Cart
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100%-48px)] flex flex-col justify-between">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader2 size={20} />
            </div>
          )}
          {!isLoading && cart.cartItems.length === 0 && (
            <div className="flex justify-center items-center h-full gap-4 flex-col">
              <ShoppingCart size={48} />
              <p className="md:text-lg font-bold">Your cart is empty</p>
            </div>
          )}
          {!isLoading && cart.cartItems.length > 0 && (
            <>
              <div className="h-full overflow-y-auto flex flex-col gap-4 pb-4">
                {cart.cartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    data={item}
                    onRemove={() => handleRemoveCartItem(item.productId)}
                    onUpdateQty={(data, qty) => {
                      if (data.product) {
                        handleUpsertToCart(data.product, qty);
                      }
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="flex justify-between mb-4 md:mb-8 border-t border-b pt-4 pb-4">
                  <p className="font-bold">Sub total</p>
                  <p>Rs. {totalCartValue}</p>
                </div>
                <div className="flex justify-center">
                  <SheetClose asChild>
                    <Button
                      onClick={handleCheckout}
                      className="w-full max-w-80 bg-rose-400 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Checkout
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
