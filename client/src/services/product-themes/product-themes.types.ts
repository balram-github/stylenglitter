import {
  Product,
  ProductAvailability,
  ProductSortBy,
} from "../products/products.types";

export interface ProductTheme {
  id: number;
  name: string;
  slug: string;
  coverImgUrl: string;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
}

export interface GetProductThemesResponse {
  success: boolean;
  data: ProductTheme[];
}

export interface GetProductThemeBySlugResponse {
  success: boolean;
  data: ProductTheme;
}

export interface GetProductsOfProductThemeResponse {
  success: boolean;
  data: {
    hasNext: boolean;
    products: Product[];
  };
}

export interface GetProductsOfProductThemeParams {
  page: number;
  limit: number;
  sortBy: ProductSortBy;
  availability?: ProductAvailability;
  minPrice?: number;
  maxPrice?: number;
}
