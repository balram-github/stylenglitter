import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { checkoutFormSchema } from "./validations";
import { CheckoutFormSchema } from "./validations";
import { TypeOfPayment } from "@/services/order/order.types";
import {
  COD_ORDER_DELIVERY_CHARGE,
  PREPAID_ORDER_DELIVERY_CHARGE,
} from "@/constants";
import { useCartStore } from "@/stores/cart/cart.store";
import { useQuery } from "@tanstack/react-query";
import {
  getCartPurchaseCharges,
  getUserCart,
  getGuestCart,
  removeCartItemsFromDB,
} from "@/services/cart/cart.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { createOrder } from "@/services/order/order.service";
import {
  RazorpayOptions,
  RazorpayResponse,
  RazorpayErrorResponse,
} from "@/types/razorpay";
import { verifyPayment } from "@/services/payment/payment.service";
import { PaymentSuccessDialog } from "./payment-success-dialog";
import { PaymentFailedDialog } from "./payment-failed-dialog";
import { useState } from "react";
import { trackEvent } from "@/services/tracking/tracking.service";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Cart } from "@/services/cart/cart.types";

interface DialogState {
  isOpen: boolean;
  type: "success" | "error" | null;
  message: string;
  orderNo?: string;
}

export function CheckoutForm() {
  const { isLoggedIn } = useUser();
  const {
    cart: { cartItems },
    setCart,
    setLoading: setCartLoading,
  } = useCartStore();

  const form = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: {
        addressLine: "",
        city: "",
        state: "",
        pinCode: "",
        phoneNumber: "",
      },
      paymentMethod: TypeOfPayment.PREPAID,
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const { data, isLoading: isFetchingPurchaseCharges } = useQuery({
    queryKey: [
      "cart",
      "purchase-charges",
      paymentMethod,
      cartItems.map((item) => `${item.productId}-${item.qty}`),
    ],
    queryFn: () => getCartPurchaseCharges(paymentMethod),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: null,
    message: "",
    orderNo: "",
  });

  const router = useRouter();

  const resetCart = async () => {
    setCartLoading(true);
    try {
      await removeCartItemsFromDB(
        cartItems.map((item) => item.productId),
        !isLoggedIn
      );
      let newCart: Cart;
      if (isLoggedIn) {
        newCart = await getUserCart();
      } else {
        newCart = await getGuestCart();
      }
      setCart(newCart);
    } catch (error) {
      console.error(error);
    } finally {
      setCartLoading(false);
    }
  };

  const onSubmit: SubmitHandler<CheckoutFormSchema> = async (
    data: CheckoutFormSchema
  ) => {
    try {
      trackEvent("pay-button-clicked", {
        paymentMethod: data.paymentMethod,
      });

      const { orderNo, paymentGatewayResponse } = await createOrder(data);

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: paymentGatewayResponse.amount.toString(),
        currency: paymentGatewayResponse.currency,
        name: "Style Glitter",
        description: "Purchase from Style Glitter",
        order_id: paymentGatewayResponse.id,
        handler: async (response: RazorpayResponse) => {
          const isPaymentVerified = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!isPaymentVerified) {
            setDialogState({
              isOpen: true,
              type: "error",
              message: "We are looking into it. Please try again later",
            });
            return;
          }

          router.push(`/orders/${orderNo}`);

          setDialogState({
            isOpen: true,
            type: "success",
            message: "Thank you for shopping with us!",
            orderNo,
          });

          resetCart();
        },
        notes: {
          orderNo,
        },
        theme: {
          color: "#f43f5e",
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay is not available");
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: RazorpayErrorResponse) {
        console.log(response);

        setDialogState({
          isOpen: true,
          type: "error",
          message: response.error.description,
        });
      });

      rzp.open();
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "We are looking into it. Please try again later",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-2xl"
      >
        {/* Shipping Address Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shipping Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="shippingAddress.addressLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shippingAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingAddress.pinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PIN code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingAddress.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center px-3 border rounded-l bg-muted text-muted-foreground border-input">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="rounded-l-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Payment Type Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Payment Type
          </h2>
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={TypeOfPayment.PREPAID} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Prepaid - Rs. {PREPAID_ORDER_DELIVERY_CHARGE}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={TypeOfPayment.COD} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        <div>
                          Cash on Delivery - Rs. {COD_ORDER_DELIVERY_CHARGE}{" "}
                          (non-refundable)
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col">
          {isFetchingPurchaseCharges && (
            <>
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </>
          )}
          {!isFetchingPurchaseCharges && data && (
            <>
              <div className="flex justify-between border-t pt-4 pb-4 text-sm">
                <p className="font-bold">Sub total</p>
                <p>Rs. {data.subTotal}</p>
              </div>
              <div className="flex justify-between border-t pt-4 pb-4 text-sm">
                <p className="font-bold">Delivery charge</p>
                <p>Rs. {data.deliveryCharge}</p>
              </div>
              {paymentMethod === TypeOfPayment.COD && (
                <div className="flex justify-between border-t pt-4 pb-4">
                  <p className="font-bold">Pay on delivery</p>
                  <p>Rs. {data.payLater}</p>
                </div>
              )}
              <div className="flex justify-between border-t border-b pt-4 pb-4">
                <p className="font-bold">
                  {paymentMethod === TypeOfPayment.PREPAID
                    ? "Total"
                    : "Pay Now"}
                </p>
                <p className="text-lg font-bold">Rs. {data.payNow}</p>
              </div>
            </>
          )}
        </div>
        <p className="text-sm text-gray-500">
          By placing an order, you agree to our{" "}
          <Link href="/shipping-policy" className="underline">
            Shipping Policy
          </Link>{" "}
          and{" "}
          <Link href="/refund-return-policy" className="underline">
            Refund & Return Policy
          </Link>
        </p>
        <div className="flex justify-center">
          <Button
            type="submit"
            isLoading={form.formState.isSubmitting}
            disabled={!form.formState.isValid || isFetchingPurchaseCharges}
            className="w-full max-w-80 bg-primary text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Place Order
          </Button>
        </div>
      </form>
      <PaymentSuccessDialog
        open={dialogState.type === "success" && dialogState.isOpen}
        orderNo={dialogState.orderNo ?? ""}
      />
      <PaymentFailedDialog
        open={dialogState.type === "error" && dialogState.isOpen}
        errorMessage={dialogState.message}
      />
    </Form>
  );
}
