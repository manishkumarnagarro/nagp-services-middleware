export enum TransactionType {
  DEPOSIT = 'CR',
  WITHDRAWAL = 'DR',
  TRANSFER = 'TR',
}

export enum TransactionMode {
  CHEQUE = 'Cheque',
  ONLINE = 'Online',
  APP = 'App',
  CASH = 'Cash',
  OTHERS = 'Others',
}

export enum TransactionStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum AccountType {
  SAVINGS = 'S',
  CURRENT = 'C',
}
