import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UploadsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
