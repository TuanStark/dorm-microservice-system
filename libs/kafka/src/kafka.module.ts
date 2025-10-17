import { DynamicModule, Global, Module } from '@nestjs/common';
import type { KafkaModuleOptions } from './interfaces/kafka-options.interface';
import { KafkaService } from './kafka.service';
import { KafkaConsumer } from './consumer';
import { KAFKA_MODULE_OPTIONS } from './constants/kafka.constants';
import { KafkaProducer } from './producer';

@Global()
@Module({})
export class KafkaModule {
  static forRoot(options: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        { provide: KAFKA_MODULE_OPTIONS, useValue: options },
        KafkaService,
        KafkaProducer,
        KafkaConsumer,
      ],
      exports: [KafkaService, KafkaProducer, KafkaConsumer],
    };
  }
}
