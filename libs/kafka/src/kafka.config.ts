import { KafkaModuleOptions } from './interfaces/kafka-options.interface';

export const defaultKafkaOptions: KafkaModuleOptions = {
  brokers: (process.env.KAFKA_BROKERS || 'kafka:9092').split(','),
  clientId: process.env.KAFKA_CLIENT_ID || undefined,
  serviceName: process.env.SERVICE_NAME || undefined,
  connectionTimeout: Number(process.env.KAFKA_CONN_TIMEOUT || 3000),
  kafkaJSConfig: {}
};
