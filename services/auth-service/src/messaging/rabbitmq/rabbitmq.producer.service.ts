import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface CreateUserEventData {
  id: string;
  email: string;
  password: string;
  fullName: string;
  roleId: string;
  codeId: string;
  codeExpired: Date;
}

@Injectable()
export class RabbitMQProducerService {
  private readonly logger = new Logger(RabbitMQProducerService.name);

  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  async emitCreateUserEvent(topic: string, data: CreateUserEventData): Promise<void> {
    try {
      this.logger.log(`Publishing create user event to ${topic}: ${JSON.stringify(data)}`);
      
      await this.client.emit(topic, data).toPromise();
      
      this.logger.log(`✅ Create user event published successfully to ${topic}`);
    } catch (error) {
      this.logger.error(`❌ Failed to publish create user event to ${topic}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async emitResendVerificationCodeEvent(topic: string, data: CreateUserEventData): Promise<void> {
    try {
      this.logger.log(`Publishing resend verification code event to ${topic}: ${JSON.stringify(data)}`);
      
      await this.client.emit(topic, data).toPromise();
      
      this.logger.log(`✅ Resend verification code event published successfully to ${topic}`);
    } catch (error) {
      this.logger.error(`❌ Failed to publish resend verification code event to ${topic}: ${error.message}`, error.stack);
      throw error;
    }
  }

}
