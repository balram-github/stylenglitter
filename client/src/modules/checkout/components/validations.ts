import { z } from "zod";
import { PHONE_NUMBER_REGEX } from "@/modules/authentication/constants";
import { TypeOfPayment } from "@/services/order/order.types";


const shippingAddressSchema = z.object({
  addressLine: z
    .string()
    .min(1, "Address is required")
    .max(1024, "Address must be less than 1024 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must be less than 100 characters"),
  pinCode: z
    .string()
    .min(1, "PIN code is required")
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid Indian PIN code"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_NUMBER_REGEX, "Invalid Indian phone number"),
});



export const checkoutFormSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.nativeEnum(TypeOfPayment),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;
