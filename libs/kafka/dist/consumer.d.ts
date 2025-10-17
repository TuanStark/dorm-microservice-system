import { OnModuleDestroy } from '@nestjs/common';
import { EachMessagePayload, Consumer } from 'kafkajs';
import { KafkaService } from './kafka.service';
export declare class KafkaConsumer implements OnModuleDestroy {
    private readonly kafkaService;
    private readonly logger;
    private consumers;
    private opts;
    constructor(kafkaService: KafkaService, opts: any);
    createConsumer(groupId: string): Promise<Consumer>;
    runConsumer(consumer: Consumer, topic: string, handler: (payload: EachMessagePayload) => Promise<void>, opts?: {
        fromBeginning?: boolean;
    }): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
