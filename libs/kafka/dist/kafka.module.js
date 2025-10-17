"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KafkaModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaModule = void 0;
const common_1 = require("@nestjs/common");
const kafka_service_1 = require("./kafka.service");
const consumer_1 = require("./consumer");
const kafka_constants_1 = require("./constants/kafka.constants");
const producer_1 = require("./producer");
let KafkaModule = KafkaModule_1 = class KafkaModule {
    static forRoot(options) {
        return {
            module: KafkaModule_1,
            providers: [
                { provide: kafka_constants_1.KAFKA_MODULE_OPTIONS, useValue: options },
                kafka_service_1.KafkaService,
                producer_1.KafkaProducer,
                consumer_1.KafkaConsumer,
            ],
            exports: [kafka_service_1.KafkaService, producer_1.KafkaProducer, consumer_1.KafkaConsumer],
        };
    }
};
exports.KafkaModule = KafkaModule;
exports.KafkaModule = KafkaModule = KafkaModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], KafkaModule);
//# sourceMappingURL=kafka.module.js.map