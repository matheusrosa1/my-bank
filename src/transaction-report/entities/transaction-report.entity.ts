import { AccountEntity } from 'src/account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'reports' })
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

  @ManyToOne(() => AccountEntity, (account) => account.transactionReports)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity; // Cada pagamento pertence a uma conta
}
