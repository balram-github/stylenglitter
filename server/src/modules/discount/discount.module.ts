import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { Discount } from './entities/discount.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
