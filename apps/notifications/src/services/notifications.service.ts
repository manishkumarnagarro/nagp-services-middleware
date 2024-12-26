import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
    queue: process.env.RABBITMQ_STATEMENT_GENERATED_QUEUE,
    routingKey: 'documents.statement_generated',
  })
  handleDocumentGeneratedEvent(data: any): void {
    console.log(
      'Notification Service 1: Document Generated Event received',
      data,
    );
  }
}
