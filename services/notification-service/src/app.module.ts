import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log('🚀 Notification Service starting up...');
    this.logger.log('📧 Email notifications: ENABLED');
    this.logger.log('🔔 WebSocket notifications: ENABLED');
    this.logger.log('💾 Database: PostgreSQL with Prisma');
    this.logger.log('📨 Message brokers: RabbitMQ + Kafka');
    this.logger.log('✅ Notification Service initialized successfully!');
  }
}
