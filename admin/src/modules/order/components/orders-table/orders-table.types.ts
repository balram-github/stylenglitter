
import { z } from "zod";
import { OrderStatus } from "@/services/order/order.types";

export const FilterSchema = z.object({
  orderNo: z.string().optional(),
  status: z.nativeEnum(OrderStatus).nullable(),
});

export type Filters = z.infer<typeof FilterSchema>;