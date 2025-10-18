import { Module } from '@nestjs/common';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { KafkaModule } from './messaging/kafka/kafka.module';
import { RabbitMQModule } from './messaging/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BookingsModule,
    KafkaModule,
    RabbitMQModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
