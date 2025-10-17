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
var KafkaConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumer = void 0;
const common_1 = require("@nestjs/common");
const kafka_service_1 = require("./kafka.service");
const kafka_constants_1 = require("./constants/kafka.constants");
let KafkaConsumer = KafkaConsumer_1 = class KafkaConsumer {
    kafkaService;
    logger = new common_1.Logger(KafkaConsumer_1.name);
    consumers = [];
    opts;
    constructor(kafkaService, opts) {
        this.kafkaService = kafkaService;
        this.opts = opts;
    }
    async createConsumer(groupId) {
        const consumer = this.kafkaService.getClient().consumer({ groupId });
        await consumer.connect();
        this.consumers.push(consumer);
        this.logger.log(`Kafka consumer created for group ${groupId}`);
        return consumer;
    }
    async runConsumer(consumer, topic, handler, opts) {
        await consumer.subscribe({ topic, fromBeginning: opts?.fromBeginning ?? false });
        await consumer.run({
            eachMessage: async (payload) => {
                try {
                    await handler(payload);
                }
                catch (err) {
                    this.logger.error(`Error processing message on ${topic}: ${err?.message || err}`);
                    throw err;
                }
            },
        });
        this.logger.log(`Consumer running for topic ${topic}`);
    }
    async onModuleDestroy() {
        await Promise.all(this.consumers.map((c) => c.disconnect()));
        this.logger.log('All Kafka consumers disconnected');
    }
};
exports.KafkaConsumer = KafkaConsumer;
exports.KafkaConsumer = KafkaConsumer = KafkaConsumer_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(kafka_constants_1.KAFKA_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [kafka_service_1.KafkaService, Object])
], KafkaConsumer);
//# sourceMappingURL=consumer.js.map