import { request } from "@/lib/request";
import { Discount, GetDiscountsResponse } from "./discount.types";

export const getDiscounts = async (): Promise<Discount[]> => {
  const {
    data: { data },
  } = await request.get<GetDiscountsResponse>("/discounts");

  return data;
};
