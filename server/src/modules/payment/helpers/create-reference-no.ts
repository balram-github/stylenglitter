import { customAlphabet } from 'nanoid';

export const createPaymentReferenceNo = () => {
  return customAlphabet('0123456789', 20)();
};
