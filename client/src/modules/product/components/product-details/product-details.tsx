import React from "react";
import { z } from "zod";
import { Product } from "@/services/products/products.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Ship } from "lucide-react";
import Image from "next/image";
import PaymentMethodBanner from "../../../../../public/images/banners/payment-methods.png";
import { Separator } from "@/components/ui/separator";
import {
  COD_ORDER_DELIVERY_CHARGE,
  MAX_PRODUCT_QUANTITY_ALLOWED,
  PREPAID_ORDER_DELIVERY_CHARGE,
  PREPAID_ORDER_THRESHOLD_FOR_FREE_DELIVERY,
} from "@/constants";
import { trackEvent } from "@/services/tracking/tracking.service";

type ProductDetailsProps = {
  product: Product;
  upsertToCart: (qty: number) => Promise<void>;
};

const formSchema = z.object({
  qty: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(
      MAX_PRODUCT_QUANTITY_ALLOWED,
      `You cannot add more than ${MAX_PRODUCT_QUANTITY_ALLOWED} items`
    ),
});

type ProductDetailsFormValues = z.infer<typeof formSchema>;

export const ProductDetails = ({
  product,
  upsertToCart: onAddToCart,
}: ProductDetailsProps) => {
  const form = useForm<ProductDetailsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qty: 1,
    },
  });

  const onSubmit: SubmitHandler<ProductDetailsFormValues> = async (values) => {
    trackEvent("add_to_cart", {
      productId: product.id,
      productCode: product.code,
      qty: values.qty,
    });
    await onAddToCart(values.qty);
  };

  const isProductInStock = product.qty > 0;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        {product.name}
      </h1>

      <div className="text-primary flex items-baseline md:gap-2 gap-4 mb-3">
        <div className="text-xl md:text-2xl">
          Rs. {parseFloat(product.amount.price).toFixed(2)}
        </div>
        <div className="text-gray-500 line-through text-md md:text-lg">
          Rs. {parseFloat(product.amount.basePrice).toFixed(2)}
        </div>
      </div>
      <p className="text-xs md:text-sm text-gray-500 mb-6">
        GST Included. FREE Delivery On Order Above Rs. 500
      </p>

      {isProductInStock && (
        <>
          <p className="text-sm">
            Hurry up! Only{" "}
            <span className="font-bold text-primary">{product.qty}</span> left.
          </p>
          <div className="w-full h-1.5 bg-primary rounded-full my-4" />
        </>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 flex gap-6 md:items-end flex-col md:flex-row"
        >
          <FormField
            control={form.control}
            name="qty"
            render={({ field }) => (
              <FormItem>
                <div>
                  <div className="text-sm mb-2 pl-1">Quantity</div>
                  <div className="inline-flex border border-gray-200 rounded-md w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-0 h-10"
                      disabled={!isProductInStock}
                      onClick={() => {
                        const newValue = Math.max(1, field.value - 1);
                        field.onChange(newValue);
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="w-12 text-center rounded-none border-0 px-0 h-10"
                        disabled
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-0 h-10"
                      disabled={!isProductInStock}
                      onClick={() => {
                        const newValue = Math.min(
                          MAX_PRODUCT_QUANTITY_ALLOWED,
                          field.value + 1
                        );
                        field.onChange(newValue);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full md:w-80 bg-primary text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isProductInStock}
            isLoading={form.formState.isSubmitting}
          >
            Add to Cart
          </Button>
        </form>
      </Form>
      <div className="my-8 md:my-12 flex justify-center">
        <Image
          priority
          src={PaymentMethodBanner}
          alt="Payment Methods"
          className="w-full md:w-2/3"
        />
      </div>
      {isProductInStock && (
        <div className="my-4 md:my-8 flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <Ship className="w-4 h-4" />
          <p>Estimate delivery times: 5-9 days (India).</p>
        </div>
      )}
      <Separator className="my-4 md:my-8" />
      <p className="text-sm md:text-base">{product.description}</p>
      <Separator className="my-4 md:my-8" />
      <div className="text-sm md:text-base">
        <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">
          Shipping Policy
        </h3>
        <ul className="list-disc list-inside">
          <li className="py-2">
            Free delivery above Rs. {PREPAID_ORDER_THRESHOLD_FOR_FREE_DELIVERY}{" "}
            for prepaid orders.
          </li>
          <li className="py-2">
            Fixed delivery charges: Rs. {PREPAID_ORDER_DELIVERY_CHARGE} for
            prepaid orders.
          </li>
          <li className="py-2">COD available</li>
          <li className="py-2">
            Pay flat Rs. {COD_ORDER_DELIVERY_CHARGE} upfront for COD orders.
          </li>
          <li className="py-2">
            Delivery time: 5-9 days (India). Please note that the delivery time
            may vary depending on the location.
          </li>
        </ul>
      </div>
      <Separator className="my-4 md:my-8" />
      <div className="text-sm md:text-base">
        <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">
          Refund & Exchange
        </h3>
        <p>Once purchased, the product cannot be returned or exchanged.</p>
      </div>
    </div>
  );
};
