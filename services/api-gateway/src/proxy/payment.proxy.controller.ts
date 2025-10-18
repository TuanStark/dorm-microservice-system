import { All, Controller, Req, Res, UseGuards, UseInterceptors, UseFilters, Get } from '@nestjs/common';
import express from 'express';
import { UpstreamService } from '../services/upstream.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from '../common/filters/http-exception.filter';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('payment')
@UseInterceptors(LoggingInterceptor, AnyFilesInterceptor())
@UseFilters(AllExceptionsFilter)
export class PaymentProxyController {
  constructor(private readonly upstream: UpstreamService) {}

  // Public route - GET all payments (không cần JWT)
  @Public()
  @Get()
  async getAllPayments(@Req() req: express.Request, @Res() res: express.Response) {
    try {
      const authHeader = req.headers['authorization'];
      const path = req.originalUrl.replace(/^\/payment/, '');

      const result = await this.upstream.forwardRequest(
        'payment',
        `/payment${path}`,
        req.method,
        req.body,
        { 
          authorization: authHeader,
        },
      );
      res.json(result);
    } catch (error) {
      const status = (error && error.status) || 500;
      res.status(status).json({ error: error.message || 'Internal Gateway Error' });
    }
  }

  // Protected routes - Tất cả methods khác (cần JWT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('*')
  async proxyPayment(@Req() req: express.Request, @Res() res: express.Response) {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;
      
      const path = req.originalUrl.replace(/^\/payment/, '');

      const result = await this.upstream.forwardRequest(
        'payment',
        `/payment${path}`,
        req.method,
        req.body,
        { 
          authorization: req.headers['authorization'],
          'x-user-id': userId,
        },
      );
      res.json(result);
    } catch (error) {
      const status = (error && error.status) || 500;
      res.status(status).json({ error: error.message || 'Internal Gateway Error' });
    }
  }

  // Handle base path /payment (no trailing segment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @All()
  async proxyPaymentBase(@Req() req: express.Request, @Res() res: express.Response) {
    return this.proxyPayment(req, res);
  }
}