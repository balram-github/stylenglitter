export enum TypeOfPayment {
  PREPAID = "prepaid",
  COD = "cod"
}

export interface ShippingAddressPayload {
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  phoneNumber: string;
}

export interface CreateOrderPayload {
  paymentMethod: TypeOfPayment;
  shippingAddress: ShippingAddressPayload;
}

export interface PaymentGatewayResponse {
  amount: number;
  currency: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    paymentGatewayResponse: PaymentGatewayResponse;
    orderNo: string;
  };
}
