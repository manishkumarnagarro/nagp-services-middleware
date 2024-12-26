import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  Timestamp,
  CreateDateColumn,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Transactions } from './transaction.entity';
import { AccountType } from './enum';

@Entity()
export class Account {
  @Column({
    type: 'uuid',
    generated: 'uuid',
  })
  id: string;

  @PrimaryGeneratedColumn('increment', { type: 'bigint', zerofill: true })
  accountNumber: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  identificationNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    enum: AccountType,
    enumName: 'account_type',
    type: 'enum',
  })
  accountType: AccountType;

  @Column()
  mobileNumber: string;

  @Column()
  branchCode: string;

  @Column()
  currency: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDormant: boolean;

  @Column({
    type: 'double',
    default: 0,
  })
  balance: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Timestamp;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  lastUpdatedAt: Timestamp;

  @OneToMany(() => Transactions, (transaction) => transaction.account)
  @JoinTable()
  transactions?: Transactions[];
}
