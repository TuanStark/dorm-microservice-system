"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultKafkaOptions = void 0;
exports.defaultKafkaOptions = {
    brokers: (process.env.KAFKA_BROKERS || 'kafka:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || undefined,
    serviceName: process.env.SERVICE_NAME || undefined,
    connectionTimeout: Number(process.env.KAFKA_CONN_TIMEOUT || 3000),
    kafkaJSConfig: {}
};
//# sourceMappingURL=kafka.config.js.map