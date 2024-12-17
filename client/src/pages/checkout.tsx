import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useCartStore } from "@/stores/cart/cart.store";
import { CartItem } from "@/modules/cart/components/cart-item/cart-item";
import { CheckoutForm } from "@/modules/checkout/components/checkout-form";
import { useRouter } from "next/router";

const CheckoutPage = () => {
  const {
    isLoading: isCartLoading,
    cart: { cartItems },
  } = useCartStore();

  const router = useRouter();

  const isLoading = isCartLoading;

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/");
    }
  }, [cartItems]);

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-12">
          {/* First row on mobile / Left column on desktop - Order details */}
          <div className="space-y-4 order-2 md:order-1">
            <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
            <div className="grid grid-cols-1 gap-8">
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-52 w-full" />
                ))}
              {!isLoading &&
                cartItems.map((item) => (
                  <CartItem key={item.productId} data={item} readonly />
                ))}
            </div>
          </div>

          {/* Second row on mobile / Right column on desktop - Payment details */}
          <div className="space-y-4 order-1 md:order-2">
            <div className="w-full">
              {isLoading && <Skeleton className="h-12 md:h-4/5 w-full" />}
              {!isLoading && <CheckoutForm />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
