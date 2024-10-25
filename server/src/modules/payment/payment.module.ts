import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'RAZORPAY_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const Razorpay = await import('razorpay');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new Razorpay({
          key_id: configService.get<string>('payment.razorPayKeyId')!,
          key_secret: configService.get<string>('payment.razorPaySecretKey')!,
        });
      },
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
