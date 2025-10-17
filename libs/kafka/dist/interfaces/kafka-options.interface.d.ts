import { KafkaConfig } from 'kafkajs';
export interface KafkaModuleOptions {
    brokers: string[];
    clientId?: string;
    serviceName?: string;
    connectionTimeout?: number;
    kafkaJSConfig?: Partial<KafkaConfig>;
}
