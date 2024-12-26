import { Body, Controller, Get, Post, Param, Res } from '@nestjs/common';
import { AccountsService } from './../services/accounts.service';
import { Response } from 'express';
import { GrpcMethod } from '@nestjs/microservices';
import { error } from 'console';
import { Account, AccountDto } from '@app/common';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async getAccounts(): Promise<Account[]> {
    return [];
  }

  @Get('/:accNum')
  getAccountByNumber(@Param('accNum') accNum: string): Promise<Account> {
    return this.accountsService.findOne(accNum);
  }

  @Post()
  async createAccount(
    @Body() accountDto: AccountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Account> {
    return await this.accountsService.create(accountDto, res);
  }

  @Get('/:accNum/statement')
  getAccountStatement(
    @Param('accNum') accNum: string,
    @Res() res,
  ): Promise<Response> {
    return this.accountsService.getAccountStatement(accNum, res);
  }

  @GrpcMethod('AccountsService', 'GetAccountStatement')
  async getAccountStatementGrpc(data) {
    return await this.accountsService.getAccountStatementData(
      data.accountNumber,
    );
  }
}
