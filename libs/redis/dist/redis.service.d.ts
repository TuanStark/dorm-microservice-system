import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';
export declare class RedisService implements OnModuleDestroy {
    private readonly client;
    constructor(client: Redis);
    private redlock;
    get(key: string): Promise<any>;
    set(key: string, value: any, ttlSec?: number): Promise<"OK">;
    del(key: string): Promise<number>;
    acquireLock(resource: string, ttl?: number): Promise<any>;
    releaseLock(lock: Redlock.Lock): Promise<any>;
    onModuleDestroy(): Promise<void>;
}
