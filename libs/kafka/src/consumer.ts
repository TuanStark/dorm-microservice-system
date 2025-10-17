import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EachMessagePayload, Consumer } from 'kafkajs';
import { KafkaService } from './kafka.service';
import { KAFKA_MODULE_OPTIONS } from './constants/kafka.constants';

@Injectable()
export class KafkaConsumer implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumer.name);
  private consumers: Consumer[] = [];
  private opts: any;

  constructor(private readonly kafkaService: KafkaService, @Inject(KAFKA_MODULE_OPTIONS) opts: any) {
    this.opts = opts;
  }

  async createConsumer(groupId: string): Promise<Consumer> {
    const consumer = this.kafkaService.getClient().consumer({ groupId });
    await consumer.connect();
    this.consumers.push(consumer);
    this.logger.log(`Kafka consumer created for group ${groupId}`);
    return consumer;
  }

  async runConsumer(consumer: Consumer, topic: string, handler: (payload: EachMessagePayload) => Promise<void>, opts?: { fromBeginning?: boolean }) {
    await consumer.subscribe({ topic, fromBeginning: opts?.fromBeginning ?? false });
    await consumer.run({
      eachMessage: async (payload) => {
        try {
          await handler(payload);
        } catch (err) {
          this.logger.error(`Error processing message on ${topic}: ${err?.message || err}`);
          // rethrow so kafka-js can handle offset behavior; handler can push to DLQ if needed
          throw err;
        }
      },
    });
    this.logger.log(`Consumer running for topic ${topic}`);
  }

  async onModuleDestroy() {
    await Promise.all(this.consumers.map((c) => c.disconnect()));
    this.logger.log('All Kafka consumers disconnected');
  }
}
