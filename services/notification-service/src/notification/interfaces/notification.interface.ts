// src/notification/interfaces/notification.interface.ts

export interface INotificationData {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  data?: Record<string, any>;
  channels: NotificationChannel[];
  priority?: NotificationPriority;
  scheduledAt?: Date;
  expiresAt?: Date;
  status?: NotificationStatus;
  sentAt?: Date;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  retryCount?: number;
}

export interface INotificationChannel {
  type: ChannelType;
  recipient: string;
  subject?: string;
  template?: string;
  data?: Record<string, any>;
}

export interface INotificationResult {
  success: boolean;
  channel: ChannelType;
  messageId?: string;
  error?: string;
  deliveredAt?: Date;
}

export interface INotificationService {
  send(notification: INotificationData): Promise<INotificationResult[]>;
}

export interface IEmailService {
  sendEmail(to: string, subject: string, content: string, template?: string, data?: Record<string, any>): Promise<INotificationResult>;
}

export interface IWebSocketService {
  sendToUser(userId: string, notification: INotificationData): Promise<INotificationResult>;
  sendToRoom(room: string, notification: INotificationData): Promise<INotificationResult>;
  broadcast(notification: INotificationData): Promise<INotificationResult>;
}

export interface ITemplateService {
  render(templateName: string, data: Record<string, any>): Promise<string>;
  getTemplate(templateName: string): string;
}

export enum NotificationType {
  BOOKING_CREATED = 'booking.created',
  BOOKING_CONFIRMED = 'booking.confirmed',
  BOOKING_CANCELED = 'booking.canceled',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  ROOM_DELETED = 'room.deleted',
  ROOM_UPDATED = 'room.updated',
  SYSTEM_MAINTENANCE = 'system.maintenance',
  WELCOME = 'welcome',
  REMINDER = 'reminder',
}

export enum ChannelType {
  EMAIL = 'email',
  WEBSOCKET = 'websocket',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export type NotificationChannel = {
  type: ChannelType;
  recipient: string;
  subject?: string;
  template?: string;
  data?: Record<string, any>;
};
