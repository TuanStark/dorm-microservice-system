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
var KafkaProducer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const kafka_service_1 = require("./kafka.service");
const kafka_constants_1 = require("./constants/kafka.constants");
let KafkaProducer = KafkaProducer_1 = class KafkaProducer {
    kafkaService;
    logger = new common_1.Logger(KafkaProducer_1.name);
    producer;
    source;
    opts;
    constructor(kafkaService, opts) {
        this.kafkaService = kafkaService;
        this.producer = this.kafkaService.getClient().producer();
        this.source = opts.serviceName || opts.clientId || process.env.SERVICE_NAME || 'unknown-service';
        this.opts = opts;
    }
    async onModuleInit() {
        await this.producer.connect();
        this.logger.log('Kafka producer connected');
    }
    async send(topic, eventName, payload, key) {
        const envelope = {
            eventId: (0, uuid_1.v4)(),
            eventName,
            occurredAt: new Date().toISOString(),
            source: this.source,
            payload,
        };
        const message = { key: key || envelope.eventId, value: JSON.stringify(envelope) };
        const maxAttempts = 3;
        let attempt = 0;
        while (attempt < maxAttempts) {
            try {
                await this.producer.send({ topic, messages: [message] });
                this.logger.debug(`Sent ${eventName} -> ${topic}`);
                return envelope;
            }
            catch (err) {
                attempt++;
                this.logger.warn(`Kafka send attempt ${attempt} failed for ${topic}: ${err?.message || err}`);
                if (attempt >= maxAttempts)
                    throw err;
                await new Promise((r) => setTimeout(r, 500 * attempt));
            }
        }
    }
    async onModuleDestroy() {
        try {
            await this.producer.disconnect();
            this.logger.log('Kafka producer disconnected');
        }
        catch (err) {
            this.logger.error('Error disconnecting Kafka producer', err);
        }
    }
};
exports.KafkaProducer = KafkaProducer;
exports.KafkaProducer = KafkaProducer = KafkaProducer_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(kafka_constants_1.KAFKA_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [kafka_service_1.KafkaService, Object])
], KafkaProducer);
//# sourceMappingURL=producer.js.map