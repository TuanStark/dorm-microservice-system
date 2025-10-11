import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { KafkaTopics } from './kafka-topics.enum';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from '../payments/payments.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentsService: PaymentsService,
  ) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID') || 'payment-service',
      brokers: this.configService.get<string>('KAFKA_BROKER')?.split(',') || ['localhost:9092'],
    });

    this.consumer = this.kafka.consumer({ groupId: this.configService.get<string>('KAFKA_GROUP_ID') || 'payment-group' });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();

      //Sub tất cả các topic mà service này quan tâm
      // Booking events - Payment service cần biết khi có booking để tạo payment
      await this.consumer.subscribe({ topic: KafkaTopics.BOOKING_CREATED });
      await this.consumer.subscribe({ topic: KafkaTopics.BOOKING_CANCELED });
      
      await this.run();
    } catch (error) {
      console.warn('⚠️ Kafka not available, skipping consumer setup:', error.message);
    }
  }

  private async run() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const value = message.value?.toString();
        if (!value) return;

        const data = JSON.parse(value);
        switch (topic) {
          // Booking events
          case KafkaTopics.BOOKING_CREATED:
            await this.handleBookingCreated(data);
            break;
          case KafkaTopics.BOOKING_CANCELED:
            await this.handleBookingCanceled(data);
            break;
            
          default:
            console.warn(`Unhandled topic: ${topic}`);
        }
      },
    });
  }

  // Logic xử lý khi nhận event
  
  // Booking events
  private async handleBookingCreated(data: any) {
    console.log('📩 [Kafka] Booking created event received:', data);
    
    try {
      const { bookingId, userId, roomId, amount, startDate, endDate } = data;
      
      if (!bookingId || !userId || !amount) {
        console.warn('⚠️ Missing required fields in booking created event:', { bookingId, userId, amount });
        return;
      }

      // Kiểm tra xem đã có payment cho booking này chưa
      const existingPayment = await this.paymentsService.findPaymentByReference(`BOOKING_${bookingId.substring(0, 8)}`);
      if (existingPayment) {
        console.log(`ℹ️ Payment already exists for booking ${bookingId}`);
        return;
      }

      // Tạo payment record với status PENDING
      const payment = await this.paymentsService.createPayment(userId, {
        bookingId,
        amount: parseFloat(amount.toString()),
        method: 'VIETQR', // Default method
      });

      console.log(`✅ Payment created for booking ${bookingId}: ${payment.id}`);
      
    } catch (error) {
      console.error('❌ Error handling booking created event:', error.message);
    }
  }

  private async handleBookingCanceled(data: any) {
    console.log('📩 [Kafka] Booking canceled event received:', data);
    
    try {
      const { bookingId, userId, reason } = data;
      
      if (!bookingId) {
        console.warn('⚠️ Missing bookingId in booking canceled event');
        return;
      }

      // Tìm payment liên quan đến booking này
      const payment = await this.paymentsService.findPaymentByReference(`BOOKING_${bookingId.substring(0, 8)}`);
      if (!payment) {
        console.log(`ℹ️ No payment found for booking ${bookingId}`);
        return;
      }

      // Kiểm tra payment status
      if (payment.status === PaymentStatus.SUCCESS) {
        console.log(`ℹ️ Payment ${payment.id} already completed, cannot cancel`);
        return;
      }

      if (payment.status === PaymentStatus.FAILED) {
        console.log(`ℹ️ Payment ${payment.id} already failed`);
        return;
      }

      // Cancel payment (chỉ có thể cancel nếu status là PENDING)
      if (payment.status === PaymentStatus.PENDING) {
        await this.paymentsService.updateStatusByPaymentId(payment.id, PaymentStatus.FAILED);
        console.log(`✅ Payment ${payment.id} canceled for booking ${bookingId}`);
      }
      
    } catch (error) {
      console.error('❌ Error handling booking canceled event:', error.message);
    }
  }
}
