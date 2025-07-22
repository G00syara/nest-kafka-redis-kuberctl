import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('sendNotification')
  async sendNotification(notificationData: { userId: string; message: string }): Promise<string> {
    return this.notificationService.sendNotification(notificationData);
  }
}