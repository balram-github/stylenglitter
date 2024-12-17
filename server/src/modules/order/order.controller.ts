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
import { AdminGuard } from '@/guards/admin.guard';
import { GetOrderListDto } from './dtos/get-order-list.dto';
import { JwtGuard } from '@/guards/jwt.guard';
import { FindOptionsWhere } from 'typeorm';
import { Order } from './entities/order.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  /**
   * Get order list with filters
   */
  @UseGuards(AdminGuard)
  @Get('/list')
  async getOrderList(@Query() query: GetOrderListDto) {
    const response = await this.orderService.getOrderList(query);

    return response;
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

  /**
   * Get order by orderNo
   */
  @UseGuards(JwtGuard)
  @Get('/:orderNo')
  async getOrder(
    @Param('orderNo') orderNo: string,
    @Auth() auth,
    @Query('email') email?: string,
    @Query('phone_number') phoneNumber?: string,
  ) {
    let order;

    if (auth.isAdmin) {
      order = await this.orderService.getOrder({ orderNo });
    } else {
      const filterExpression: FindOptionsWhere<Order> = { orderNo };

      if (auth) {
        filterExpression.userId = auth.userId;
      } else if (email) {
        filterExpression.shippingAddress = { email };
      } else if (phoneNumber) {
        filterExpression.shippingAddress = { phoneNumber };
      }

      order = await this.orderService.getOrder(filterExpression);
    }

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Create order
   */
  @Post()
  @UseGuards(JwtGuard)
  createOrder(@Body() body: CreateOrderDto, @Auth() auth) {
    return this.orderService.createOrder(
      body.shippingAddress,
      body.paymentMethod,
      body.productsToPurchase,
      auth?.userId,
    );
  }

  /**
   * Update order status
   */
  @UseGuards(AdminGuard)
  @Patch('/:orderId/status')
  updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(
      { id: orderId },
      body.status,
      body.trackingNumber,
    );
  }
}
