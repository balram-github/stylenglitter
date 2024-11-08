import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../payment/payment.module';
import { ShippingAddress } from './entities/shipping-address.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forFeature([Order, OrderItem, ShippingAddress]),
    CartModule,
    PaymentModule,
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
