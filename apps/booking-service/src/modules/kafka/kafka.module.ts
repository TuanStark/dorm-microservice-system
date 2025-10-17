import { Module, forwardRef } from '@nestjs/common';
import { KafkaModule as SharedKafkaModule } from '@libs/kafka';
import { BookingKafkaService } from './booking-kafka.service';
import { BookingsModule } from '../bookings/bookings.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => BookingsModule),
    PrismaModule,
    SharedKafkaModule.forRoot({
      brokers: (process.env.KAFKA_BROKER || 'localhost:9092').split(','),
      clientId: process.env.KAFKA_CLIENT_ID || 'booking-service',
      serviceName: 'booking-service',
    }),
  ],
  providers: [BookingKafkaService],
  exports: [BookingKafkaService],
})
export class KafkaModule {}
