import { Injectable } from '@nestjs/common';
import { RedisService } from '@nestjs-modules/ioredis';

@Injectable()
export class NotificationService {
  constructor(private redisService: RedisService) {}

  async sendNotification(notificationData: { userId: string; message: string }): Promise<string> {
    // Здесь можно добавить логику отправки уведомлений (например, email или push)
    const notificationId = `notification:${notificationData.userId}:${Date.now()}`;
    await this.redisService.getClient().set(notificationId, JSON.stringify(notificationData));
    return `Notification sent for user ${notificationData.userId}`;
  }
}