import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { RedisService } from '@nestjs-modules/ioredis';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private redisService: RedisService,
  ) {}

  async createOrder(orderData: { userId: string; productId: string }): Promise<Order> {
    const order = this.orderRepository.create({ ...orderData, status: 'pending' });
    await this.orderRepository.save(order);
    await this.redisService.getClient().set(`order:${order.id}`, JSON.stringify(order));
    return order;
  }

  async getOrder(id: string): Promise<Order> {
    const cachedOrder = await this.redisService.getClient().get(`order:${id}`);
    if (cachedOrder) {
      return JSON.parse(cachedOrder);
    }
    const order = await this.orderRepository.findOne({ where: { id } });
    if (order) {
      await this.redisService.getClient().set(`order:${id}`, JSON.stringify(order));
    }
    return order;
  }
}