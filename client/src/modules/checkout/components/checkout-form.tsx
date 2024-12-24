import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
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
import { useCallback, useMemo, useState } from "react";
import { trackEvent } from "@/services/tracking/tracking.service";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Cart } from "@/services/cart/cart.types";
import { useRouter } from "next/router";
import { wait } from "@/utils/utils";
import { TicketIcon } from "lucide-react";

interface DialogState {
  isOpen: boolean;
  type: "success" | "error" | null;
  message: string;
  orderNo?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { isLoggedIn, user } = useUser();
  const {
    cart: { cartItems },
    setCart,
    setLoading: setCartLoading,
  } = useCartStore();

  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: null,
    message: "",
    orderNo: "",
  });

  const form = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: {
        name: user?.name,
        email: user?.email,
        addressLine: "",
        city: "",
        state: "",
        pinCode: "",
        phoneNumber: "",
      },
      paymentMethod: TypeOfPayment.PREPAID,
    },
    reValidateMode: "onChange",
  });

  const productsToPurchase = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      })),
    [cartItems]
  );

  const paymentMethod = form.watch("paymentMethod");

  const { data, isLoading: isFetchingPurchaseCharges } = useQuery({
    queryKey: [
      "cart",
      "purchase-charges",
      paymentMethod,
      productsToPurchase.map((item) => `${item.productId}-${item.qty}`),
    ],
    queryFn: () =>
      getCartPurchaseCharges({
        paymentMethod,
        products: productsToPurchase,
      }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

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

      const { orderNo, paymentGatewayResponse } = await createOrder({
        ...data,
        productsToPurchase,
      });

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

          setDialogState({
            isOpen: true,
            type: "success",
            message: "Thank you for shopping with us!",
            orderNo,
          });
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
        setDialogState({
          isOpen: true,
          type: "error",
          message: response.error.description,
        });
      });

      rzp.open();
    } catch (error) {
      console.error(error);

      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            error.response?.data?.error ||
            "We are looking into it. Please try again later",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "We are looking into it. Please try again later",
        });
      }
    }
  };

  const onTimeout = useCallback(async () => {
    const { shippingAddress } = form.getValues();
    router.push(
      `/orders/${dialogState.orderNo}?email=${shippingAddress.email}&phoneNumber=${shippingAddress.phoneNumber}`
    );
    await wait(2000);
    resetCart();
  }, [router, form, dialogState.orderNo]);

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
            <FormField
              control={form.control}
              name="shippingAddress.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingAddress.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="shippingAddress.addressLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
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
                  <FormLabel>City*</FormLabel>
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
                  <FormLabel>State*</FormLabel>
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
                  <FormLabel>PIN Code*</FormLabel>
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
                  <FormLabel>Phone Number*</FormLabel>
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
              <div className="flex justify-between border-t py-4 text-sm">
                <p className="font-bold">Sub total</p>
                <p>Rs. {data.subTotal}</p>
              </div>
              {data.appliedDiscounts.length > 0 && (
                <div className="py-4 border-t flex flex-col gap-4 md:flex-row md:items-center">
                  <p className="font-bold flex-1">Applied Discounts</p>
                  <div className="flex flex-col gap-2 md:items-end">
                    {data.appliedDiscounts.map((discount) => (
                      <div
                        key={discount.slug}
                        className="flex gap-2 font-bold text-green-800"
                      >
                        <TicketIcon
                          className="mt-0.5"
                          size={16}
                          color="#166534"
                        />{" "}
                        <div className="md:text-right">
                          <div className="text-sm">{discount.name}</div>
                          <div className="text-xs text-gray-500">
                            {discount.slug}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between border-t py-4 text-sm">
                <p className="font-bold">Delivery charge</p>
                <p>Rs. {data.deliveryCharge}</p>
              </div>
              {paymentMethod === TypeOfPayment.COD && (
                <div className="flex justify-between border-t py-4">
                  <p className="font-bold">Pay on delivery</p>
                  <p>Rs. {data.payLater}</p>
                </div>
              )}
              <div className="flex justify-between border-t border-b py-4">
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
            disabled={!data}
            className="w-full max-w-80 bg-primary text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Place Order
          </Button>
        </div>
        {!form.formState.isValid && (
          <p className="text-sm font-medium text-red-500 dark:text-red-900 text-center">
            Please fill in all required fields.
          </p>
        )}
      </form>
      <PaymentSuccessDialog
        open={dialogState.type === "success" && dialogState.isOpen}
        orderNo={dialogState.orderNo ?? ""}
        onTimeout={onTimeout}
      />
      <PaymentFailedDialog
        open={dialogState.type === "error" && dialogState.isOpen}
        errorMessage={dialogState.message}
      />
    </Form>
  );
}
