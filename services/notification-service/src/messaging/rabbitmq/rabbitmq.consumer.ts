import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateNotificationDto } from '../../notification/dto/create-notification.dto';
import { NotificationService } from '../../notification/notification.service';

@Controller()
export class RabbitMQConsumerController implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQConsumerController.name);

  constructor(private readonly notificationService: NotificationService) {}

  onModuleInit() {
    this.logger.log('🚀 RabbitMQ Consumer initialized successfully');
    this.logger.log('📡 Listening for events: booking.created, booking.canceled');
  }

  @EventPattern('booking.created')
  async handleBookingCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      this.logger.log(`Received booking.created event: ${JSON.stringify(data)}`);
      
      if (!data.userId || !data.bookingId) {
        throw new Error('Missing required fields: userId, bookingId');
      }
      
      // Send booking confirmation notification
      await this.notificationService.sendBookingConfirmation(data.userId, data);

      const channel = context.getChannelRef();
      channel.ack(context.getMessage());
    } catch (error) {
      this.logger.error(`Error processing booking.created: ${error.message}`, error.stack);
      const channel = context.getChannelRef();
      channel.nack(context.getMessage(), false, true);
    }
  }

  @EventPattern('booking.canceled')
  async handleBookingCanceled(@Payload() data: { bookingId: string; userId: string; reason?: string }, @Ctx() context: RmqContext) {
    try {
      this.logger.log(`Received booking.canceled event: ${JSON.stringify(data)}`);
      
      // Send booking cancellation notification
      await this.notificationService.create({
        type: 'BOOKING_CANCELED' as any,
        title: 'Đặt phòng đã bị hủy',
        content: `Đặt phòng ${data.bookingId} đã bị hủy${data.reason ? `. Lý do: ${data.reason}` : '.'}`,
        data: data,
        channels: [
          { type: 'WEBSOCKET' as any, recipient: data.userId },
        ],
      }, data.userId);

      const channel = context.getChannelRef();
      channel.ack(context.getMessage());
    } catch (error) {
      this.logger.error(`Error processing booking.canceled: ${error.message}`, error.stack);
      const channel = context.getChannelRef();
      channel.nack(context.getMessage(), false, true);
    }
  }
}