import { OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import type { KafkaModuleOptions } from './interfaces/kafka-options.interface';
export declare class KafkaService implements OnModuleDestroy {
    private kafka;
    private opts;
    constructor(opts: KafkaModuleOptions);
    getClient(): Kafka;
    onModuleDestroy(): Promise<void>;
}
