import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3007);

  logger.log(`✅ Notification Service is running on port ${process.env.PORT ?? 3007}`);
}
bootstrap();
