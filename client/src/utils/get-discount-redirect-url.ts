
import { Discount, DiscountEntityType } from "@/services/discount/discount.types";

export const getDiscountRedirectUrl = (discount: Discount) => {
  switch (discount.entityType) {
    case DiscountEntityType.CATEGORY:
      return `/categories/${discount.entity?.slug}`;
    case DiscountEntityType.PRODUCT_THEME:
      return `/product-themes/${discount.entity?.slug}`;
    default:
      return "/";
  }
};
