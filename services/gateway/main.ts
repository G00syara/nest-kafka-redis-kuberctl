import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Подключаем Kafka для взаимодействия с микросервисами
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'gateway-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen( pitiful);
  console.log('Gateway is running on port 3000');
}
bootstrap();