import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaClient, PaymentStatus, PaymentMethod } from '@prisma/client';
import { VietqrProvider } from './provider/vietqr.provider';
import { KafkaProducerService } from '../kafka/kafka.producer.service';
import { KafkaTopics } from 'src/kafka/kafka-topics.enum';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly vietqr: VietqrProvider,
    private readonly kafka: KafkaProducerService,
  ) {}

  private providerFor(method: PaymentMethod | string) {
    if (String(method).toUpperCase() === 'VIETQR') return this.vietqr;
    throw new BadRequestException('Unsupported provider');
  }

  // create payment and return record + qr url
  async createPayment(userId: string, dto: CreatePaymentDto) {
    const provider = this.providerFor(dto.method);
    const { qrImageUrl, paymentUrl, reference } = await provider.createPayment({
      amount: dto.amount,
      orderId: dto.bookingId,
      addInfo: `BOOKING_${dto.bookingId}`,
    });

    const payment = await this.prisma.payment.create({
      data: {
        userId: userId,
        bookingId: dto.bookingId,
        amount: dto.amount,
        method: dto.method as PaymentMethod,
        qrImageUrl,
        paymentUrl,
        reference,
        status: PaymentStatus.PENDING,
      },
    });

    this.logger.log(`Payment created ${payment.id}`);
    return payment;
  }

  // update status and publish kafka
  async updateStatusByPaymentId(paymentId: string, status: PaymentStatus, transactionId?: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        transactionId: transactionId ?? undefined,
        paymentDate: status === PaymentStatus.SUCCESS ? new Date() : undefined,
      },
    });

    const topic = status === PaymentStatus.SUCCESS ? 'payment.success' : 'payment.failed';
    await this.kafka.emitPaymentEvent(topic, {
      paymentId: payment.id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      status: payment.status,
      transactionId: payment.transactionId,
      reference: payment.reference,
    });

    this.logger.log(`Payment ${paymentId} => ${status}, published ${topic}`);
    return payment;
  }

  async verifyPaymentFromEmail(data: { bookingId: string; amount: number; rawMessage: string }) {
    const { bookingId, amount } = data;

    const payment = await this.prisma.payment.findFirst({
      where: { bookingId, status: 'PENDING' },
    });

    if (!payment) {
      this.logger.warn(`No pending payment found for booking ${bookingId}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        paymentDate: new Date(),
      },
    });

    await this.kafka.emitPaymentEvent(KafkaTopics.PAYMENT_STATUS_UPDATED, {
      bookingId: payment.bookingId,
      status: 'SUCCESS',
      amount,
    });

    this.logger.log(`✅ Payment verified for booking ${bookingId}, event pushed.`);
  }

  async getPayment(paymentId: string) {
    return this.prisma.payment.findUnique({ where: { id: paymentId } });
  }

  async listPayments() {
    return this.prisma.payment.findMany();
  }

  // add in PaymentsService
async findPaymentByReference(reference: string) {
  return this.prisma.payment.findFirst({ where: { reference } });
}

// test VietQR configuration
async testVietQRConfig() {
  try {
    const testPayment = await this.vietqr.createPayment({
      amount: 100000,
      orderId: 'TEST_123',
      addInfo: 'BOOKING_TEST_123',
    });

    return {
      success: true,
      message: 'VietQR configuration is working',
      config: {
        accountNo: process.env.VIETQR_ACCOUNT_NO,
        acqId: process.env.VIETQR_ACQ_ID,
        accountName: process.env.VIETQR_ACCOUNT_NAME,
      },
      testPayment,
    };
  } catch (error) {
    return {
      success: false,
      message: 'VietQR configuration error',
      error: error.message,
      config: {
        accountNo: process.env.VIETQR_ACCOUNT_NO,
        acqId: process.env.VIETQR_ACQ_ID,
        accountName: process.env.VIETQR_ACCOUNT_NAME,
      },
    };
  }
}

}
