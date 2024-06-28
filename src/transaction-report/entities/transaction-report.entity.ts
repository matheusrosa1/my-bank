import { AccountEntity } from '../../account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'transaction_reports' })
export class TransactionReportEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'account_id', nullable: false })
  accountId: number;

  @Column({ name: 'startDate', type: 'date', nullable: false })
  startDate: Date;

  @Column({ name: 'endDate', type: 'date', nullable: false })
  endDate: Date;

  @Column('numeric', { name: 'totalAmount', scale: 2, nullable: false })
  totalAmount: number;

  @Column({ type: 'jsonb', nullable: true })
  payments: Record<string, any>;

  @ManyToOne(() => AccountEntity, (account) => account.transactionReports)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity; // Cada pagamento pertence a uma conta
}
