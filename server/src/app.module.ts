import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate as validateEnvs } from '@config/envs/env.validation';
import configuration from '@config/envs/configuration';
import { Environment } from './config/envs/types';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from '@modules/health/health.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TokenModule } from '@modules/token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvs,
      load: [configuration],
      cache: true,
    }),
    JwtModule.register({
      global: true,
    }),
    MulterModule.register({
      storage: multer.memoryStorage(), // Use in-memory storage
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.dbName'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('database.dbSync'),
        logging:
          configService.get<Environment>('nodeEnv') !== Environment.Production,
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: seconds(1),
        limit: 3,
      },
      {
        name: 'medium',
        ttl: seconds(10),
        limit: 20,
      },
      {
        name: 'long',
        ttl: seconds(60),
        limit: 100,
      },
    ]),
    EventEmitterModule.forRoot({ global: true }),
    HealthModule,
    UserModule,
    AuthModule,
    TokenModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    CartModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
