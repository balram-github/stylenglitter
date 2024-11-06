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
}

export interface GetProductBySlugResponse {
  success: boolean;
  data: Product;
}

export interface GetProductByIdResponse {
  success: boolean;
  data: Product;
}
