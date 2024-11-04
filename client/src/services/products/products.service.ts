import { request } from "@/lib/request";
import { GetProductBySlugResponse } from "./products.types";

export const getProductBySlug = async (slug: string) => {
  const {
    data: { data },
  } = await request.get<GetProductBySlugResponse>(`/products/${slug}`);

  return data;
};
