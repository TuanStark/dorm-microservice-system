import { KafkaConfig } from 'kafkajs';

export interface KafkaModuleOptions {
  brokers: string[];
  clientId?: string;            // recommended: unique per service
  serviceName?: string;         // used for envelope.source if provided
  connectionTimeout?: number;
  kafkaJSConfig?: Partial<KafkaConfig>;
}
