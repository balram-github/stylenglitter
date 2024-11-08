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
import { getCartPurchaseCharges } from "@/services/cart/cart.service";
import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutForm() {
  const {
    cart: { cartItems },
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

  const onSubmit: SubmitHandler<CheckoutFormSchema> = (
    data: CheckoutFormSchema
  ) => {
    console.log(data);
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
                          Cash on Delivery - Rs. {COD_ORDER_DELIVERY_CHARGE}
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
        <div className="flex justify-center">
          <Button
            type="submit"
            isLoading={form.formState.isSubmitting}
            disabled={!form.formState.isValid || isFetchingPurchaseCharges}
            className="w-full max-w-80 bg-rose-400 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Place Order
          </Button>
        </div>
      </form>
    </Form>
  );
}
