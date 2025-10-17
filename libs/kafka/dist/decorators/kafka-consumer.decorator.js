"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerMethod = KafkaConsumerMethod;
exports.getKafkaConsumers = getKafkaConsumers;
function KafkaConsumerMethod(topic) {
    return function (target, propertyKey, descriptor) {
        const existing = Reflect.getMetadata('kafka:consumers', target.constructor) || [];
        existing.push({ topic, method: propertyKey });
        Reflect.defineMetadata('kafka:consumers', existing, target.constructor);
    };
}
function getKafkaConsumers(target) {
    return Reflect.getMetadata('kafka:consumers', target.constructor) || [];
}
//# sourceMappingURL=kafka-consumer.decorator.js.map