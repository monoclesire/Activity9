import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  async checkout(@Body() body: { userId: number; fullName: string; email: string }) {
    const userData = {
      fullName: body.fullName,
      email: body.email
    };
    
    return this.orderService.checkout(body.userId, userData);
  }

  @Get('user/:userId')
  async getOrders(@Param('userId') userId: string) {
    return this.orderService.findAll(+userId);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus
  ) {
    return this.orderService.updateStatus(+id, status);
  }
}