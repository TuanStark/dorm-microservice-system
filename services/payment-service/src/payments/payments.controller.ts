import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from '@prisma/client';
import { CreatePaymentDto, VerifyPaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    // Extract userId from x-user-id header sent by API Gateway
    const userId = req.headers['x-user-id'] as string;
    console.log('Create payment request received:', createPaymentDto);
    console.log('UserId from header:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return this.paymentsService.createPayment(userId,{
      ...createPaymentDto,
    });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Get()
  async list() {
    return this.paymentsService.listPayments();
  }

  // manual verify endpoint (for testing)
  @Post(':id/verify')
  async manualVerify(@Param('id') id: string, @Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.updateStatusByPaymentId(id, PaymentStatus.SUCCESS, verifyPaymentDto.transactionId);
  }

  // test VietQR configuration
  @Get('test/vietqr')
  async testVietQR() {
    return this.paymentsService.testVietQRConfig();
  }
}
