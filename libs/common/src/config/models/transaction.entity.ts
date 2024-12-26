import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Timestamp,
  JoinTable,
} from 'typeorm';
import { Account } from './account.entity';
import { TransactionMode, TransactionStatus, TransactionType } from './enum';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: TransactionType,
    enumName: 'transaction_type',
    type: 'enum',
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionMode,
    default: TransactionMode.OTHERS,
  })
  mode: TransactionMode;

  @Column('double')
  amount: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  date: Date;

  @Column({
    type: 'bigint',
    zerofill: true,
  })
  fromAccount: string;

  @Column({
    type: 'bigint',
    zerofill: true,
  })
  toAccount: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column('double')
  balance: number;

  @Column({
    enum: TransactionStatus,
    type: 'enum',
    default: TransactionStatus.INITIATED,
  })
  status: TransactionStatus;

  @ManyToOne(() => Account, { cascade: true })
  @JoinTable()
  account?: Account;
}
