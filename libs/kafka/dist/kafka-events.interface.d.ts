export interface BaseKafkaEvent {
    eventId: string;
    timestamp: Date;
    version: string;
    source: string;
}
export interface BookingCreatedEvent extends BaseKafkaEvent {
    type: 'booking.created';
    data: {
        bookingId: string;
        userId: string;
        roomId: string;
        amount: number;
        startDate: Date;
        endDate: Date;
        status: string;
    };
}
export interface BookingCanceledEvent extends BaseKafkaEvent {
    type: 'booking.canceled';
    data: {
        bookingId: string;
        userId: string;
        reason: string;
        canceledAt: Date;
    };
}
export interface PaymentSuccessEvent extends BaseKafkaEvent {
    type: 'payment.success';
    data: {
        paymentId: string;
        bookingId: string;
        userId: string;
        amount: number;
        method: string;
        transactionId: string;
    };
}
export interface PaymentFailedEvent extends BaseKafkaEvent {
    type: 'payment.failed';
    data: {
        paymentId: string;
        bookingId: string;
        userId: string;
        amount: number;
        reason: string;
        failedAt: Date;
    };
}
export interface RoomCreatedEvent extends BaseKafkaEvent {
    type: 'room.created';
    data: {
        roomId: string;
        buildingId: string;
        roomNumber: string;
        capacity: number;
        price: number;
        amenities: string[];
    };
}
export interface UserRegisteredEvent extends BaseKafkaEvent {
    type: 'user.registered';
    data: {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}
export type KafkaEvent = BookingCreatedEvent | BookingCanceledEvent | PaymentSuccessEvent | PaymentFailedEvent | RoomCreatedEvent | UserRegisteredEvent;
