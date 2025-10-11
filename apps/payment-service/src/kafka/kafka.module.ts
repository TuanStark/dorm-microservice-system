import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaConsumerService } from './kafka.consumer.service';
import { ConfigService } from '@nestjs/config';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    forwardRef(() => PaymentsModule),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'payment-service',
              brokers: configService.get<string>('KAFKA_BROKER')?.split(',') || ['localhost:9092'],
            },
            consumer: {
              groupId: 'payment-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
