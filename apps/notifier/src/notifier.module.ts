import { Module } from '@nestjs/common';
import { NotifierService } from './services';
import { AppConfigModule, ExchangeTypes, RabbitMqModule } from '@app/common';

@Module({
  imports: [
    AppConfigModule,
    RabbitMqModule.withConfig({
      exchanges: [
        {
          name: process.env.RABBITMQ_ACCOUNTS_EXCHANGE,
          type: ExchangeTypes.TOPIC,
        },
        {
          name: process.env.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
          type: ExchangeTypes.FANOUT,
        },
      ],
      queues: [
        {
          name: process.env.RABBITMQ_ACCOUNTS_CREATED_QUEUE,
          exchange: process.env.RABBITMQ_ACCOUNTS_EXCHANGE,
          routingKey: 'accounts.created',
        },
        {
          name: process.env.RABBITMQ_STATEMENT_GENERATED_QUEUE_SERVICE2,
          exchange: process.env.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
          routingKey: 'documents.statement_generated',
        },
      ],
    }),
  ],
  controllers: [],
  providers: [NotifierService],
})
export class NotifierModule {}
