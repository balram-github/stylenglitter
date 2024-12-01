import { CronExpression } from '@nestjs/schedule';

export const Jobs = {
  REMOVED_EXPIRED_TOKENS: {
    cronTime: CronExpression.EVERY_DAY_AT_MIDNIGHT,
    name: 'removeExpiredTokens',
  },
  SET_PAYMENT_PENDING_ORDERS_TO_PAYMENT_FAILED: {
    cronTime: CronExpression.EVERY_HOUR,
    name: 'setPaymentPendingOrdersToPaymentFailed',
  },
};
