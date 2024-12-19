import React from "react";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import Link from "next/link";
import { PHONE_NUMBER_REGEX } from "@/modules/authentication/constants";
import { TRACK_DELIVERY_URL } from "@/constants";

const OrderTrackPage = () => {
  const router = useRouter();

  const form = useForm<OrderTrackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNo: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit: SubmitHandler<OrderTrackFormValues> = async (values) => {
    router.push(
      `/orders/${values.orderNo}?email=${values.email}&phoneNumber=${values.phoneNumber}`
    );
  };

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Track your order</CardTitle>
        <CardDescription>
          Enter your order details below to track your order
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="orderNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order No</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your order no"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
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
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <Button className="w-full max-w-72" type="submit">
              Track
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Have AWB number? Track delivery via our delivery partner by
              clicking
              <Link
                href={TRACK_DELIVERY_URL}
                target="_blank"
                className="font-bold text-sm uppercase pl-1 underline"
              >
                here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const formSchema = z.object({
  orderNo: z.string().min(1, { message: "Order No is required" }),
  email: z.string().email({ message: "Email must be valid" }),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, {
    message: "Please enter a valid Indian phone number",
  }),
});

export type OrderTrackFormValues = z.infer<typeof formSchema>;

export default OrderTrackPage;
