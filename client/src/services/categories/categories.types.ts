import { Product } from "../products/products.types";

export interface Category {
  id: number;
  name: string;
  slug: string;
  coverImgUrl: string;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
}

export interface GetCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface GetProductsOfCategoryResponse {
  success: boolean;
  data: {
    hasNext: boolean;
    products: Product[];
  };
}
