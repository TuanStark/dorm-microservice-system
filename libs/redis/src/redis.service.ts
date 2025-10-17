import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';


@Injectable()
export class RedisService implements OnModuleDestroy {
    constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {
        this.redlock = new Redlock([this.client], {
            driftFactor: 0.01,
            retryCount: 3,
            retryDelay: 200,
        });
    }


    private redlock: Redlock;


    async get(key: string) {
        const r = await this.client.get(key);
        return r ? JSON.parse(r) : null;
    }


    async set(key: string, value: any, ttlSec?: number) {
        const payload = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttlSec) {
            return this.client.set(key, payload, 'EX', ttlSec);
        }
        return this.client.set(key, payload);
    }


    async del(key: string) {
        return this.client.del(key);
    }


    // Simple lock using Redlock
    async acquireLock(resource: string, ttl = 10000) {
        return this.redlock.acquire([resource], ttl);
    }


    async releaseLock(lock: Redlock.Lock) {
        return lock.release();
    }


    async onModuleDestroy() {
        await this.client.quit();
    }
}