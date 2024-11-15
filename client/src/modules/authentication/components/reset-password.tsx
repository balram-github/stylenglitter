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
import { resetPassword } from "@/services/auth/auth.service";
import { useRouter } from "next/router";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (values) => {
    try {
      await resetPassword(token, values.password);
      toast({
        description:
          "Successfully reset password, please login with your new password.",
      });
      router.push("/authentication/login");
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
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be valid",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be valid",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordFormValues = z.infer<typeof formSchema>;

export default ResetPasswordForm;
