import { request } from "@/lib/request";
import { VerifyPaymentPayload, VerifyPaymentResponse } from "./payment.types";

export const verifyPayment = async (payload: VerifyPaymentPayload) => {
  const {
    data: { data },
  } = await request.post<VerifyPaymentResponse>("/payments/verify", payload);

  return data;
};
