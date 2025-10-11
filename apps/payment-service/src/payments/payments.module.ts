import { Module, forwardRef } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { VietqrProvider } from './provider/vietqr.provider';
import { EmailWatcherService } from '../email-watcher/email-watcher.service';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    forwardRef(() => KafkaModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, VietqrProvider, EmailWatcherService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
