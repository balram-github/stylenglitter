import { request } from "@/lib/request";
import {
  GetProductByIdResponse,
  GetProductBySlugResponse,
} from "./products.types";

export const getProductBySlug = async (slug: string) => {
  const {
    data: { data },
  } = await request.get<GetProductBySlugResponse>(`/products/slug/${slug}`);

  return data;
};

export const getProductById = async (id: number) => {
  const {
    data: { data },
  } = await request.get<GetProductByIdResponse>(`/products/${id}`);

  return data;
};
