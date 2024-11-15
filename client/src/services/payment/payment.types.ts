export interface VerifyPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: boolean;
}

export enum PaymentStatus {
  INITIATED = "initiated",
  FAILED = "failed",
  SUCCESSFUL = "successful",
  REFUND_INITIATED = "refund-initiated",
  REFUND_COMPLETE = "refund-complete",
  REFUND_FAILED = "refund-failed",
}

export interface Payment {
  id: number;
  amount: string;
  status: PaymentStatus;
  referenceNo: string;
  createdAt: string;
  updatedAt: string;
}
