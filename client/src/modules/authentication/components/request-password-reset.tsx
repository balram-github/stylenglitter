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
import { requestPasswordReset } from "@/services/auth/auth.service";

const RequestPasswordResetForm = () => {
  const { toast } = useToast();

  const form = useForm<RequestPasswordResetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<RequestPasswordResetFormValues> = async (
    values
  ) => {
    try {
      await requestPasswordReset(values.email);
      toast({
        description:
          "Successfully requested password reset! Please check your email for an email from us.",
      });
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
        <CardTitle className="text-2xl">Request Password Reset</CardTitle>
        <CardDescription>
          Enter your email below to request a password reset
        </CardDescription>
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

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be valid",
  }),
});

export type RequestPasswordResetFormValues = z.infer<typeof formSchema>;

export default RequestPasswordResetForm;
