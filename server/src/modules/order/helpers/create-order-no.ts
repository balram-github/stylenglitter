export const createOrderNo = async () => {
  const { customAlphabet } = await import('nanoid');
  return customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)();
};
