import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';
export type EventEnvelope = {
    eventId: string;
    eventName: string;
    occurredAt: string;
    source: string;
    payload: any;
    meta?: Record<string, any>;
};
export declare class KafkaProducer implements OnModuleInit, OnModuleDestroy {
    private readonly kafkaService;
    private readonly logger;
    private producer;
    private source;
    private opts;
    constructor(kafkaService: KafkaService, opts: any);
    onModuleInit(): Promise<void>;
    send(topic: string, eventName: string, payload: any, key?: string): Promise<EventEnvelope | undefined>;
    onModuleDestroy(): Promise<void>;
}
