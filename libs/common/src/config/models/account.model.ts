import {
  IsAlpha,
  IsDateString,
  IsEmail,
  IsEnum,
  IsISO4217CurrencyCode,
  IsNumberString,
} from 'class-validator';
import { AccountType } from './enum';
import { Transactions } from './transaction.entity';

export class AccountDto {
  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;

  @IsNumberString()
  identificationNumber: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsEmail()
  email: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsISO4217CurrencyCode()
  currency: string;

  @IsNumberString({ no_symbols: true })
  mobileNumber: string;

  branchCode: string;
}

export interface AccountStatement {
  accountNumber: string;
  transactions: Transactions[];
  name: string;
  balance: number;
  date: Date;
  fileType?: string;
}
