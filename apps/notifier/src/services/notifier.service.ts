import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotifierService {
  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_DOCUMENTS_EXCHANGE,
    queue: process.env.RABBITMQ_STATEMENT_GENERATED_QUEUE_SERVICE2,
    routingKey: 'documents.statement_generated',
  })
  handleDocumentGenerated(data: any): void {
    console.log(
      'Notification service 2: Document Generated Event received',
      data,
    );
  }

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_ACCOUNTS_EXCHANGE,
    queue: process.env.RABBITMQ_ACCOUNTS_CREATED_QUEUE,
    routingKey: 'accounts.created',
  })
  handleAccountCreation(data: any): void {
    console.log('Notification service 2: Account created event received', data);
  }
}
