import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaProducer, KafkaConsumer, EventEnvelope } from '@libs/kafka';
import { BookingService } from '../bookings/bookings.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingKafkaService implements OnModuleInit {
  private readonly logger = new Logger(BookingKafkaService.name);

  constructor(
    private readonly kafkaProducer: KafkaProducer,
    private readonly kafkaConsumer: KafkaConsumer,
    private readonly bookingService: BookingService,
  ) {}

  async onModuleInit() {
    await this.initializeConsumer();
  }

  // Producer methods - Publish booking events
  async publishBookingCreatedEvent(bookingData: {
    bookingId: string;
    userId: string;
    roomId: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    status: BookingStatus;
  }) {
    const envelope = await this.kafkaProducer.send(
      'booking.created',
      'BookingCreated',
      bookingData,
      bookingData.bookingId
    );
    
    this.logger.log(`✅ Booking created event published: ${bookingData.bookingId}`);
    return envelope;
  }

  async publishBookingCanceledEvent(bookingData: {
    bookingId: string;
    userId: string;
    reason: string;
    canceledAt: Date;
  }) {
    const envelope = await this.kafkaProducer.send(
      'booking.canceled',
      'BookingCanceled',
      bookingData,
      bookingData.bookingId
    );
    
    this.logger.log(`❌ Booking canceled event published: ${bookingData.bookingId}`);
    return envelope;
  }

  async publishBookingUpdatedEvent(bookingData: {
    bookingId: string;
    userId: string;
    oldStatus: BookingStatus;
    newStatus: BookingStatus;
    reason?: string;
  }) {
    const envelope = await this.kafkaProducer.send(
      'booking.updated',
      'BookingUpdated',
      {
        ...bookingData,
        updatedAt: new Date(),
      },
      bookingData.bookingId
    );
    
    this.logger.log(`🔄 Booking updated event published: ${bookingData.bookingId}`);
    return envelope;
  }

  // Consumer methods - Handle incoming events
  private async initializeConsumer() {
    const consumer = await this.kafkaConsumer.createConsumer('booking-service-consumer');
    
    // Subscribe to payment events
    await this.kafkaConsumer.runConsumer(
      consumer,
      'payment.success',
      async (payload) => await this.handlePaymentSuccess(payload)
    );

    await this.kafkaConsumer.runConsumer(
      consumer,
      'payment.failed',
      async (payload) => await this.handlePaymentFailed(payload)
    );

    await this.kafkaConsumer.runConsumer(
      consumer,
      'payment.refunded',
      async (payload) => await this.handlePaymentRefunded(payload)
    );

    // Subscribe to room events
    await this.kafkaConsumer.runConsumer(
      consumer,
      'room.deleted',
      async (payload) => await this.handleRoomDeleted(payload)
    );

    this.logger.log('📥 Booking service subscribed to payment and room events');
  }

  // Event handlers
  private async handlePaymentSuccess(payload: any) {
    try {
      const envelope: EventEnvelope = JSON.parse(payload.message.value.toString());
      const data = envelope.payload;
      
      this.logger.log('📩 [Kafka] Payment success event received:', data);
      
      const { bookingId, paymentId, amount, transactionId } = data;
      
      if (!bookingId) {
        this.logger.warn('⚠️ Missing bookingId in payment success event');
        return;
      }

      // Update booking status từ PENDING → CONFIRMED
      const booking = await this.bookingService.findOne(bookingId);
      if (!booking) {
        this.logger.warn(`⚠️ Booking ${bookingId} not found`);
        return;
      }

      if (booking.status === BookingStatus.PENDING) {
        await this.bookingService.update(bookingId, { 
          status: BookingStatus.CONFIRMED 
        });
        
        // Publish booking updated event
        await this.publishBookingUpdatedEvent({
          bookingId,
          userId: booking.userId,
          oldStatus: BookingStatus.PENDING,
          newStatus: BookingStatus.CONFIRMED,
          reason: 'Payment successful',
        });
        
        this.logger.log(`✅ Booking ${bookingId} confirmed after payment success`);
      } else {
        this.logger.log(`ℹ️ Booking ${bookingId} already ${booking.status}, skipping`);
      }
      
    } catch (error) {
      this.logger.error('❌ Error handling payment success event:', error.message);
    }
  }

  private async handlePaymentFailed(payload: any) {
    try {
      const envelope: EventEnvelope = JSON.parse(payload.message.value.toString());
      const data = envelope.payload;
      
      this.logger.log('📩 [Kafka] Payment failed event received:', data);
      
      const { bookingId, paymentId, reason } = data;
      
      if (!bookingId) {
        this.logger.warn('⚠️ Missing bookingId in payment failed event');
        return;
      }

      // Update booking status từ PENDING → CANCELED
      const booking = await this.bookingService.findOne(bookingId);
      if (!booking) {
        this.logger.warn(`⚠️ Booking ${bookingId} not found`);
        return;
      }

      if (booking.status === BookingStatus.PENDING) {
        await this.bookingService.update(bookingId, { 
          status: BookingStatus.CANCELED 
        });
        
        // Publish booking canceled event
        await this.publishBookingCanceledEvent({
          bookingId,
          userId: booking.userId,
          reason: `Payment failed: ${reason || 'Unknown reason'}`,
          canceledAt: new Date(),
        });
        
        this.logger.log(`✅ Booking ${bookingId} canceled after payment failed`);
      } else {
        this.logger.log(`ℹ️ Booking ${bookingId} already ${booking.status}, skipping`);
      }
      
    } catch (error) {
      this.logger.error('❌ Error handling payment failed event:', error.message);
    }
  }

  private async handlePaymentRefunded(payload: any) {
    try {
      const envelope: EventEnvelope = JSON.parse(payload.message.value.toString());
      const data = envelope.payload;
      
      this.logger.log('📩 [Kafka] Payment refunded event received:', data);
      
      const { bookingId, paymentId, refundAmount, reason } = data;
      
      if (!bookingId) {
        this.logger.warn('⚠️ Missing bookingId in payment refunded event');
        return;
      }

      // Update booking status từ CONFIRMED → CANCELED (refunded)
      const booking = await this.bookingService.findOne(bookingId);
      if (!booking) {
        this.logger.warn(`⚠️ Booking ${bookingId} not found`);
        return;
      }

      if (booking.status === BookingStatus.CONFIRMED) {
        await this.bookingService.update(bookingId, { 
          status: BookingStatus.CANCELED 
        });
        
        // Publish booking canceled event
        await this.publishBookingCanceledEvent({
          bookingId,
          userId: booking.userId,
          reason: `Payment refunded: ${reason || 'Unknown reason'}`,
          canceledAt: new Date(),
        });
        
        this.logger.log(`✅ Booking ${bookingId} canceled after payment refunded`);
      } else {
        this.logger.log(`ℹ️ Booking ${bookingId} status is ${booking.status}, cannot refund`);
      }
      
    } catch (error) {
      this.logger.error('❌ Error handling payment refunded event:', error.message);
    }
  }

  private async handleRoomDeleted(payload: any) {
    try {
      const envelope: EventEnvelope = JSON.parse(payload.message.value.toString());
      const data = envelope.payload;
      
      this.logger.log('📩 [Kafka] Room deleted event received:', data);
      
      const { roomId, buildingId } = data;
      
      if (!roomId) {
        this.logger.warn('⚠️ Missing roomId in room deleted event');
        return;
      }

      // Cancel all future bookings for this room
      const futureBookings = await this.bookingService.getBookingByRoomId(roomId);
      
      for (const booking of futureBookings) {
        // Chỉ cancel bookings trong tương lai
        if (new Date(booking.startDate) > new Date()) {
          await this.bookingService.update(booking.id, { 
            status: BookingStatus.CANCELED 
          });
          
          // Publish booking canceled event
          await this.publishBookingCanceledEvent({
            bookingId: booking.id,
            userId: booking.userId,
            reason: `Room ${roomId} deleted`,
            canceledAt: new Date(),
          });
          
          this.logger.log(`✅ Canceled future booking ${booking.id} for deleted room ${roomId}`);
        }
      }
      
    } catch (error) {
      this.logger.error('❌ Error handling room deleted event:', error.message);
    }
  }
}
