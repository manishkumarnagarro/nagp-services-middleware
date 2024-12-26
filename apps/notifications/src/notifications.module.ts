import { Module } from '@nestjs/common';
import { NotificationsService } from './services';
import { AppConfigModule, ExchangeTypes, RabbitMqModule } from '@app/common';

@Module({
  imports: [
    AppConfigModule,
    RabbitMqModule.withConfig({
      exchanges: [
        {
          name: process.env.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
          type: ExchangeTypes.FANOUT,
        },
      ],
      queues: [
        {
          name: process.env.RABBITMQ_STATEMENT_GENERATED_QUEUE,
          exchange: process.env.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [NotificationsService],
})
export class NotificationsModule {}
