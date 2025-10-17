import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import type { KafkaModuleOptions } from './interfaces/kafka-options.interface';
import { KAFKA_MODULE_OPTIONS } from './constants/kafka.constants';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private opts: KafkaModuleOptions;

  constructor(@Inject(KAFKA_MODULE_OPTIONS) opts: KafkaModuleOptions) {
    this.opts = opts;
    this.kafka = new Kafka({
      clientId: opts.clientId || opts.serviceName || 'unknown-service',
      brokers: opts.brokers,
      ...(opts.kafkaJSConfig || {}),
    });
  }

  getClient(): Kafka {
    return this.kafka;
  }

  async onModuleDestroy() {
    // nothing here; producer/consumer disconnect themselves
  }
}
