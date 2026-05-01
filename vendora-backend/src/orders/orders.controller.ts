import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { OrdersService, CreateOrderDto } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ActiveUser } from '../auth/interfaces/active-user.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@GetUser() user: ActiveUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.userId, dto);
  }

  @Get('my-orders')
  async getMyOrders(@GetUser() user: ActiveUser) {
    return this.ordersService.findMyOrders(user.userId);
  }

  @Get('store-orders')
  async getStoreOrders(@Headers('x-store-id') storeId: string) {
    return this.ordersService.findStoreOrders(storeId);
  }
}
