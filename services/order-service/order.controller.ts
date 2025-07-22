import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('createOrder')
  async createOrder(orderData: { userId: string; productId: string }): Promise<Order> {
    return this.orderService.createOrder(orderData);
  }

  @MessagePattern('getOrder')
  async getOrder(id: string): Promise<Order> {
    return this.orderService.getOrder(id);
  }
}