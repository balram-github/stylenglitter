export const createPaymentReferenceNo = async () => {
  const { customAlphabet } = await import('nanoid');
  return customAlphabet('0123456789', 20)();
};
