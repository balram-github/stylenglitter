import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filters, FilterSchema } from "../orders-table/orders-table.types";
import { OrderFilterSheetProps } from "./order-filter-sheet.types";
import { OrderStatus } from "@/services/order/order.types";

const OrderFilterSheet = ({
  applyFilters,
  appliedFiters,
  onClose,
  resetFilters,
}: OrderFilterSheetProps) => {
  const form = useForm<Filters>({
    resolver: zodResolver(FilterSchema),
    defaultValues: appliedFiters,
  });

  const onSubmit = (data: Filters) => {
    applyFilters(data);
  };

  const onReset = () => {
    form.reset();
    resetFilters();
  };

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="left" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Apply Filters</SheetTitle>
        </SheetHeader>
        <div className="my-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="orderNo" className="text-sm font-medium">
                  Order Number
                </label>
                <Input
                  {...form.register("orderNo")}
                  placeholder="Search by order number"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Order Status
                </label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("status", value === "ALL" ? null : (value as OrderStatus))
                  }
                  value={form.watch("status") || "ALL"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {Object.values(OrderStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, " ").toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4 justify-center pt-4">
                <Button type="button" variant="ghost" onClick={onReset}>
                  Reset
                </Button>
                <Button type="submit">Apply Filters</Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(OrderFilterSheet);
