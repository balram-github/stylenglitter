import { Category } from "../categories/categories.types";

export interface ProductAmount {
  id: number;
  price: string;
  basePrice: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  slug: string;
  qty: number;
  description: string;
  amountId: number;
  amount: ProductAmount;
  categoryId: number;
  category?: Category;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  material?: string;
  weight?: string;
}

export interface GetProductBySlugResponse {
  success: boolean;
  data: Product;
}

export interface GetProductByIdResponse {
  success: boolean;
  data: Product;
}

export enum ProductSortBy {
  PRICE_HIGH_TO_LOW = "price_high_to_low",
  PRICE_LOW_TO_HIGH = "price_low_to_high",
  DATE_ADDED_DESC = "date_added_desc",
  DATE_ADDED_ASC = "date_added_asc",
}

export enum ProductAvailability {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
  ALL = "all",
}

export interface ProductFilters {
  availability: ProductAvailability;
  minPrice: number | undefined;
  maxPrice: number | undefined;
}
