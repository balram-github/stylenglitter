import { request } from "@/lib/request";
import {
  GetProductThemesResponse,
  GetProductsOfProductThemeResponse,
} from "./product-themes.types";

export const getProductsOfProductTheme = async (
  slug: string,
  pagination: { page: number; limit: number }
) => {
  const {
    data: { data },
  } = await request.get<GetProductsOfProductThemeResponse>(
    `/product-themes/${slug}/products`,
    {
      params: {
        ...pagination,
      },
    }
  );

  return data;
};

export const getProductThemes = async () => {
  const {
    data: { data },
  } = await request.get<GetProductThemesResponse>("/product-themes");

  return data;
};
