import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@guards/auth.guard';
import { Auth } from '@decorators/auth';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  /**
   * Create order from user's cart
   */
  @UseGuards(AuthGuard)
  @Post()
  createOrder(@Body() body: CreateOrderDto, @Auth() auth) {
    return this.orderService.createOrder(
      auth.userId,
      body.shippingAddress,
      body.paymentMethod,
    );
  }

  /**
   * Update order status
   */
  @Patch('/:orderId/status')
  updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus({ id: orderId }, body.status);
  }

  /**
   * Get order by orderNo
   */
  @UseGuards(AuthGuard)
  @Get('/:orderNo')
  async getOrder(@Param('orderNo') orderNo: string, @Auth() auth) {
    const order = await this.orderService.getOrder({ orderNo }, auth.userId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Get user orders
   */
  @UseGuards(AuthGuard)
  @Get('/')
  async getOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Auth() auth,
  ) {
    const response = await this.orderService.getUserOrders(
      auth.userId,
      page,
      limit,
    );

    return response;
  }
}
