import { Module } from '@nestjs/common';
import { ServiceHealthController } from './service-health.controller';

@Module({
  controllers: [ServiceHealthController],
})
export class ServiceHealthModule {}
