import { DynamicModule } from '@nestjs/common';
import type { KafkaModuleOptions } from './interfaces/kafka-options.interface';
export declare class KafkaModule {
    static forRoot(options: KafkaModuleOptions): DynamicModule;
}
