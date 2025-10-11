import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaService } from './prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailWatcherModule } from './email-watcher/email-watcher.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
  ScheduleModule.forRoot(),
  PrismaModule,
  PaymentsModule,
  KafkaModule,
  EmailWatcherModule,
],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
