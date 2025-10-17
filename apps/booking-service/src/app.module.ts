import { forwardRef, Module } from '@nestjs/common';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { KafkaModule } from './modules/kafka/kafka.module';
import { KafkaModule as BookingKafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [
    forwardRef(() => BookingKafkaModule),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    forwardRef(() => BookingsModule),
    KafkaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
