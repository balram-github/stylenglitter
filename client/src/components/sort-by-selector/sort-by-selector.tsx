import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSortBy } from "@/services/products/products.types";

interface SortBySelectorProps {
  sortBy: ProductSortBy;
  onChange: (sortBy: ProductSortBy) => void;
}

export const SortBySelector = ({ sortBy, onChange }: SortBySelectorProps) => {
  return (
    <Select value={sortBy} onValueChange={onChange}>
      <SelectTrigger className="border-0 w-auto focus:ring-offset-0 focus:ring-0">
        <SelectValue placeholder="Select sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ProductSortBy.DATE_ADDED_DESC}>
          Date added (desc)
        </SelectItem>
        <SelectItem value={ProductSortBy.DATE_ADDED_ASC}>
          Date added (asc)
        </SelectItem>
        <SelectItem value={ProductSortBy.PRICE_LOW_TO_HIGH}>
          Price (low to high)
        </SelectItem>
        <SelectItem value={ProductSortBy.PRICE_HIGH_TO_LOW}>
          Price (high to low)
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
