import { Module } from '@nestjs/common';
import { DocumentsService } from './services/documents.service';
import {
  AppConfigModule,
  AppConfigService,
  ExchangeTypes,
  RabbitMqModule,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DocumentsController } from './controllers/documents.controller';

@Module({
  imports: [
    AppConfigModule,
    RabbitMqModule.withConfig({
      exchanges: [
        {
          name: process.env.RABBITMQ_DOCUMENTS_EXCHANGE,
          type: ExchangeTypes.TOPIC,
        },
        {
          name: process.env.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
          type: ExchangeTypes.FANOUT,
        },
      ],
      queues: [
        {
          name: process.env.RABBITMQ_GENERATE_STATEMENT_QUEUE,
          exchange: process.env.RABBITMQ_DOCUMENTS_EXCHANGE,
          routingKey: 'documents.event.create.*',
        },
        {
          name: process.env.RABBITMQ_STATEMENT_GENERATED_QUEUE,
          exchange: process.env.RABBITMQ_DOCUMENTS_NOTIFICATIONS_EXCHANGE,
        },
      ],
    }),
    ClientsModule.register([
      {
        name: process.env.ACCOUNTS_SERVICE_GRPC,
        transport: Transport.GRPC,
        options: {
          protoPath: join(__dirname, 'accounts.proto'),
          package: process.env.ACCOUNTS_GRPC_PACKAGE,
          url: `accounts:${process.env.GRPC_PORT}`,
        },
      },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
