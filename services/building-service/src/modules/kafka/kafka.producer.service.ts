import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopics } from './kafka-topics.enum';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    try {
      Object.values(KafkaTopics).forEach((topic) =>
        this.kafkaClient.subscribeToResponseOf(topic),
      );
      await this.kafkaClient.connect();
    } catch (error) {
      console.warn('⚠️ Kafka not available, skipping producer setup:', error.message);
    }
  }

  // Building events
  async emitBuildingCreatedEvent(payload: any) {
    await this.kafkaClient.emit(KafkaTopics.BUILDING_CREATED, payload);
  }

  async emitBuildingUpdatedEvent(payload: any) {
    await this.kafkaClient.emit(KafkaTopics.BUILDING_UPDATED, payload);
  }

  async emitBuildingDeletedEvent(payload: any) {
    await this.kafkaClient.emit(KafkaTopics.BUILDING_DELETED, payload);
  }
}
