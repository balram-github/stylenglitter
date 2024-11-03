import { request } from "@/lib/request";
import {
  Category,
  GetCategoriesResponse,
  GetProductsOfCategoryResponse,
} from "./categories.types";

export const getProductsOfCategory = async (
  slug: string,
  pagination: { page: number; limit: number }
) => {
  const {
    data: { data },
  } = await request.get<GetProductsOfCategoryResponse>(
    `/categories/${slug}/products`,
    {
      params: {
        ...pagination,
      },
    }
  );

  return data;
};

export const getCategories = async () => {
  const {
    data: { data },
  } = await request.get<GetCategoriesResponse>("/categories");

  const promisesToRun = data.map(async (category) => {
    const { products } = await getProductsOfCategory(category.slug, {
      page: 1,
      limit: 5,
    });

    return {
      ...category,
      products,
    };
  });

  const categories = await Promise.all<Promise<Category>[]>(promisesToRun);

  return categories.filter((category) => category.products.length > 0);
};
