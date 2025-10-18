import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';
import { ConfigService } from '@nestjs/config';
import { BuildingsModule } from '../buildings/buildings.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    BuildingsModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'building-service',
              brokers: configService.get<string>('KAFKA_BROKER')?.split(',') || ['localhost:9092'],
            },
            consumer: {
              groupId: 'building-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
