import { FilterIcon } from "lucide-react";
import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { DualRangeSlider } from "../ui/range-slider";
import {
  ProductAvailability,
  ProductFilters,
} from "@/services/products/products.types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface ProductFilterSheetProps {
  onApply: (filters: ProductFilters) => void;
  filters: ProductFilters;
}

export const ProductFilterSheet = ({
  onApply,
  filters,
}: ProductFilterSheetProps) => {
  const [values, setValues] = useState([
    filters.minPrice ?? 1,
    filters.maxPrice ?? 1000,
  ]);

  // Debounced function to apply price filters
  const debouncedApplyPriceFilters = useCallback(
    debounce((newValues: number[]) => {
      onApply({
        ...filters,
        minPrice: newValues[0],
        maxPrice: newValues[1],
      });
    }, 500),
    [filters, onApply]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 uppercase rounded-none font-bold" size="sm">
          <FilterIcon /> Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="md:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="border-b pb-4">
            <h3 className="font-bold mb-4">Availability</h3>

            <RadioGroup
              value={filters.availability}
              onValueChange={(value) => {
                onApply({
                  ...filters,
                  availability: value as ProductAvailability,
                });
              }}
            >
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  id="in-stock"
                  value={ProductAvailability.IN_STOCK}
                />
                <Label htmlFor="in-stock">In stock</Label>
              </div>
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  id="out-of-stock"
                  value={ProductAvailability.OUT_OF_STOCK}
                />
                <Label htmlFor="out-of-stock">Out of stock</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="pb-4">
            <h3 className="font-bold mb-10">Price (Rs.)</h3>

            <DualRangeSlider
              label={(value) => <div className="text-sm w-full">{value}</div>}
              value={values}
              onValueChange={(newValues) => {
                setValues(newValues);
                debouncedApplyPriceFilters(newValues);
              }}
              min={1}
              max={1000}
              step={1}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
