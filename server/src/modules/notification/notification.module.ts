import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [OrderModule, UserModule],
  providers: [NotificationService],
})
export class NotificationModule {}
