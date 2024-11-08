import { customAlphabet } from 'nanoid';

export const createOrderNo = () => {
  return customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)();
};
