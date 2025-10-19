import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface PaymentEventData {
  paymentId: string;
  bookingId: string;
  amount: number;
  status: string;
  transactionId?: string;
  reference?: string;
}

@Injectable()
export class RabbitMQProducerService {
  private readonly logger = new Logger(RabbitMQProducerService.name);

  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  async emitPaymentEvent(topic: string, data: PaymentEventData): Promise<void> {
    try {
      this.logger.log(`Publishing payment event to ${topic}: ${JSON.stringify(data)}`);
      
      await this.client.emit(topic, data).toPromise();
      
      this.logger.log(`✅ Payment event published successfully to ${topic}`);
    } catch (error) {
      this.logger.error(`❌ Failed to publish payment event to ${topic}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async emitBookingEvent(topic: string, data: any): Promise<void> {
    try {
      this.logger.log(`Publishing booking event to ${topic}: ${JSON.stringify(data)}`);
      
      await this.client.emit(topic, data).toPromise();
      
      this.logger.log(`✅ Booking event published successfully to ${topic}`);
    } catch (error) {
      this.logger.error(`❌ Failed to publish booking event to ${topic}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
