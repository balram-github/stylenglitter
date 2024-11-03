import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@modules/user/user.module';
import { TokenModule } from '@modules/token/token.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UserModule, TokenModule, NotificationModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
