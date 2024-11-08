import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Head from "next/head";
import { useCartStore } from "@/stores/cart/cart.store";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { CartItem } from "@/modules/cart/components/cart-item/cart-item";

const CheckoutPage = () => {
  const { isLoading: isCartLoading, cart } = useCartStore();
  const { isLoading: isProtectedRouteLoading } = useProtectedRoute();

  const isLoading = isProtectedRouteLoading || isCartLoading;

  return (
    <>
      <Head>
        <title>Checkout | Style N Glitter</title>
      </Head>
      <main className="container mx-auto pt-8">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
          {/* First row on mobile / Left column on desktop - Order details */}
          <div className="space-y-4 order-2 md:order-1">
            <div className="grid grid-cols-1 gap-2 h-12 md:h-4/5 overflow-y-auto">
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-full w-full" />
                ))}
              {!isLoading &&
                cart.cartItems.map((item) => (
                  <CartItem key={item.productId} data={item} readonly />
                ))}
            </div>
          </div>

          {/* Second row on mobile / Right column on desktop - Payment details */}
          <div className="space-y-4 order-1 md:order-2">
            <div className="h-48 w-full">
              {isLoading && <Skeleton className="h-full w-full" />}
            </div>
            <div className="h-32 w-full">
              {isLoading && <Skeleton className="h-full w-full" />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
