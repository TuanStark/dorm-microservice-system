# @libs/kafka

Shared Kafka library (KafkaJS) for NestJS microservices.

Quickstart:
1. Copy this folder to `libs/kafka`.
2. Run `npm install` inside `libs/kafka`.
3. Run `npm run build`.
4. In each service import:
   ```ts
   KafkaModule.forRoot({
     brokers: process.env.KAFKA_BROKERS.split(','),
     clientId: process.env.KAFKA_CLIENT_ID || 'booking-service',
     serviceName: process.env.SERVICE_NAME || 'booking-service'
   })
