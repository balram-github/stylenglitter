import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@guards/auth-guard';
import { Auth } from '@decorators/auth';
import { CreateOrderDto } from './dtos/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  /**
   * Create order from user's cart
   */
  @UseGuards(AuthGuard)
  @Post()
  async createOrder(@Body() body: CreateOrderDto, @Auth() auth) {
    await this.orderService.createOrder(auth.userId, body.addressId);
  }

  /**
   * Get order by orderId
   */
  @UseGuards(AuthGuard)
  @Get('/:orderId')
  async getOrder(@Param('orderId') orderId: number, @Auth() auth) {
    const order = await this.orderService.getOrder(orderId, auth.userId);

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
    const orders = await this.orderService.getUserOrders(
      auth.userId,
      page,
      limit,
    );

    return orders;
  }
}
