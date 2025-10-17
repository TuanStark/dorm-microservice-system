export interface KafkaTopic {
    name: string;
    partitions?: number;
    replicationFactor?: number;
    config?: Record<string, any>;
  }
  