import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { accounts } from './../init-db/accounts';
import { transactions } from './../init-db/transactions';
import { Account, Transactions } from '@app/common';

@Injectable()
export class AccountsSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Account) private accountsRepository: Repository<Account>,
    @InjectRepository(Transactions)
    private transactionRepo: Repository<Transactions>,
  ) {}

  async onModuleInit() {
    console.info('Accounts Service: Seeding accounts and transactions');
    try {
      await this.seedAccounts();
      await this.seedTransactions();
    } catch (e) {
      // In case of service restart the records exists already so fail silently
    }
  }

  async seedTransactions() {
    transactions.forEach(async (t: Partial<Transactions>) => {
      const account = await this.accountsRepository.findOneBy({
        accountNumber: BigInt(t.fromAccount).toString(),
      });
      t.account = account;
      const date = new Date();
      const trans = await this.transactionRepo.create(t);
      trans.description = `${t.mode}/${date.getMonth()}/${date.getFullYear()}`;
      await this.transactionRepo.save(trans);
    });
  }

  async seedAccounts() {
    const acc = await this.accountsRepository.create(accounts);
    await this.accountsRepository.save(acc);
  }
}
