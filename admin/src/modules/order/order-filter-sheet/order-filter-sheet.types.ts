import { Filters } from "../orders-table/orders-table.types";

export interface OrderFilterSheetProps {
  applyFilters: (filters: Filters) => void;
  appliedFiters: Filters;
  resetFilters: () => void;
  onClose: () => void;
}
