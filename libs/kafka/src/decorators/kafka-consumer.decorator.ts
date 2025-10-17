// Lightweight decorator to attach metadata about consumer methods (topic)
export function KafkaConsumerMethod(topic: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const existing = Reflect.getMetadata('kafka:consumers', target.constructor) || [];
      existing.push({ topic, method: propertyKey });
      Reflect.defineMetadata('kafka:consumers', existing, target.constructor);
    };
  }
  
  export function getKafkaConsumers(target: any) {
    return Reflect.getMetadata('kafka:consumers', target.constructor) || [];
  }
  