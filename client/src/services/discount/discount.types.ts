export interface Discount {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: DiscountType;
  entityType: DiscountEntityType;
  entityId: number;
  entity?: {
    slug: string;
  };
  minQty: number;
  flatPrice: number;
  percentage: number;
}

export enum DiscountEntityType {
  CATEGORY = "category",
  PRODUCT_THEME = "product-theme",
}

export enum DiscountType {
  FLAT_PRICE = "flat_price",
  PERCENTAGE = "percentage",
}

export interface GetDiscountsResponse {
  data: Discount[];
}
