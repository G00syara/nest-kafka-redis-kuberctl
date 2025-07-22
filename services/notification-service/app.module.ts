import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}