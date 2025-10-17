"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const redlock_1 = __importDefault(require("redlock"));
let RedisService = class RedisService {
    client;
    constructor(client) {
        this.client = client;
        this.redlock = new redlock_1.default([this.client], {
            driftFactor: 0.01,
            retryCount: 3,
            retryDelay: 200,
        });
    }
    redlock;
    async get(key) {
        const r = await this.client.get(key);
        return r ? JSON.parse(r) : null;
    }
    async set(key, value, ttlSec) {
        const payload = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttlSec) {
            return this.client.set(key, payload, 'EX', ttlSec);
        }
        return this.client.set(key, payload);
    }
    async del(key) {
        return this.client.del(key);
    }
    async acquireLock(resource, ttl = 10000) {
        return this.redlock.acquire([resource], ttl);
    }
    async releaseLock(lock) {
        return lock.release();
    }
    async onModuleDestroy() {
        await this.client.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisService);
//# sourceMappingURL=redis.service.js.map