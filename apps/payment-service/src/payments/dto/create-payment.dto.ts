import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsString()
  @Type(() => String)
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}

export class VerifyPaymentDto {
  @IsOptional()
  @IsString()
  transactionId?: string;
}