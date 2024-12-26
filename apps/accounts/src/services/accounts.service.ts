import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Account,
  AccountDto,
  AccountStatement,
  AppConfigService,
  RabbitMQEvents,
  RabbitMQEventTypes,
  RabbitMQExchangeKeys,
} from '@app/common';

@Injectable()
export class AccountsService {
  constructor(
    private configService: AppConfigService,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async findOne(accountNumber: string): Promise<Account> {
    return this.accountsRepository.findOne({ where: { accountNumber } });
  }

  async create(accountDto: AccountDto, res: Response): Promise<Account> {
    let createdAccount: Account;
    try {
      const account = this.accountsRepository.create(accountDto);
      createdAccount = await this.accountsRepository.save(account);
    } catch (e) {
      res.status(400).json({ error: e.message });
      return;
    }

    // Publish an event event_account_created to RabbitMQ
    this.amqpConnection.publish(
      this.configService.get(RabbitMQExchangeKeys.RABBITMQ_ACCOUNTS_EXCHANGE),
      'accounts.created',
      {
        id: createdAccount.id,
        type: RabbitMQEventTypes.ACCOUNTS,
        name: RabbitMQEvents.ACCOUNT_CREATED,
        created_at: createdAccount.createdAt,
      },
    );

    return createdAccount;
  }

  async getAccountStatement(
    accountNumber: string,
    res: Response,
  ): Promise<Response> {
    // Publish an event documents.event.create.* to RabbitMQ
    this.amqpConnection.publish(
      this.configService.getOrThrow(
        RabbitMQExchangeKeys.RABBITMQ_DOCUMENTS_EXCHANGE,
      ),
      'documents.event.create.*',
      {
        type: RabbitMQEventTypes.DOCUMENTS,
        name: RabbitMQEvents.GENERATE_STATEMENT,
        fileType: 'pdf',
        accountNumber: accountNumber,
      },
    );

    return res.send({ message: 'Account statement request received.' });
  }

  async getAccountStatementData(
    accountNumber: string,
  ): Promise<AccountStatement> {
    let account: Account = {} as Account;
    try {
      account = await this.accountsRepository.findOne({
        where: { accountNumber },
        select: ['accountNumber', 'firstName', 'lastName', 'balance'],
        relations: {
          transactions: true,
        },
      });
    } catch (e) {
      console.log('Account not found', e);
    }

    return {
      ...account,
      date: new Date(),
      fileType: 'pdf',
      transactions: account?.transactions || [],
      name: `${account?.firstName} ${account?.lastName}`,
    };
  }
}
