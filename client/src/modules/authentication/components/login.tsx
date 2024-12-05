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
import { useRouter } from "next/router";
import { login } from "@/services/auth/auth.service";
import { queryClient } from "@/lib/query";
import Link from "next/link";
import { trackEvent } from "@/services/tracking/tracking.service";

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const redirectTo = router.query.redirectTo
    ? decodeURIComponent(router.query.redirectTo as string)
    : "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      trackEvent("login", {
        email: values.email,
      });

      await login(values);
      toast({
        description: "Successfully logged in!",
      });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(redirectTo);
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
    }
  };
  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="flex justify-end">
              <Link
                href={`/authentication/request-password-reset`}
                className="text-sm text-gray-500 hover:underline hover:text-primary"
              >
                Forgot password?
              </Link>
            </div> */}
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <Button className="w-full max-w-72" isLoading={isSubmitting}>
              Submit
            </Button>
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href={`/authentication/register?redirectTo=${redirectTo}`}
                className="underline text-primary"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be valid",
  }),
  password: z.string().min(6, {
    message: "Password must be atleast 6 characters long",
  }),
});

export type LoginFormValues = z.infer<typeof formSchema>;

export default LoginForm;
