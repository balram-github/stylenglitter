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
  pendingAmount: string;
  status: PaymentStatus;
  referenceNo: string;
  createdAt: string;
  updatedAt: string;
}
