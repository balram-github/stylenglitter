import { Product } from "@/services/products/products.types";

export interface ProductListProps {
  data: Product[];
  hasNext: boolean;
  loading: boolean;
  loadData: () => void;
}
