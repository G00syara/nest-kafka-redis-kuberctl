import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientKafka,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientKafka,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientKafka,
  ) {}

  async onModuleInit() {
    ['createUser', 'getUser', 'createOrder', 'getOrder', 'createProduct', 'getProduct', 'sendNotification'].forEach(
      (key) => {
        this.userClient.subscribeToResponseOf(key);
        this.orderClient.subscribeToResponseOf(key);
        this.productClient.subscribeToResponseOf(key);
        this.notificationClient.subscribeToResponseOf(key);
      },
    );
    await Promise.all([
      this.userClient.connect(),
      this.orderClient.connect(),
      this.productClient.connect(),
      this.notificationClient.connect(),
    ]);
  }

  @Post('users')
  createUser(@Body() userData: { name: string; email: string }) {
    return this.userClient.send('createUser', userData);
  }

  @Get('users/:id')
  getUser(@Body() id: string) {
    return this.userClient.send('getUser', id);
  }

  @Post('orders')
  createOrder(@Body() orderData: { userId: string; productId: string }) {
    return this.orderClient.send('createOrder', orderData);
  }

  @Post('products')
  createProduct(@Body() productData: { name: string; price: number }) {
    return this.productClient.send('createProduct', productData);
  }

  @Post('notifications')
  sendNotification(@Body() notificationData: { userId: string; message: string }) {
    return this.notificationClient.send('sendNotification', notificationData);
  }
}