import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { AdminGuard } from '@/guards/admin.guard';
import { CreateDiscountDto } from './dtos/create-discount.dto';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Post('/')
  @UseGuards(AdminGuard)
  async createDiscount(@Body() body: CreateDiscountDto) {
    return this.discountService.create(body);
  }
}
