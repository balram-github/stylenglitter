import { CronExpression } from '@nestjs/schedule';

export const Jobs = {
  REMOVED_EXPIRED_TOKENS: {
    cronTime: CronExpression.EVERY_DAY_AT_MIDNIGHT,
    name: 'removeExpiredTokens',
  },
};
