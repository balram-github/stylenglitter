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
import { isRequestError } from "@/lib/request";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/services/auth/auth.service";
import Link from "next/link";
import { PHONE_NUMBER_REGEX } from "../constants";
import { useRouter } from "next/router";

const RegisterForm = () => {
  const { toast } = useToast();

  const router = useRouter();
  
  const redirectTo =
    router.query.redirectTo ? decodeURIComponent(router.query.redirectTo as string)
      : "/";

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    try {
      await register(values);
    } catch (error) {
      let errorMsg = (error as Error).message;
      if (isRequestError(error)) {
        errorMsg =
          (error.response?.data as { error: string })?.error || error.message;
      }
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMsg,
      });
      throw error;
    }
  };
  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>Enter your details below to register</CardDescription>
      </CardHeader>
      {form.formState.isSubmitSuccessful && (
        <CardContent className="grid gap-4">
          <p>
            Successfully registered! We are sending you an email to verify your
            account. Please check your email.
          </p>
        </CardContent>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your name"
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
                      placeholder="Enter your email"
                      {...field}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <Button className="w-full max-w-72" isLoading={isSubmitting}>
              Submit
            </Button>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href={`/authentication/login?redirectTo=${redirectTo}`}
                className="underline text-rose-500"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email must be valid",
    }),
    password: z.string().min(8, {
      message: "Password must be valid",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be valid",
    }),
    phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, {
      message: "Please enter a valid Indian phone number",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof formSchema>;

export default RegisterForm;
