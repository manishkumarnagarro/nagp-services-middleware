import { Module } from '@nestjs/common';
import { AccountsController } from './controllers/accounts.controller';
import { AccountsService } from './services/accounts.service';
import {
  Account,
  AppConfigModule,
  AppConfigService,
  ExchangeTypes,
  RabbitMqModule,
  Transactions,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsSeedService } from './services';

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
          name: process.env.RABBITMQ_DOCUMENTS_EXCHANGE,
          type: ExchangeTypes.TOPIC,
        },
      ],
      queues: [
        {
          name: process.env.RABBITMQ_ACCOUNTS_CREATED_QUEUE,
          exchange: process.env.RABBITMQ_ACCOUNTS_EXCHANGE,
          routingKey: 'accounts.created',
        },
        {
          name: process.env.RABBITMQ_GENERATE_STATEMENT_QUEUE,
          exchange: process.env.RABBITMQ_DOCUMENTS_EXCHANGE,
          routingKey: 'documents.event.create.*',
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
        entities: [Account, Transactions],
      }),
      inject: [AppConfigService],
    }),
    TypeOrmModule.forFeature([Account, Transactions]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsSeedService],
})
export class AccountsModule {}
