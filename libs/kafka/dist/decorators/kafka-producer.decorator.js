"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerMethod = KafkaProducerMethod;
function KafkaProducerMethod() {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata('kafka:producer', true, target, propertyKey);
    };
}
//# sourceMappingURL=kafka-producer.decorator.js.map