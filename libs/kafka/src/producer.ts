import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import { KafkaService } from './kafka.service';
import { KAFKA_MODULE_OPTIONS } from './constants/kafka.constants';

export type EventEnvelope = {
  eventId: string;
  eventName: string;
  occurredAt: string;
  source: string;
  payload: any;
  meta?: Record<string, any>;
};

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducer.name);
  private producer: Producer;
  private source: string;
  private opts: any;

  constructor(private readonly kafkaService: KafkaService, @Inject(KAFKA_MODULE_OPTIONS) opts: any) {
    this.producer = this.kafkaService.getClient().producer();
    this.source = opts.serviceName || opts.clientId || process.env.SERVICE_NAME || 'unknown-service';
    this.opts = opts;
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async send(topic: string, eventName: string, payload: any, key?: string) {
    const envelope: EventEnvelope = {
      eventId: uuidv4(),
      eventName,
      occurredAt: new Date().toISOString(),
      source: this.source,
      payload,
    };

    const message = { key: key || envelope.eventId, value: JSON.stringify(envelope) };

    const maxAttempts = 3;
    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        await this.producer.send({ topic, messages: [message] });
        this.logger.debug(`Sent ${eventName} -> ${topic}`);
        return envelope;
      } catch (err) {
        attempt++;
        this.logger.warn(`Kafka send attempt ${attempt} failed for ${topic}: ${err?.message || err}`);
        if (attempt >= maxAttempts) throw err;
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected');
    } catch (err) {
      this.logger.error('Error disconnecting Kafka producer', err);
    }
  }
}
