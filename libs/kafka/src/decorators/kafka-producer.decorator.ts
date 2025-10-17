// Lightweight decorator to mark method as producer helper — optional (for metadata)
export function KafkaProducerMethod() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      Reflect.defineMetadata('kafka:producer', true, target, propertyKey);
    };
  }
  