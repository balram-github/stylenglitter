import { TypeOfPayment } from '@/modules/order/types/payment-method';
import { Product } from '@/modules/product/entities/product.entity';

export interface GetCartPurchaseChargesPayload {
  products: { product: Product; qty: number }[];
  paymentMethod: TypeOfPayment;
  autoApplyApplicableDiscounts?: boolean;
}
