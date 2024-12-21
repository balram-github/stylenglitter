import { request } from "@/lib/request";
import {
  Category,
  GetCategoriesResponse,
  GetCategoryBySlugResponse,
  GetProductsOfCategoryParams,
  GetProductsOfCategoryResponse,
} from "./categories.types";
import { ProductSortBy } from "../products/products.types";

export const getProductsOfCategory = async (
  slug: string,
  params: GetProductsOfCategoryParams
) => {
  const {
    data: { data },
  } = await request.get<GetProductsOfCategoryResponse>(
    `/categories/${slug}/products`,
    {
      params,
    }
  );

  return data;
};

export const getCategoryBySlug = async (slug: string) => {
  const {
    data: { data },
  } = await request.get<GetCategoryBySlugResponse>(`/categories/${slug}`);
  return data;
};

export const getCategories = async ({
  withProducts = false,
}: {
  withProducts?: boolean;
}) => {
  const {
    data: { data },
  } = await request.get<GetCategoriesResponse>("/categories");

  if (!withProducts) {
    return data;
  }

  const promisesToRun = data.map(async (category) => {
    const { products } = await getProductsOfCategory(category.slug, {
      page: 1,
      limit: 5,
      sortBy: ProductSortBy.DATE_ADDED_DESC,
    });

    return {
      ...category,
      products,
    };
  });

  const categories = await Promise.all<Promise<Category>[]>(promisesToRun);

  return categories.filter((category) => category.products.length > 0);
};
